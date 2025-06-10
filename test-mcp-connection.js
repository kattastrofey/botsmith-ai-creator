import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMCPConnection() {
  console.log('Testing MCP Google Maps server connection...');
  
  // Check if API key is set
  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_actual_google_api_key_here') {
    console.error('❌ GOOGLE_API_KEY not set in .env file');
    console.log('Please add your Google API key to the .env file:');
    console.log('GOOGLE_API_KEY=your_actual_google_api_key');
    process.exit(1);
  }

  console.log('✅ GOOGLE_API_KEY found in environment');
  
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
      name: "test-client",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: {},
        resources: {}
      }
    });

    console.log('🔄 Connecting to MCP Google Maps server...');
    await client.connect(transport);
    console.log('✅ Connected to MCP Google Maps server!');
    
    // List available tools
    const tools = await client.listTools();
    console.log(`📋 Available tools: ${tools.tools.length}`);
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    
    // Try to list available resources (optional)
    try {
      const resources = await client.listResources();
      console.log(`📁 Available resources: ${resources.resources.length}`);
      resources.resources.forEach(resource => {
        console.log(`  - ${resource.name}: ${resource.description || 'No description'}`);
      });
    } catch (resourceError) {
      console.log('📁 Resources: Not available (this is normal for Google Maps MCP)');
    }
    
    console.log('\n🎉 MCP Google server is ready to use!');
    
    await client.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Failed to connect to MCP Google Maps server:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your GOOGLE_API_KEY is valid');
    console.log('2. Ensure the Google Maps API is enabled in your Google Cloud Console');
    console.log('3. Check that the API key has proper permissions');
    process.exit(1);
  }
}

testMCPConnection();

