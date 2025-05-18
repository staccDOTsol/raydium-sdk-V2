import { Connection, PublicKey } from '@solana/web3.js';
import { CREATE_CPMM_POOL_PROGRAM, CREATE_CPMM_POOL_AUTH, CREATE_CPMM_POOL_FEE_ACC } from '../common/programId';
import { CLMM_PROGRAM_ID } from '../common/programId';
import { CpmmPoolInfoLayout, CpmmConfigInfoLayout } from '../raydium/cpmm/layout';
import { ClmmConfigLayout, PoolInfoLayout } from '../raydium/clmm/layout';
import dotenv from 'dotenv';

dotenv.config();

// Update to use single Helius endpoint
const RPC_ENDPOINT = "https://medieval-outscreams-wuaxgghwke-dedicated.helius-rpc.com?api-key=f3fd250b-15cf-410c-a3c8-a513af7bff9f";

// Create connection with the working Helius endpoint
const connection = new Connection(RPC_ENDPOINT, {
  commitment: 'confirmed',
});

/**
 * In-memory cache for vault balances to track changes
 * In a production environment, this would be stored in a database
 */
const vaultBalanceHistory: Record<string, any[]> = {};
const MAX_HISTORY_LENGTH = 144; // 24 hours of 10-minute intervals

/**
 * Record current vault balances and track changes over time
 * @param vaultAddress Token vault address
 * @param balance Current balance info
 */
export function trackVaultBalance(vaultAddress: string, balance: any) {
  if (!vaultBalanceHistory[vaultAddress]) {
    vaultBalanceHistory[vaultAddress] = [];
  }
  
  // Create entry with timestamp
  const entry = {
    timestamp: Date.now(),
    amount: balance.amount,
    uiAmount: balance.uiAmount
  };
  
  // Add to history
  vaultBalanceHistory[vaultAddress].push(entry);
  
  // Limit history length
  if (vaultBalanceHistory[vaultAddress].length > MAX_HISTORY_LENGTH) {
    vaultBalanceHistory[vaultAddress] = vaultBalanceHistory[vaultAddress].slice(-MAX_HISTORY_LENGTH);
  }
}

/**
 * Calculate volume based on vault balance changes
 * @param vaultAddress Token vault address
 * @param timeWindow Time window in milliseconds (e.g., 24 hours = 86400000)
 */
export function calculateVolumeFromBalanceChanges(vaultAddress: string, timeWindow: number): number {
  if (!vaultBalanceHistory[vaultAddress] || vaultBalanceHistory[vaultAddress].length < 2) {
    return 0;
  }
  
  const history = vaultBalanceHistory[vaultAddress];
  const now = Date.now();
  const cutoffTime = now - timeWindow;
  
  // Filter to entries within the time window
  const relevantHistory = history.filter(entry => entry.timestamp >= cutoffTime);
  
  if (relevantHistory.length < 2) {
    return 0;
  }
  
  // Calculate sum of absolute differences between consecutive balances
  let volume = 0;
  for (let i = 1; i < relevantHistory.length; i++) {
    const currentAmount = BigInt(relevantHistory[i].amount);
    const previousAmount = BigInt(relevantHistory[i - 1].amount);
    
    // Calculate absolute difference and add to volume
    const difference = currentAmount > previousAmount 
      ? currentAmount - previousAmount
      : previousAmount - currentAmount;
      
    volume += Number(difference);
  }
  
  return volume;
}

/**
 * Get historical balance changes for a pool's vaults
 * @param pool Pool data containing vault addresses
 */
export function getPoolVolumeMetrics(pool: any) {
  // Time windows
  const HOUR_24 = 86400000; // 24 hours in milliseconds
  const DAYS_7 = 7 * HOUR_24; // 7 days in milliseconds
  
  // Calculate volume for token A
  const volumeA = {
    h24: calculateVolumeFromBalanceChanges(pool.vaultA, HOUR_24),
    d7: calculateVolumeFromBalanceChanges(pool.vaultA, DAYS_7)
  };
  
  // Calculate volume for token B
  const volumeB = {
    h24: calculateVolumeFromBalanceChanges(pool.vaultB, HOUR_24),
    d7: calculateVolumeFromBalanceChanges(pool.vaultB, DAYS_7)
  };
  
  // Calculate changes (percentage)
  // In a real implementation, you'd compare with previous periods
  const h24Change = 0; // Placeholder
  const d7Change = 0;  // Placeholder
  
  return {
    volume: {
      h24: volumeA.h24 + volumeB.h24,
      h24Change,
      d7: volumeA.d7 + volumeB.d7,
      d7Change,
      token_a: volumeA.h24,
      token_b: volumeB.h24
    }
  };
}

/**
 * Calculate additional metrics for Standard pools
 */
