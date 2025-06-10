import { MCPToolsManager } from '@/components/MCPToolsManager';

export default function MCPToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">MCP Tools</h1>
          <p className="text-muted-foreground">
            Manage and test Model Context Protocol tools and services
          </p>
        </div>
        
        <MCPToolsManager />
      </div>
    </div>
  );
}

