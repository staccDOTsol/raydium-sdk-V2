import { getAllProgramAccounts, getCpswapPools, getClmmPools } from './decodeProgramAccounts';

async function main() {
  try {
    console.log('Fetching data from Standard and CLMM programs...');
    
    // Get all program accounts
    const allData = await getAllProgramAccounts();
    
    // Log summary information
    console.log('\n=========== SUMMARY ===========');
    console.log(`Standard Pools: ${allData.cpswap.pools.length}`);
    console.log(`Standard Configs: ${allData.cpswap.configs.length}`);
    console.log(`CLMM Pools: ${allData.clmm.length}`);
    
    // Print detailed information about the first few pools of each type
    
    // Standard pools
    if (allData.cpswap.pools.length > 0) {
      console.log('\n=========== Standard POOLS SAMPLE ===========');
      const sampleSize = Math.min(3, allData.cpswap.pools.length);
      for (let i = 0; i < sampleSize; i++) {
        const pool = allData.cpswap.pools[i];
        console.log(`\nPool #${i+1}:`);
        console.log(`ID: ${pool.poolId}`);
        console.log(`Config ID: ${pool.configId}`);
        console.log(`Mint A: ${pool.mintA}`);
        console.log(`Mint B: ${pool.mintB}`);
        console.log(`Mint Decimal A: ${pool.mintDecimalA}`);
        console.log(`Mint Decimal B: ${pool.mintDecimalB}`);
        console.log(`Status: ${pool.status}`);
      }
    }
    
    // Standard configs
    if (allData.cpswap.configs.length > 0) {
      console.log('\n=========== Standard CONFIGS SAMPLE ===========');
      const sampleSize = Math.min(3, allData.cpswap.configs.length);
      for (let i = 0; i < sampleSize; i++) {
        const config = allData.cpswap.configs[i];
        console.log(`\nConfig #${i+1}:`);
        console.log(`ID: ${config.configId}`);
        console.log(`Trade Fee Rate: ${config.tradeFeeRate}`);
        console.log(`Protocol Fee Rate: ${config.protocolFeeRate}`);
        console.log(`Protocol Owner: ${config.protocolOwner}`);
        console.log(`Fund Owner: ${config.fundOwner}`);
      }
    }
    
    // CLMM pools
    if (allData.clmm.length > 0) {
      console.log('\n=========== CLMM POOLS SAMPLE ===========');
      const sampleSize = Math.min(3, allData.clmm.length);
      for (let i = 0; i < sampleSize; i++) {
        const pool = allData.clmm[i];
        console.log(`\nPool #${i+1}:`);
        console.log(`ID: ${pool.poolId}`);
        console.log(`AMM Config: ${pool.ammConfig}`);
        console.log(`Mint A: ${pool.mintA}`);
        console.log(`Mint B: ${pool.mintB}`);
        console.log(`Mint Decimals A: ${pool.mintDecimalsA}`);
        console.log(`Mint Decimals B: ${pool.mintDecimalsB}`);
        console.log(`Tick Spacing: ${pool.tickSpacing}`);
        console.log(`Current Tick: ${pool.tickCurrent}`);
        console.log(`Status: ${pool.status}`);
      }
    }
    
  } catch (error) {
    console.error('Error fetching program data:', error);
  }
}

// Execute the main function
main().catch(console.error); 