function calculateCpmmPoolMetrics(decodedPool: any, configs: any[] = []) {
  try {
    // Find matching config
    const config = configs.find(cfg => cfg.configId === decodedPool.configId) || null;
    
    // Calculate estimated price (simplified)
    let price: number | undefined = undefined;
    
    // Add volume metrics (placeholder)
    const volume = {
      h24: 0, 
      h24Change: 0,
      d7: 0,
      d7Change: 0,
      token_a: 0,
      token_b: 0
    };
    
    // Add liquidity in USD (placeholder)
    const liquidityUsd = 0;
    
    // Add APR data (placeholder)
    const feeApr = 0;
    
    return {
      ...decodedPool,
      price,
      volume,
      liquidity_usd: liquidityUsd,
      fee_apr: feeApr,
      config: config ? {
        index: config.index,
        tradeFeeRate: parseInt(config.tradeFeeRate, 10),
        protocolFeeRate: parseInt(config.protocolFeeRate, 10),
        fundFeeRate: parseInt(config.fundFeeRate, 10)
      } : null
    };
  } catch (error) {
    console.error('Error calculating Standard pool metrics:', error);
    return decodedPool;
  }
}

/**
 * Simple in-memory cache for program accounts
 * In production, use Redis or another appropriate caching system
 */
interface CacheEntry {
  timestamp: number;
  data: any;
}

const programAccountsCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 60000; // Cache time-to-live in milliseconds (1 minute)

/**
 * Get data from cache if available and not expired
 * @param cacheKey Unique key for the cached data
 * @returns Cached data or null if not found or expired
 */
function getCachedData(cacheKey: string): any | null {
  const entry = programAccountsCache[cacheKey];
  
  if (!entry) {
    return null;
  }
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    // Cache expired
    delete programAccountsCache[cacheKey];
    return null;
  }
  
  return entry.data;
}

/**
 * Store data in cache
 * @param cacheKey Unique key for the data
 * @param data Data to cache
 */
function cacheData(cacheKey: string, data: any): void {
  programAccountsCache[cacheKey] = {
    timestamp: Date.now(),
    data
  };
}

// Near the top of the file, after imports but before existing functions
// Add global cache for program accounts that will be updated by cron
let globalProgramAccountsCache: {
  cpswap: any;
  clmm: any;
  lastUpdated: number;
} = {
  cpswap: null,
  clmm: null,
  lastUpdated: 0
};

// Add a global flag to prevent multiple concurrent refreshes
let isRefreshingAccounts = false;

/**
 * Initialize and start the background cron job to fetch program accounts
 */
export function startProgramAccountsRefreshCron(intervalMs = 60000) {
  console.log(`Setting up program accounts refresh cron to run every ${intervalMs}ms`);
  
  // Run immediately on startup
  refreshProgramAccountsCache().catch(err => {
    console.error('Error in initial program accounts fetch:', err);
  });
  
  // Then set up interval
  setInterval(async () => {
    try {
      await refreshProgramAccountsCache();
    } catch (err) {
      console.error('Error refreshing program accounts:', err);
    }
  }, intervalMs);
}

/**
 * Refresh the global program accounts cache
 */
