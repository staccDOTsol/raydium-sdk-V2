// Example of using web3.js directly to fetch and decode Standard and CLMM program accounts
// Run with Node.js

const { Connection, PublicKey } = require('@solana/web3.js');
// Use the correct path to marshmallow - change to standard import since it's TS
const { struct, blob, publicKey, u64, u8, u128, u16, bool, seq, s32 } = require('../marshmallow');

// Use the correct Helius RPC endpoint
const RPC_ENDPOINT = "https://medieval-outscreams-wuaxgghwke-dedicated.helius-rpc.com?api-key=f3fd250b-15cf-410c-a3c8-a513af7bff9f";

// Create connection with the provided Helius endpoint
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Program IDs
const Standard_PROGRAM_ID = new PublicKey("GWnBvc4z2J1qeakbR2cDvDtuC3rbXByKtEZAeGVmWTpp");
const Standard_ADMIN = new PublicKey("2GdYuSSurGpYqBXVRYfiktKBF8kJEyNNY9jHCudYTHCZ");
const Standard_FEE_RECEIVER = new PublicKey("42dvDR9xMUZ2eBm451H8ogonQh22btpxcfqtt1uDi6qC");

const CLMM_PROGRAM_ID = new PublicKey("Gi6C3vyALWUKjmUYyuTqdemVdHPUXyFb2feQiFmhsmru");
const CLMM_ADMIN = new PublicKey("2GdYuSSurGpYqBXVRYfiktKBF8kJEyNNY9jHCudYTHCZ");
const CLMM_FEE_RECEIVER = new PublicKey("42dvDR9xMUZ2eBm451H8ogonQh22btpxcfqtt1uDi6qC");

// Define layouts for Standard
const CpmmConfigInfoLayout = struct([
  blob(8),
  u8("bump"),
  bool("disableCreatePool"),
  u16("index"),
  u64("tradeFeeRate"),
  u64("protocolFeeRate"),
  u64("fundFeeRate"),
  u64("createPoolFee"),
  publicKey("protocolOwner"),
  publicKey("fundOwner"),
  seq(u64(), 16),
]);

const CpmmPoolInfoLayout = struct([
  blob(8),
  publicKey("configId"),
  publicKey("poolCreator"),
  publicKey("vaultA"),
  publicKey("vaultB"),
  publicKey("mintLp"),
  publicKey("mintA"),
  publicKey("mintB"),
  publicKey("mintProgramA"),
  publicKey("mintProgramB"),
  publicKey("observationId"),
  u8("bump"),
  u8("status"),
  u8("lpDecimals"),
  u8("mintDecimalA"),
  u8("mintDecimalB"),
  u64("lpAmount"),
  u64("protocolFeesMintA"),
  u64("protocolFeesMintB"),
  u64("fundFeesMintA"),
  u64("fundFeesMintB"),
  u64("openTime"),
  seq(u64(), 32),
]);

// Define layouts for CLMM (simplified version)
const PoolInfoLayout = struct([
  blob(8),
  u8("bump"),
  publicKey("ammConfig"),
  publicKey("creator"),
  publicKey("mintA"),
  publicKey("mintB"),
  publicKey("vaultA"),
  publicKey("vaultB"),
  publicKey("observationId"),
  u8("mintDecimalsA"),
  u8("mintDecimalsB"),
  u16("tickSpacing"),
  u128("liquidity"),
  u128("sqrtPriceX64"),
  s32("tickCurrent"),
  // Note: This is a simplified version of the layout
  // In production, use the complete layout from the SDK
]);

/**
 * Fetch and decode Standard pools
 */
