import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Search, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface MCPServerStatus {
  [serverName: string]: boolean;
}

export function MCPToolsManager() {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [serverStatus, setServerStatus] = useState<MCPServerStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [toolParameters, setToolParameters] = useState<any>({});
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchMCPData();
  }, []);

  const fetchMCPData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [toolsRes, resourcesRes, statusRes] = await Promise.all([
        fetch('/api/mcp/tools'),
        fetch('/api/mcp/resources'),
        fetch('/api/mcp/status')
      ]);

      if (!toolsRes.ok || !resourcesRes.ok || !statusRes.ok) {
        throw new Error('Failed to fetch MCP data');
      }

      const toolsData = await toolsRes.json();
      const resourcesData = await resourcesRes.json();
      const statusData = await statusRes.json();

      setTools(toolsData.tools || []);
      setResources(resourcesData.resources || []);
      setServerStatus(statusData.status || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const executeTool = async () => {
    if (!selectedTool) return;
    
    setExecuting(true);
    setExecutionResult(null);
    
    try {
      const response = await fetch('/api/mcp/execute-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: selectedTool.name,
          parameters: toolParameters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to execute tool');
      }

      const result = await response.json();
      setExecutionResult(result.result);
    } catch (err) {
      setExecutionResult({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setExecuting(false);
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (isConnected: boolean) => isConnected ? 'success' : 'destructive';
  const getStatusIcon = (isConnected: boolean) => isConnected ? CheckCircle : AlertCircle;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading MCP tools...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchMCPData} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MCP (Model Context Protocol) Tools</CardTitle>
          <CardDescription>
            Google MCP servers provide access to over 100 tools and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tools">Tools ({tools.length})</TabsTrigger>
              <TabsTrigger value="resources">Resources ({resources.length})</TabsTrigger>
              <TabsTrigger value="status">Server Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button onClick={fetchMCPData} variant="outline">
                    Refresh
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredTools.map((tool) => (
                    <Card key={tool.name} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTool(tool)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{tool.name}</CardTitle>
                        <CardDescription className="text-xs">{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary" className="text-xs">
                          {Object.keys(tool.inputSchema?.properties || {}).length} parameters
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="space-y-4">
                {resources.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No resources available
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {resources.map((resource) => (
                      <Card key={resource.uri}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{resource.name}</CardTitle>
                          <CardDescription className="text-xs">{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground">
                            URI: {resource.uri}
                            {resource.mimeType && ` | Type: ${resource.mimeType}`}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="status">
              <div className="space-y-4">
                {Object.entries(serverStatus).map(([serverName, isConnected]) => {
                  const StatusIcon = getStatusIcon(isConnected);
                  return (
                    <Card key={serverName}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <span className="font-medium">{serverName}</span>
                        </div>
                        <Badge variant={isConnected ? 'default' : 'destructive'}>
                          {isConnected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTool && (
        <Card>
          <CardHeader>
            <CardTitle>Test Tool: {selectedTool.name}</CardTitle>
            <CardDescription>{selectedTool.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label>Parameters (JSON)</Label>
              <Textarea
                placeholder={JSON.stringify(selectedTool.inputSchema?.properties || {}, null, 2)}
                value={JSON.stringify(toolParameters, null, 2)}
                onChange={(e) => {
                  try {
                    setToolParameters(JSON.parse(e.target.value || '{}'));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                className="font-mono text-sm"
                rows={6}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={executeTool} disabled={executing}>
                <Play className="h-4 w-4 mr-2" />
                {executing ? 'Executing...' : 'Execute Tool'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedTool(null)}>
                Close
              </Button>
            </div>
            
            {executionResult && (
              <div className="space-y-2">
                <Label>Result:</Label>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-60">
                  {JSON.stringify(executionResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