export async function refreshProgramAccountsCache() {
  // Prevent multiple concurrent refreshes
  if (isRefreshingAccounts) {
    console.log('Program accounts refresh already in progress, skipping');
    return;
  }
  
  isRefreshingAccounts = true;
  console.log('Refreshing program accounts cache...');
  
  try {
    const startTime = Date.now();
    
    // Fetch accounts without using cache
    const cpswapData = await getCpswapPools({ useCache: false });
    const clmmData = await getClmmPools({ useCache: false });
    
    // Update the global cache
    globalProgramAccountsCache = {
      cpswap: cpswapData,
      clmm: clmmData,
      lastUpdated: Date.now()
    };
    
    console.log(`Program accounts cache refreshed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error('Failed to refresh program accounts cache:', error);
  } finally {
    isRefreshingAccounts = false;
  }
}

/**
 * Get data from the global program accounts cache
 */
export function getGlobalProgramAccountsCache() {
  return globalProgramAccountsCache;
}

/**
 * Fetch and decode Standard pools
 * @param options Options for fetching pools
 */
export async function getCpswapPools(options: { useCache?: boolean } = {}) {
  const { useCache = true } = options;
  
  // Check if we should use the global cache first
  if (useCache && globalProgramAccountsCache.cpswap) {
    console.log('Using global program accounts cache for Standard pools');
    return globalProgramAccountsCache.cpswap;
  }
  
  // Try to get from cache if enabled
  if (useCache) {
    const cacheKey = 'cpswap_pools';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached Standard data');
      return cachedData;
    }
  }
  
  console.log('Fetching Standard pools from program', CREATE_CPMM_POOL_PROGRAM.toBase58());
  console.log('Standard Auth:', CREATE_CPMM_POOL_AUTH.toBase58());
  console.log('Standard Fee Receiver:', CREATE_CPMM_POOL_FEE_ACC.toBase58());
  
  const cpmmPools = await connection.getProgramAccounts(CREATE_CPMM_POOL_PROGRAM, {
    filters: [
      {
        dataSize: CpmmPoolInfoLayout.span,
      },
    ],
  });

  console.log(`Found ${cpmmPools.length} Standard pools`);
  
  const decodedPools = cpmmPools.map(({ pubkey, account }) => {
    const decoded = CpmmPoolInfoLayout.decode(account.data);
    const poolData = {
      poolId: pubkey.toBase58(),
      configId: decoded.configId.toBase58(),
      poolCreator: decoded.poolCreator.toBase58(),
      mintA: decoded.mintA.toBase58(),
      mintB: decoded.mintB.toBase58(),
      vaultA: decoded.vaultA.toBase58(),
      vaultB: decoded.vaultB.toBase58(),
      mintLp: decoded.mintLp.toBase58(),
      mintProgramA: decoded.mintProgramA.toBase58(),
      mintProgramB: decoded.mintProgramB.toBase58(),
      mintDecimalA: decoded.mintDecimalA,
      mintDecimalB: decoded.mintDecimalB,
      lpDecimals: decoded.lpDecimals,
      status: decoded.status,
      lpAmount: decoded.lpAmount.toString(),
      openTime: decoded.openTime.toString(),
    };
    
    // Add debug logging for lpAmount
    console.log(`Pool ${poolData.poolId} lpAmount: ${poolData.lpAmount} (raw: ${decoded.lpAmount.toString()})`);
    
    return poolData;
  });

  // Get Standard Config Info
  const cpmmConfigAccounts = await connection.getProgramAccounts(CREATE_CPMM_POOL_PROGRAM, {
    filters: [
      {
        dataSize: CpmmConfigInfoLayout.span,
      },
    ],
  });

  console.log(`Found ${cpmmConfigAccounts.length} Standard configs`);
  
  const decodedConfigs = cpmmConfigAccounts.map(({ pubkey, account }) => {
    const decoded = CpmmConfigInfoLayout.decode(account.data);
    return {
      configId: pubkey.toBase58(),
      bump: decoded.bump,
      disableCreatePool: decoded.disableCreatePool,
      index: decoded.index,
      tradeFeeRate: decoded.tradeFeeRate.toString(),
      protocolFeeRate: decoded.protocolFeeRate.toString(),
      fundFeeRate: decoded.fundFeeRate.toString(),
      createPoolFee: decoded.createPoolFee.toString(),
      protocolOwner: decoded.protocolOwner.toBase58(),
      fundOwner: decoded.fundOwner.toBase58(),
    };
  });

  // Collect all vault addresses
  const vaultAddresses = decodedPools.flatMap(pool => [pool.vaultA, pool.vaultB]);
  
  // Fetch all vault balances in batch
  const vaultBalances = await fetchTokenAccountBalances(vaultAddresses);
  
  // Enhance pool data with real vault balances
  const enhancedPools = await Promise.all(
    decodedPools.map(async pool => {
      // Fetch real metrics from on-chain data instead of using placeholders
      const realPoolData = await calculateRealCpmmPoolMetrics(pool, decodedConfigs, vaultBalances);
      return realPoolData;
    })
  );

  const result = {
    pools: enhancedPools,
    configs: decodedConfigs
  };
  
  // Cache the result if caching is enabled
  if (useCache) {
    cacheData('cpswap_pools', result);
  }
  
  return result;
}

/**
 * Fetch and decode CLMM pools
 * @param options Options for fetching pools
 */
export async function getClmmPools(options: { useCache?: boolean } = {}) {
  const { useCache = true } = options;
  
  // Check if we should use the global cache first
  if (useCache && globalProgramAccountsCache.clmm) {
    console.log('Using global program accounts cache for CLMM pools');
    return globalProgramAccountsCache.clmm;
  }
  
  // Try to get from cache if enabled
  if (useCache) {
    const cacheKey = 'clmm_pools';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached CLMM data');
      return cachedData;
    }
  }
  
  console.log('Fetching CLMM pools from program', CLMM_PROGRAM_ID.toBase58());
  
  // Get configs from API (mock for now)
  let configsById: Record<string, any> = {};
  try {
    const clmmConfigs = await fetchClmmConfigFromApi();
    if (Array.isArray(clmmConfigs)) {
      configsById = clmmConfigs.reduce((acc, config) => {
        acc[config.id] = config;
        return acc;
      }, {} as Record<string, any>);
    } else {
      console.warn('CLMM configs not in expected format:', clmmConfigs);
    }
  } catch (error) {
    console.error('Error fetching CLMM configs:', error);
  }
  
  // Fetch on-chain pool data
  const clmmPools = await connection.getProgramAccounts(CLMM_PROGRAM_ID, {
    filters: [
      {
        dataSize: PoolInfoLayout.span,
      },
    ],
  });

  console.log(`Found ${clmmPools.length} CLMM pools`);
  
  // Decode the raw pool data
  const decodedPools = clmmPools.map(({ pubkey, account }) => {
    const decoded = PoolInfoLayout.decode(account.data);
    const ammConfigId = decoded.ammConfig.toBase58();
    
    // Get the config details if available
    const config = configsById[ammConfigId] || null;
    
    const rewardInfos = []; // Always empty array
    
    // Calculate real price from sqrtPriceX64
    let price: number | undefined = undefined;
    try {
      if (decoded.sqrtPriceX64) {
        const sqrtPriceX64 = BigInt(decoded.sqrtPriceX64.toString());
        const priceBigInt = (sqrtPriceX64 * sqrtPriceX64) / BigInt(2 ** 64);
        const decimalAdjustment = 10 ** (decoded.mintDecimalsB - decoded.mintDecimalsA);
        price = Number(priceBigInt) * decimalAdjustment;
      }
    } catch (error) {
      console.error('Error calculating price for pool:', pubkey.toBase58(), error);
    }
    
    return {
      poolId: pubkey.toBase58(),
      ammConfig: ammConfigId,
      creator: decoded.creator.toBase58(),
      mintA: decoded.mintA.toBase58(),
      mintB: decoded.mintB.toBase58(),
      vaultA: decoded.vaultA.toBase58(), 
      vaultB: decoded.vaultB.toBase58(),
      observationId: decoded.observationId.toBase58(),
      mintDecimalsA: decoded.mintDecimalsA,
      mintDecimalsB: decoded.mintDecimalsB,
      tickSpacing: decoded.tickSpacing,
      tickCurrent: decoded.tickCurrent,
      liquidity: decoded.liquidity.toString(),
      sqrtPriceX64: decoded.sqrtPriceX64.toString(),
      feeGrowthGlobalX64A: decoded.feeGrowthGlobalX64A.toString(),
      feeGrowthGlobalX64B: decoded.feeGrowthGlobalX64B.toString(),
      price, // Real calculated price
      status: decoded.status,
      swapInAmountTokenA: decoded.swapInAmountTokenA.toString(),
      swapOutAmountTokenB: decoded.swapOutAmountTokenB.toString(),
      swapInAmountTokenB: decoded.swapInAmountTokenB.toString(),
      swapOutAmountTokenA: decoded.swapOutAmountTokenA.toString(),
      rewardInfos: [], // Always empty array
      totalFeesTokenA: decoded.totalFeesTokenA.toString(),
      totalFeesClaimedTokenA: decoded.totalFeesClaimedTokenA.toString(),
      totalFeesTokenB: decoded.totalFeesTokenB.toString(),
      totalFeesClaimedTokenB: decoded.totalFeesClaimedTokenB.toString(),
      fundFeesTokenA: decoded.fundFeesTokenA.toString(),
      fundFeesTokenB: decoded.fundFeesTokenB.toString(),
      startTime: decoded.startTime.toString(),
      // Include the config info from Raydium API
      config: config ? {
        index: config.index,
        protocolFeeRate: config.protocolFeeRate,
        tradeFeeRate: config.tradeFeeRate,
        tickSpacing: config.tickSpacing,
        fundFeeRate: config.fundFeeRate,
        defaultRange: config.defaultRange,
        defaultRangePoint: config.defaultRangePoint,
      } : null,
    };
  });

  // Collect all vault addresses
  const vaultAddresses = decodedPools.flatMap(pool => [pool.vaultA, pool.vaultB]);
  
  // Fetch all vault balances in batch for efficiency
  const vaultBalances = await fetchTokenAccountBalances(vaultAddresses);
  
  // Add real on-chain data to each pool
  const enhancedPools = await Promise.all(
    decodedPools.map(async pool => {
      const realPoolData = await calculateRealClmmPoolMetrics(pool, vaultBalances);
      return realPoolData;
    })
  );

  // Cache the result if caching is enabled
  if (useCache) {
    cacheData('clmm_pools', enhancedPools);
  }
  
  return enhancedPools;
}

/**
 * Use this function to get both Standard and CLMM program accounts
 * with optional token metadata enrichment and caching
 */
export async function getAllProgramAccounts(options: { 
  includeTokenMetadata?: boolean;
  useCache?: boolean; 
} = {}) {
  const { 
    includeTokenMetadata = false,
    useCache = true 
  } = options;
  
  // Try to get from cache if enabled
  if (useCache) {
    const cacheKey = `all_program_accounts_${includeTokenMetadata}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached program accounts data');
      return cachedData;
    }
  }
  
  // Fetch fresh data if not cached or cache disabled
  const cpswapData = await getCpswapPools();
  const clmmData = await getClmmPools();

  // If token metadata is requested, enrich the data
  let result;
  if (includeTokenMetadata) {
    console.log('Enriching pool data with token metadata...');
    
    // Combine all pool data for efficient token metadata fetching
    const allPools = [
      ...clmmData,
      ...cpswapData.pools
    ];
    
    const enrichedPools = await enrichPoolsWithTokenMetadata(allPools);
    
    // Split back to respective pools
    const clmmCount = clmmData.length;
    const enrichedClmmPools = enrichedPools.slice(0, clmmCount);
    const enrichedCpswapPools = enrichedPools.slice(clmmCount);
    
    result = {
      cpswap: {
        ...cpswapData,
        pools: enrichedCpswapPools
      },
      clmm: enrichedClmmPools,
    };
  } else {
    result = {
      cpswap: cpswapData,
      clmm: clmmData,
    };
  }
  
  // Cache the result if caching is enabled
  if (useCache) {
    const cacheKey = `all_program_accounts_${includeTokenMetadata}`;
    cacheData(cacheKey, result);
  }
  
  return result;
}