async function fetchCpswapPools() {
  console.log('Fetching Standard pools from program', Standard_PROGRAM_ID.toBase58());
  console.log('Standard Admin:', Standard_ADMIN.toBase58());
  console.log('Standard Fee Receiver:', Standard_FEE_RECEIVER.toBase58());
  
  // Fetch pools
  const cpmmPools = await connection.getProgramAccounts(Standard_PROGRAM_ID, {
    filters: [
      {
        dataSize: CpmmPoolInfoLayout.span,
      },
    ],
  });

  console.log(`Found ${cpmmPools.length} Standard pools`);
  
  // Decode pools
  const decodedPools = cpmmPools.map(({ pubkey, account }) => {
    const decoded = CpmmPoolInfoLayout.decode(account.data);
    return {
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
  });
  
  return decodedPools;
}

/**
 * Fetch and decode CLMM pools
 */
async function fetchClmmPools() {
  console.log('Fetching CLMM pools from program', CLMM_PROGRAM_ID.toBase58());
  console.log('CLMM Admin:', CLMM_ADMIN.toBase58());
  console.log('CLMM Fee Receiver:', CLMM_FEE_RECEIVER.toBase58());
  
  // Fetch pools
  const clmmPools = await connection.getProgramAccounts(CLMM_PROGRAM_ID, {
    filters: [
      {
        dataSize: PoolInfoLayout.span,
      },
    ],
  });

  console.log(`Found ${clmmPools.length} CLMM pools`);
  
  // Decode pools (simplified version)
  const decodedPools = clmmPools.map(({ pubkey, account }) => {
    const decoded = PoolInfoLayout.decode(account.data);
    return {
      poolId: pubkey.toBase58(),
      ammConfig: decoded.ammConfig.toBase58(),
      creator: decoded.creator.toBase58(),
      mintA: decoded.mintA.toBase58(),
      mintB: decoded.mintB.toBase58(),
      vaultA: decoded.vaultA.toBase58(),
      vaultB: decoded.vaultB.toBase58(),
      observationId: decoded.observationId.toBase58(),
      mintDecimalsA: decoded.mintDecimalsA,
      mintDecimalsB: decoded.mintDecimalsB,
      tickSpacing: decoded.tickSpacing,
      liquidity: decoded.liquidity.toString(),
      sqrtPriceX64: decoded.sqrtPriceX64.toString(),
      tickCurrent: decoded.tickCurrent,
    };
  });
  
  return decodedPools;
}

async function main() {
  try {
    console.log('====== DIRECT WEB3 EXAMPLE ======');
    console.log('This example directly uses web3.js to fetch and decode program accounts\n');
    
    // Fetch Standard pools
    console.log('Fetching Standard pools...');
    const cpmmPools = await connection.getProgramAccounts(Standard_PROGRAM_ID, {
      filters: [
        {
          dataSize: CpmmPoolInfoLayout.span,
        },
      ],
    });
    
    console.log(`Found ${cpmmPools.length} Standard pools`);
    
    // Decode pools
    const cpswapPools = cpmmPools.map(({ pubkey, account }) => {
      const decoded = CpmmPoolInfoLayout.decode(account.data);
      return {
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
    });
    
    console.log(`Successfully decoded ${cpswapPools.length} Standard pools\n`);
    
    // Display sample Standard pool
    if (cpswapPools.length > 0) {
      console.log('Sample Standard pool:');
      console.log(JSON.stringify(cpswapPools[0], null, 2));
      console.log('\n');
    }
    
    // Fetch CLMM pools
    console.log('Fetching CLMM pools...');
    const clmmPoolsData = await connection.getProgramAccounts(CLMM_PROGRAM_ID, {
      filters: [
        {
          dataSize: PoolInfoLayout.span,
        },
      ],
    });
    
    console.log(`Found ${clmmPoolsData.length} CLMM pools`);
    
    // Decode pools (simplified version)
    const clmmPools = clmmPoolsData.map(({ pubkey, account }) => {
      const decoded = PoolInfoLayout.decode(account.data);
      return {
        poolId: pubkey.toBase58(),
        ammConfig: decoded.ammConfig.toBase58(),
        creator: decoded.creator.toBase58(),
        mintA: decoded.mintA.toBase58(),
        mintB: decoded.mintB.toBase58(),
        vaultA: decoded.vaultA.toBase58(),
        vaultB: decoded.vaultB.toBase58(),
        observationId: decoded.observationId.toBase58(),
        mintDecimalsA: decoded.mintDecimalsA,
        mintDecimalsB: decoded.mintDecimalsB,
        tickSpacing: decoded.tickSpacing,
        liquidity: decoded.liquidity.toString(),
        sqrtPriceX64: decoded.sqrtPriceX64.toString(),
        tickCurrent: decoded.tickCurrent,
      };
    });
    
    console.log(`Successfully decoded ${clmmPools.length} CLMM pools\n`);
    
    // Display sample CLMM pool
    if (clmmPools.length > 0) {
      console.log('Sample CLMM pool:');
      console.log(JSON.stringify(clmmPools[0], null, 2));
    }
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main()
  .then(() => console.log('\nDone!'))
  .catch(console.error); 