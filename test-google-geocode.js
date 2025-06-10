import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from 'dotenv';

dotenv.config();

async function testGoogleGeocode() {
  console.log('Testing Google Maps geocoding...');
  
  try {
    const transport = new StdioClientTransport({
      command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
      args: ['@modelcontextprotocol/server-google-maps'],
      env: {
        ...process.env,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_API_KEY
      }
    });

    const client = new Client({
      name: "test-geocode-client",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: {},
        resources: {}
      }
    });

    await client.connect(transport);
    console.log('Connected to MCP Google Maps server');
    
    // Test geocoding
    console.log('\n🔍 Testing geocoding for "1600 Amphitheatre Parkway, Mountain View, CA"...');
    const result = await client.callTool({
      name: 'maps_geocode',
      arguments: {
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
      }
    });
    
    console.log('✅ Geocoding result:');
    console.log(JSON.stringify(result, null, 2));
    
    await client.close();
    console.log('\n🎉 Google Maps geocoding test successful!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testGoogleGeocode();