/**
 * Fetch CLMM configuration data from Raydium API
 */
export async function fetchClmmConfigFromApi(): Promise<any[]> {
  try {
    // Try to get configs directly from on-chain data if possible
    console.log('Fetching CLMM configs from program', CLMM_PROGRAM_ID.toBase58());
    
    // This is the approximate size of a CLMM config account
    // We may need to adjust this based on the actual layout
    const EXPECTED_CONFIG_SIZE = 121; // Example size, adjust as needed
    
    const configAccounts = await connection.getProgramAccounts(CLMM_PROGRAM_ID, {
      filters: [
        {
          // Using a range for dataSize since we're not 100% sure of the exact size
          dataSize: EXPECTED_CONFIG_SIZE,
        },
      ],
    });
    
    console.log(`Found ${configAccounts.length} potential CLMM config accounts on-chain`);
    
    if (configAccounts.length > 0) {
      // If we found potential config accounts, try to decode them
      // For now returning the static mock data since we need to implement the config layout
      // In the future, we would decode these accounts properly
    }
    
    // Fallback to static data (in production would fetch from API)
    const response = {
      "id": "4f3e871f-65eb-4e01-bf1d-7f0f5bf9184c",
      "success": true,
      "data": [
        {
          "id": "5w8pYAfXYopcaar6aBrLeBjnTZj1GZXnEbCrPmjc5rwE",
          "index": 1,
          "protocolFeeRate": 120000,
          "tradeFeeRate": 100000,
          "tickSpacing": 60,
          "fundFeeRate": 40000,
          "defaultRange": 0.1,
          "defaultRangePoint": [0.01, 0.05, 0.1, 0.2, 0.5]
        },
        {
          "id": "bBUk5ri157iwAB5UjJ9fqkejuD66B8SYXQ1rTJErQGJ",
          "index": 3,
          "protocolFeeRate": 120000,
          "tradeFeeRate": 100000,
          "tickSpacing": 120,
          "fundFeeRate": 40000,
          "defaultRange": 0.1,
          "defaultRangePoint": [0.01, 0.05, 0.1, 0.2, 0.5]
        },
        // Note: In a real implementation, all the configs would be included
        // For brevity, we're showing just a few
      ]
    };
    
    // Return just the data array for easier processing
    return response.data || [];
  } catch (error) {
    console.error('Error fetching CLMM config data:', error);
    return [];
  }
}

