// Test connection to Helius RPC
const { Connection } = require('@solana/web3.js');

// Use the correct Helius RPC endpoint
const RPC_ENDPOINT = "https://medieval-outscreams-wuaxgghwke-dedicated.helius-rpc.com?api-key=f3fd250b-15cf-410c-a3c8-a513af7bff9f";

async function testConnection() {
  console.log('Testing connection to:', RPC_ENDPOINT);
  
  try {
    // Create connection
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    // Test with a simple request
    console.log('Requesting recent blockhash...');
    const blockhashResponse = await connection.getRecentBlockhash();
    
    console.log('Connection successful!');
    console.log('Recent blockhash:', blockhashResponse.blockhash);
    // Log the full response for debugging
    console.log('Full blockhash response:', JSON.stringify(blockhashResponse, null, 2));
    
    // Test with slot info
    console.log('Requesting slot info...');
    const slot = await connection.getSlot();
    console.log('Current slot:', slot);
    
    return true;
  } catch (error) {
    console.error('Connection failed:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\nConnection test passed! The Helius RPC endpoint is working correctly.');
    } else {
      console.log('\nConnection test failed! Please check the Helius RPC endpoint and API key.');
    }
  })
  .catch(err => {
    console.error('Error running test:', err);
  }); 