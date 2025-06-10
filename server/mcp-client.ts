import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export class MCPClientManager {
  private clients: Map<string, Client> = new Map();
  private availableTools: Map<string, MCPTool[]> = new Map();
  private availableResources: Map<string, MCPResource[]> = new Map();

  constructor() {
    this.initializeClients();
  }

  private async initializeClients() {
    try {
      // Initialize Google Maps MCP server
      await this.connectGoogleMapsServer();
      
      // Add more Google services as needed
      // await this.connectGoogleDriveServer();
      // await this.connectGoogleCalendarServer();
      
      console.log('MCP clients initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MCP clients:', error);
    }
  }

  private async connectGoogleMapsServer() {
    try {
      // Check if we have the required API key
      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here') {
        console.warn('GOOGLE_API_KEY not found or is placeholder value, skipping Google Maps MCP server connection');
        return;
      }

      console.log('Google Maps MCP Server running on stdio');
      
      const transport = new StdioClientTransport({
        command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
        args: ['@modelcontextprotocol/server-google-maps'],
        env: {
          ...process.env,
          GOOGLE_MAPS_API_KEY: process.env.GOOGLE_API_KEY
        }
      });

      const client = new Client({
        name: "adoptabot-google-maps-client",
        version: "1.0.0"
      }, {
        capabilities: {
          tools: {},
          resources: {}
        }
      });

      await client.connect(transport);
      
      // List available tools and resources
      const tools = await client.listTools();
      const resources = await client.listResources();
      
      this.clients.set('google-maps', client);
      this.availableTools.set('google-maps', tools.tools);
      this.availableResources.set('google-maps', resources.resources);
      
      console.log('Google Maps MCP server connected:', {
        tools: tools.tools.length,
        resources: resources.resources.length
      });
      
    } catch (error) {
      console.error('Failed to connect Google Maps MCP server:', error);
    }
  }

  // Get all available tools across all connected servers
  public getAllTools(): MCPTool[] {
    const allTools: MCPTool[] = [];
    for (const tools of this.availableTools.values()) {
      allTools.push(...tools);
    }
    return allTools;
  }

  // Get all available resources across all connected servers
  public getAllResources(): MCPResource[] {
    const allResources: MCPResource[] = [];
    for (const resources of this.availableResources.values()) {
      allResources.push(...resources);
    }
    return allResources;
  }

  // Execute a tool by name
  public async executeTool(toolName: string, parameters: any): Promise<any> {
    for (const [serverName, client] of this.clients.entries()) {
      const serverTools = this.availableTools.get(serverName) || [];
      const tool = serverTools.find(t => t.name === toolName);
      
      if (tool) {
        try {
          const result = await client.callTool({
            name: toolName,
            arguments: parameters
          });
          return result;
        } catch (error) {
          console.error(`Error executing tool ${toolName}:`, error);
          throw error;
        }
      }
    }
    
    throw new Error(`Tool ${toolName} not found in any connected MCP server`);
  }

  // Get resource content
  public async getResource(uri: string): Promise<any> {
    for (const [serverName, client] of this.clients.entries()) {
      const serverResources = this.availableResources.get(serverName) || [];
      const resource = serverResources.find(r => r.uri === uri);
      
      if (resource) {
        try {
          const result = await client.readResource({ uri });
          return result;
        } catch (error) {
          console.error(`Error reading resource ${uri}:`, error);
          throw error;
        }
      }
    }
    
    throw new Error(`Resource ${uri} not found in any connected MCP server`);
  }

  // Get server status
  public getServerStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const [serverName, client] of this.clients.entries()) {
      status[serverName] = client.transport.isConnected ?? false;
    }
    return status;
  }

  // Search for tools by description or name
  public searchTools(query: string): MCPTool[] {
    const allTools = this.getAllTools();
    const lowerQuery = query.toLowerCase();
    
    return allTools.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description?.toLowerCase().includes(lowerQuery)
    );
  }

  // Close all connections
  public async disconnect() {
    for (const [serverName, client] of this.clients.entries()) {
      try {
        await client.close();
        console.log(`Disconnected from ${serverName} MCP server`);
      } catch (error) {
        console.error(`Error disconnecting from ${serverName}:`, error);
      }
    }
    this.clients.clear();
    this.availableTools.clear();
    this.availableResources.clear();
  }
}

// Global MCP client manager instance
export const mcpManager = new MCPClientManager();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down MCP connections...');
  await mcpManager.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down MCP connections...');
  await mcpManager.disconnect();
  process.exit(0);
});