/**
 * Format Standard config data for API response
 */
export function formatCpmmConfigForApi(cpswapData: { configs: any[] }): any[] {
  if (!cpswapData || !cpswapData.configs || !Array.isArray(cpswapData.configs)) {
    return [];
  }
  
  // Format the configs in the expected structure
  return cpswapData.configs.map(config => ({
    id: config.configId,
    index: config.index,
    protocolFeeRate: parseInt(config.protocolFeeRate, 10),
    tradeFeeRate: parseInt(config.tradeFeeRate, 10),
    fundFeeRate: parseInt(config.fundFeeRate, 10),
    createPoolFee: config.createPoolFee
  }));
}

/**
 * Calculate additional metrics for pools to enhance API data
 * 
 * @param decodedPool The decoded pool data
 * @returns Pool data with additional metrics
 */
export function calculatePoolMetrics(decodedPool: any) {
  try {
    // Compute volume metrics from on-chain data
    // Note: These calculations are placeholders and should be adjusted based on actual formulas
    const volumeBase = {
      h24: 0,
      h24Change: 0,
      d7: 0,
      d7Change: 0
    };
    
    // Current liquidity in USD - this is a placeholder calculation
    let liquidityUsd = 0;
    
    if (decodedPool.liquidity) {
      const liquidityBigInt = BigInt(decodedPool.liquidity);
      // This is a simplified estimate - real implementation should account for price
      if (decodedPool.price && typeof decodedPool.price === 'number') {
        liquidityUsd = Number(liquidityBigInt) * decodedPool.price / 1e9; // Adjusting for decimals
      }
    }
    
    // Calculate fee APR (placeholder)
    const feeApr = 0;
    
    // Calculate real volume from swap amounts
    const swapAInAmount = BigInt(decodedPool.swapInAmountTokenA || '0');
    const swapAOutAmount = BigInt(decodedPool.swapOutAmountTokenA || '0');
    const swapBInAmount = BigInt(decodedPool.swapInAmountTokenB || '0');
    const swapBOutAmount = BigInt(decodedPool.swapOutAmountTokenB || '0');
    
    const totalVolumeA = swapAInAmount + swapAOutAmount;
    const totalVolumeB = swapBInAmount + swapBOutAmount;
    
    // Convert to number for API response
    const volumeA = Number(totalVolumeA);
    const volumeB = Number(totalVolumeB);
    
    // Return enhanced pool data
    return {
      ...decodedPool,
      liquidity_usd: liquidityUsd,
      fee_apr: feeApr,
      volume: {
        ...volumeBase,
        token_a: volumeA,
        token_b: volumeB
      }
    };
  } catch (error) {
    console.error('Error calculating pool metrics:', error);
    return decodedPool;
  }
}

/**
 * Filter pools based on query parameters
 * 
 * @param pools Array of pool data
 * @param options Filter options
 * @returns Filtered pools
 */
export function filterPools(pools: any[], options: any = {}) {
  let filteredPools = [...pools];
  
  // Filter by mintA or mintB
  if (options.mint) {
    filteredPools = filteredPools.filter(pool => 
      pool.mintA === options.mint || pool.mintB === options.mint
    );
  }
  
  // Filter by ammConfig
  if (options.ammConfig) {
    filteredPools = filteredPools.filter(pool => 
      pool.ammConfig === options.ammConfig || 
      (pool.config && pool.config.id === options.ammConfig)
    );
  }
  
  // Filter by status (e.g., active, disabled)
  if (options.status !== undefined) {
    filteredPools = filteredPools.filter(pool => 
      pool.status === options.status
    );
  }
  
  // Filter by minimum liquidity
  if (options.minLiquidity) {
    const minLiquidity = parseFloat(options.minLiquidity);
    filteredPools = filteredPools.filter(pool => 
      (pool.liquidity_usd || 0) >= minLiquidity
    );
  }
  
  return filteredPools;
}

