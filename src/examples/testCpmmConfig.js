// Test the /main/cpmm-config endpoint
const fetch = require('node-fetch');

const API_URL = 'https://ws.staccattac.fun';

async function testCpmmConfig() {
  try {
    console.log('Testing /main/cpmm-config endpoint...');
    const response = await fetch(`${API_URL}/main/cpmm-config`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CPMM config: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('CPMM Config Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`Success! Fetched ${data.data.length} CPMM configs`);
    } else {
      console.error('Error:', data.error);
    }
    
    return data.success;
  } catch (error) {
    console.error('Error testing CPMM config:', error);
    return false;
  }
}

async function testClmmConfig() {
  try {
    console.log('\nTesting /main/clmm-config endpoint...');
    const response = await fetch(`${API_URL}/main/clmm-config`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CLMM config: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('CLMM Config Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`Success! Fetched ${data.data.length} CLMM configs`);
    } else {
      console.error('Error:', data.error);
    }
    
    return data.success;
  } catch (error) {
    console.error('Error testing CLMM config:', error);
    return false;
  }
}

async function testPoolsList() {
  try {
    console.log('\nTesting /pools/info/list endpoint...');
    
    // Test different query parameters
    const queryParams = [
      '',
      '?poolType=Concentrated',
      '?poolType=Standard',
      '?poolType=Concentrated&poolSortField=price&sortType=desc',
      '?poolType=Concentrated&pageSize=10&page=1'
    ];
    
    for (const query of queryParams) {
      console.log(`\nTesting with query: ${query || '(none)'}`);
      const response = await fetch(`${API_URL}/pools/info/list${query}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch pools: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`Success! Found ${data.data.count} pools, returned ${data.data.data.length} in this page`);
        if (data.data.data.length > 0) {
          console.log('Sample pool:', data.data.data[0].type, data.data.data[0].id);
        }
      } else {
        console.error('Error:', data.error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error testing pools list:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  const cpmmResult = await testCpmmConfig();
  const clmmResult = await testClmmConfig();
  const poolsResult = await testPoolsList();
  
  if (cpmmResult && clmmResult && poolsResult) {
    console.log('\nAll tests passed!');
  } else {
    console.error('\nSome tests failed!');
  }
}

runTests().catch(console.error); 