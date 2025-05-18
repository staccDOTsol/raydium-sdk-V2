// Client-side example for fetching Standard and CLMM pool data
// Run this with Node.js after starting the server

const fetch = require('node-fetch');

// Base URL for the API (change if server runs on a different port)
const API_URL = 'https://ws.staccattac.fun';

/**
 * Fetch and log all pools from the API
 */
async function getAllPools() {
  try {
    const response = await fetch(`${API_URL}/pools/info/list`);
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error fetching pools:', data.error);
      return;
    }
    
    console.log(`Found ${data.data.count} total pools`);
    
    // Count by type
    const poolTypes = {};
    data.data.data.forEach(pool => {
      poolTypes[pool.type] = (poolTypes[pool.type] || 0) + 1;
    });
    
    console.log('Pools by type:', poolTypes);
    
    // Log a few samples
    console.log('\nSample pools:');
    data.data.data.slice(0, 3).forEach((pool, i) => {
      console.log(`\nPool #${i+1} (${pool.type}):`);
      console.log(`ID: ${pool.id}`);
      console.log(`Mint A: ${pool.mintA.address} (${pool.mintA.decimals} decimals)`);
      console.log(`Mint B: ${pool.mintB.address} (${pool.mintB.decimals} decimals)`);
    });
  } catch (error) {
    console.error('Failed to fetch pools:', error);
  }
}

/**
 * Fetch and log raw program accounts
 */
async function getRawProgramAccounts() {
  try {
    // Get Standard program accounts
    const cpswapResponse = await fetch(`${API_URL}/programs/accounts/cpswap`);
    const cpswapData = await cpswapResponse.json();
    
    if (!cpswapData.success) {
      console.error('Error fetching Standard accounts:', cpswapData.error);
    } else {
      console.log(`\nFound ${cpswapData.data.pools.length} Standard pools`);
      console.log(`Found ${cpswapData.data.configs.length} Standard configs`);
      
      // Display one Standard pool
      if (cpswapData.data.pools.length > 0) {
        const samplePool = cpswapData.data.pools[0];
        console.log('\nSample Standard pool:');
        console.log(JSON.stringify(samplePool, null, 2));
      }
      
      // Display one Standard config
      if (cpswapData.data.configs.length > 0) {
        const sampleConfig = cpswapData.data.configs[0];
        console.log('\nSample Standard config:');
        console.log(JSON.stringify(sampleConfig, null, 2));
      }
    }
    
    // Get CLMM program accounts
    const clmmResponse = await fetch(`${API_URL}/programs/accounts/clmm`);
    const clmmData = await clmmResponse.json();
    
    if (!clmmData.success) {
      console.error('Error fetching CLMM accounts:', clmmData.error);
    } else {
      console.log(`\nFound ${clmmData.data.length} CLMM pools`);
      
      // Display one CLMM pool
      if (clmmData.data.length > 0) {
        const samplePool = clmmData.data[0];
        console.log('\nSample CLMM pool:');
        console.log(JSON.stringify(samplePool, null, 2));
      }
    }
  } catch (error) {
    console.error('Failed to fetch program accounts:', error);
  }
}

// Execute both functions
async function main() {
  console.log('====== FETCHING FORMATTED POOLS DATA ======');
  await getAllPools();
  
  console.log('\n\n====== FETCHING RAW PROGRAM ACCOUNTS ======');
  await getRawProgramAccounts();
}

main().catch(console.error); 