/**
 * Sort pools based on query parameters
 * 
 * @param pools Array of pool data
 * @param options Sort options (field and direction)
 * @returns Sorted pools
 */
export function sortPools(pools: any[], options: any = {}) {
  const { sortBy = 'liquidity_usd', sortOrder = 'desc' } = options;
  const multiplier = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
  
  return [...pools].sort((a, b) => {
    let valueA, valueB;
    
    // Handle nested fields like volume.h24
    if (sortBy.includes('.')) {
      const [field, subfield] = sortBy.split('.');
      valueA = a[field]?.[subfield] || 0;
      valueB = b[field]?.[subfield] || 0;
    } else {
      valueA = a[sortBy] || 0;
      valueB = b[sortBy] || 0;
    }
    
    // Handle string vs number comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return multiplier * valueA.localeCompare(valueB);
    }
    
    return multiplier * (Number(valueA) - Number(valueB));
  });
}

/**
 * Paginate pools based on query parameters
 * 
 * @param pools Array of pool data
 * @param options Pagination options (offset and limit)
 * @returns Paginated pools and metadata
 */
export function paginatePools(pools: any[], options: any = {}) {
  const { offset = 0, limit = 10 } = options;
  const paginatedPools = pools.slice(offset, offset + limit);
  
  return {
    data: paginatedPools,
    meta: {
      total: pools.length,
      offset,
      limit,
      count: paginatedPools.length
    }
  };
}

/**
 * Process pools for API response (filter, sort, paginate)
 * 
 * @param pools Array of pool data
 * @param options Query options
 * @returns Processed pools ready for API response
 */
export function processPoolsForApi(pools: any[], options: any = {}) {
  // Apply filters
  const filteredPools = filterPools(pools, options);
  
  // Apply sorting
  const sortedPools = sortPools(filteredPools, options);
  
  // Apply pagination
  return paginatePools(sortedPools, options);
}

/**
 * Convert BigInt values to strings for JSON serialization
 * 
 * @param obj Object that may contain BigInt values
 * @returns Object with BigInt values converted to strings
 */
export function sanitizeForJson(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForJson);
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeForJson(value);
    }
    return result;
  }
  
  return obj;
}

/**
 * Format API response with standard structure
 * 
 * @param data The data to include in the response
 * @param success Whether the request was successful
 * @param error Error message if any
 * @returns Formatted API response
 */
export function formatApiResponse(data: any, success: boolean = true, error: string = '') {
  // Generate a UUID for response tracking
  const responseId = Math.random().toString(36).substring(2, 15);
  
  const response = {
    id: responseId,
    success,
    data: sanitizeForJson(data)
  };
  
  if (error) {
    Object.assign(response, { error });
  }
  
  return response;
}

/**
 * Fetch token metadata and price information from Helius DAS API
 * @param mintAddresses Array of mint addresses to fetch
 * @returns Token metadata keyed by mint address
 */
export async function fetchTokenMetadata(mintAddresses: string[]): Promise<Record<string, any>> {
  try {
    console.log(`Fetching token metadata for ${mintAddresses.length} mints from Helius DAS API`);
    
    // Helius DAS API endpoint
    const HELIUS_API_KEY = process.env.HELIUS_API_KEY || "f3fd250b-15cf-410c-a3c8-a513af7bff9f";
    const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com?api-key=${HELIUS_API_KEY}`;
    
    // Batch the mint addresses into chunks to avoid request size limits
    const BATCH_SIZE = 100;
    const mintBatches: string[][] = [];
    
    for (let i = 0; i < mintAddresses.length; i += BATCH_SIZE) {
      mintBatches.push(mintAddresses.slice(i, i + BATCH_SIZE));
    }
    
    // Result object to store token metadata
    const tokenMetadata: Record<string, any> = {};
    
    // Process each batch
    for (const batch of mintBatches) {
      try {
        // Use getAssetBatch DAS API to fetch token metadata
        const response = await fetch(HELIUS_RPC_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'helius-metadata',
            method: 'getAssetBatch',
            params: {
              ids: batch,
            },
          }),
        });
        
        const data = await response.json();
        
        if (data.result && Array.isArray(data.result)) {
          // Process each token result
          for (const asset of data.result) {
            if (asset.id) {
              // Store token metadata by mint address
              tokenMetadata[asset.id] = {
                symbol: asset.content?.metadata?.symbol || '',
                name: asset.content?.metadata?.name || '',
                decimals: asset.token_info?.decimals,
                price_usd: asset.token_info?.price_info?.price_per_token || null,
                interface: asset.interface, // Helps identify token type
                supply: asset.token_info?.supply,
                token_program: asset.token_info?.token_program,
              };
            }
          }
        }
      } catch (error) {
        console.error('Error fetching token batch from Helius:', error);
      }
    }
    
    console.log(`Successfully fetched metadata for ${Object.keys(tokenMetadata).length} tokens`);
    return tokenMetadata;
  } catch (error) {
    console.error('Error in fetchTokenMetadata:', error);
    return {};
  }
}

/**
 * Enrich pool data with token metadata
 * @param pools Array of pools to enrich
 * @param tokenMetadata Token metadata keyed by mint address
 * @returns Enriched pool data
 */
export async function enrichPoolsWithTokenMetadata(pools: any[]): Promise<any[]> {
  try {
    // Extract all mint addresses from pools
    const mintAddresses = new Set<string>();
    
    for (const pool of pools) {
      if (pool.mintA) mintAddresses.add(pool.mintA);
      if (pool.mintB) mintAddresses.add(pool.mintB);
    }
    
    // Fetch token metadata for all mints
    const tokenMetadata = await fetchTokenMetadata([...mintAddresses]);
    
    // Enrich pool data with token metadata
    return pools.map(pool => {
      const tokenAMetadata = tokenMetadata[pool.mintA] || {};
      const tokenBMetadata = tokenMetadata[pool.mintB] || {};
      
      // Calculate liquidity in USD if we have price data
      let liquidityUsd = pool.liquidity_usd || 0;
      
      if (!liquidityUsd && pool.liquidity && tokenAMetadata.price_usd && tokenBMetadata.price_usd) {
        // This is a simplified calculation - in production, you would use more accurate formulas
        const liquidityBigInt = BigInt(pool.liquidity);
        const decimalsA = tokenAMetadata.decimals || pool.mintDecimalsA || 0;
        const decimalsB = tokenBMetadata.decimals || pool.mintDecimalsB || 0;
        
        // Adjust for decimal places
        const adjustedLiquidity = Number(liquidityBigInt) / (10 ** ((decimalsA + decimalsB) / 2));
        
        // Use average price of both tokens
        const avgPrice = (tokenAMetadata.price_usd + tokenBMetadata.price_usd) / 2;
        liquidityUsd = adjustedLiquidity * avgPrice;
      }
      
      return {
        ...pool,
        liquidity_usd: liquidityUsd,
        token_a_metadata: tokenAMetadata,
        token_b_metadata: tokenBMetadata,
      };
    });
  } catch (error) {
    console.error('Error enriching pools with token metadata:', error);
    return pools;
  }
}

/**
 * Fetch token account balance
 * @param tokenAccountAddress The address of the token account
 * @returns Token account info with balance
 */
export async function fetchTokenAccountBalance(tokenAccountAddress: string) {
  try {
    console.log(`Fetching balance for token account: ${tokenAccountAddress}`);
    const accountInfo = await connection.getTokenAccountBalance(new PublicKey(tokenAccountAddress));
    return accountInfo?.value || null;
  } catch (error) {
    console.error(`Error fetching balance for ${tokenAccountAddress}:`, error);
    return null;
  }
}

/**
 * Fetch multiple token account balances
 * @param tokenAccountAddresses Array of token account addresses
 * @returns Object mapping addresses to balances
 */
export async function fetchTokenAccountBalances(tokenAccountAddresses: string[]): Promise<Record<string, any>> {
  console.log(`Fetching balances for ${tokenAccountAddresses.length} token accounts`);
  
  const balances: Record<string, any> = {};
  
  // Process in batches to avoid rate limits
  const BATCH_SIZE = 10;
  for (let i = 0; i < tokenAccountAddresses.length; i += BATCH_SIZE) {
    const batch = tokenAccountAddresses.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (address) => {
        const balance = await fetchTokenAccountBalance(address);
        if (balance) {
          balances[address] = balance;
        }
      })
    );
  }
  
  return balances;
}

/**
 * Calculate additional metrics for Standard pools based on real data
 */
export async function calculateRealCpmmPoolMetrics(
  decodedPool: any, 
  configs: any[] = [], 
  vaultBalances: Record<string, any> = {}
) {
  try {
    // Find matching config
    const config = configs.find(cfg => cfg.configId === decodedPool.configId) || null;
    
    // Use pre-fetched vault balances or fetch individually if not available
    let vaultABalance = vaultBalances[decodedPool.vaultA];
    let vaultBBalance = vaultBalances[decodedPool.vaultB];
    
    // Fetch individually if not in batch results
    if (!vaultABalance) {
      vaultABalance = await fetchTokenAccountBalance(decodedPool.vaultA);
    }
    
    if (!vaultBBalance) {
      vaultBBalance = await fetchTokenAccountBalance(decodedPool.vaultB);
    }
    
    // Only calculate if we have both balances
    let price: number | undefined = undefined;
    let liquidityUsd = 0;
    
    if (vaultABalance && vaultBBalance) {
      const amountA = BigInt(vaultABalance.amount);
      const amountB = BigInt(vaultBBalance.amount);
      const decimalA = vaultABalance.decimals;
      const decimalB = vaultBBalance.decimals;
      
      // Calculate real price from vault balances
      if (amountA > BigInt(0)) {
        // Normalize for decimal differences
        const adjustmentFactor = 10 ** (decimalB - decimalA);
        price = (Number(amountB) / Number(amountA)) * adjustmentFactor;
      }
      
      // Store the actual vault balances for the frontend
      decodedPool.vaultABalance = {
        amount: vaultABalance.amount,
        decimals: vaultABalance.decimals,
        uiAmount: vaultABalance.uiAmount
      };
      
      decodedPool.vaultBBalance = {
        amount: vaultBBalance.amount,
        decimals: vaultBBalance.decimals,
        uiAmount: vaultBBalance.uiAmount
      };
      
      // Track balances for historical volume calculation
      trackVaultBalance(decodedPool.vaultA, vaultABalance);
      trackVaultBalance(decodedPool.vaultB, vaultBBalance);
    }

    // Add config information
    const configInfo = config ? {
      index: config.index,
      tradeFeeRate: parseInt(config.tradeFeeRate, 10),
      protocolFeeRate: parseInt(config.protocolFeeRate, 10),
      fundFeeRate: parseInt(config.fundFeeRate, 10)
    } : null;
    
    // Get volume metrics based on historical balance changes
    const volumeMetrics = getPoolVolumeMetrics(decodedPool);
    
    // Calculate fee APR based on volume and fee rates
    let feeApr = 0;
    if (configInfo && volumeMetrics.volume.d7 > 0) {
      const tradeFeeRate = configInfo.tradeFeeRate / 1000000; // Convert from parts per million
      const annualVolume = volumeMetrics.volume.d7 * 365 / 7; // Extrapolate 7d to annual
      
      // Calculate fee APR as annual fees / current liquidity
      // This is a simplified calculation
      if (decodedPool.lpAmount && Number(decodedPool.lpAmount) > 0) {
        const annualFees = annualVolume * tradeFeeRate;
        feeApr = annualFees / Number(decodedPool.lpAmount);
      }
    }
    
    return {
      ...decodedPool,
      price,
      liquidity_usd: liquidityUsd,
      fee_apr: feeApr,
      ...volumeMetrics,
      config: configInfo
    };
  } catch (error) {
    console.error('Error calculating Standard pool metrics:', error);
    return decodedPool;
  }
}

/**
 * Calculate metrics for CLMM pools using real on-chain data
 */
export async function calculateRealClmmPoolMetrics(decodedPool: any, vaultBalances: Record<string, any> = {}) {
  try {
    // Use pre-fetched vault balances or fetch individually if not available
    let vaultABalance = vaultBalances[decodedPool.vaultA];
    let vaultBBalance = vaultBalances[decodedPool.vaultB];
    
    // Fetch individually if not in batch results
    if (!vaultABalance) {
      vaultABalance = await fetchTokenAccountBalance(decodedPool.vaultA);
    }
    
    if (!vaultBBalance) {
      vaultBBalance = await fetchTokenAccountBalance(decodedPool.vaultB);
    }
    
    // Store the actual vault balances
    if (vaultABalance) {
      decodedPool.vaultABalance = {
        amount: vaultABalance.amount,
        decimals: vaultABalance.decimals,
        uiAmount: vaultABalance.uiAmount
      };
      
      // Track balance for historical analysis
      trackVaultBalance(decodedPool.vaultA, vaultABalance);
    }
    
    if (vaultBBalance) {
      decodedPool.vaultBBalance = {
        amount: vaultBBalance.amount,
        decimals: vaultBBalance.decimals,
        uiAmount: vaultBBalance.uiAmount
      };
      
      // Track balance for historical analysis
      trackVaultBalance(decodedPool.vaultB, vaultBBalance);
    }
    
    // Get volume metrics based on historical balance changes
    const volumeMetrics = getPoolVolumeMetrics(decodedPool);
    
    // Calculate fee APR based on volume and fee rates
    let feeApr = 0;
    if (decodedPool.config && volumeMetrics.volume.d7 > 0) {
      const tradeFeeRate = decodedPool.config.tradeFeeRate / 1000000; // Convert from parts per million
      const annualVolume = volumeMetrics.volume.d7 * 365 / 7; // Extrapolate 7d to annual
      
      // Calculate fee APR as annual fees / current liquidity
      // This is a simplified calculation
      if (decodedPool.liquidity && decodedPool.liquidity !== '0') {
        const annualFees = annualVolume * tradeFeeRate;
        feeApr = annualFees / Number(decodedPool.liquidity);
      }
    }
    
    // Calculate additional metrics if available
    let liquidityUsd = decodedPool.liquidity_usd || 0;
    
    // If we have price and liquidity but no liquidity_usd yet
    if (decodedPool.price && decodedPool.liquidity && !liquidityUsd) {
      // This is a simplified calculation
      const liquidity = BigInt(decodedPool.liquidity);
      const price = decodedPool.price;
      
      // Adjust for decimals
      const decimalsA = decodedPool.mintDecimalsA || 0;
      const decimalsB = decodedPool.mintDecimalsB || 0;
      const avgDecimals = (decimalsA + decimalsB) / 2;
      
      // Calculate approximate liquidity in USD (simplified)
      liquidityUsd = Number(liquidity) * price / (10 ** avgDecimals);
    }
    
    return {
      ...decodedPool,
      ...volumeMetrics,
      liquidity_usd: liquidityUsd,
      fee_apr: feeApr
    };
  } catch (error) {
    console.error('Error calculating real CLMM pool metrics:', error);
    return decodedPool;
  }
}
