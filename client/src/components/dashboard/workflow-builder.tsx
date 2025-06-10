import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Filter, Cog, ExternalLink, MessageSquare, Database, Mail, Webhook, Brain, Network, Zap, Activity } from "lucide-react";
import { useState } from "react";

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'filter' | 'action';
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const workflowNodes: WorkflowNode[] = [
  {
    id: 'neural-trigger',
    type: 'trigger',
    name: 'Neural Impulse',
    icon: Brain,
    color: 'text-ai-purple',
    description: 'Quantum trigger when consciousness detects input patterns'
  },
  {
    id: 'data-sync',
    type: 'action',
    name: 'Memory Bank Sync',
    icon: Database,
    color: 'text-ai-cyan',
    description: 'Upload consciousness data to neural repository'
  },
  {
    id: 'quantum-message',
    type: 'action',
    name: 'Quantum Message',
    icon: Network,
    color: 'text-ai-blue',
    description: 'Transmit encrypted neural communication'
  },
  {
    id: 'neural-bridge',
    type: 'action',
    name: 'Neural Bridge',
    icon: Zap,
    color: 'text-ai-pink',
    description: 'Establish quantum entanglement with external systems'
  },
];

export function WorkflowBuilder() {
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null);
  const [droppedNodes, setDroppedNodes] = useState<WorkflowNode[]>([]);

  const handleDragStart = (e: React.DragEvent, node: WorkflowNode) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedNode) {
      setDroppedNodes(prev => [...prev, { ...draggedNode, id: `${draggedNode.id}-${Date.now()}` }]);
      setDraggedNode(null);
    }
  };

  const clearWorkflow = () => {
    setDroppedNodes([]);
  };

  return (
    <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden group">
      {/* Neural background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
        <div className="w-full h-full bg-neural-pattern bg-[length:60px_60px] animate-neural-pulse"></div>
      </div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text-blue flex items-center text-2xl font-bold">
            <span className="mr-3 text-3xl animate-float">⚡</span>
            Synaptic Flow Network
            <span className="ml-3 text-xl animate-pulse">🧠</span>
          </CardTitle>
          <Button className="glass hover:glass-card hover:shadow-neon-cyan transition-all duration-300 hover:scale-105 text-ai-cyan hover:text-ai-blue border border-white/10 bg-gradient-to-r from-ai-cyan/10 to-ai-blue/10">
            <span className="font-mono">Neural Flow++</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="gradient-text-purple text-base font-semibold mt-2">
          Orchestrate autonomous AI behavioral patterns and decision trees
        </p>
        <p className="text-foreground/60 text-sm font-mono">
          // Advanced neural workflow orchestration and automation systems
        </p>
      </CardHeader>
      <CardContent className="relative z-10">
        <div 
          className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center min-h-[300px] glass relative overflow-hidden group/workspace"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Neural workspace pattern */}
          <div className="absolute inset-0 bg-neural-pattern bg-[length:40px_40px] animate-neural-pulse opacity-0 group-hover/workspace:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
          <div className="relative z-10">
            {droppedNodes.length === 0 ? (
              <>
                {/* Neural Flow Template */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="bg-gradient-to-r from-ai-purple to-ai-pink text-white p-4 rounded-2xl shadow-neon-purple workflow-node animate-pulse">
                    <Brain className="h-6 w-6 mb-2 mx-auto" />
                    <p className="text-xs font-mono font-bold">NEURAL TRIGGER</p>
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-ai-purple to-ai-cyan rounded-full animate-pulse"></div>
                  <div className="glass-card border border-white/20 p-4 rounded-2xl shadow-glow workflow-node hover:border-ai-cyan/50 transition-all duration-300">
                    <Activity className="h-6 w-6 text-ai-cyan mb-2 mx-auto" />
                    <p className="text-xs text-foreground/80 font-mono font-bold">PROCESS</p>
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-ai-cyan to-ai-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="glass-card border border-white/20 p-4 rounded-2xl shadow-glow workflow-node hover:border-ai-blue/50 transition-all duration-300">
                    <Zap className="h-6 w-6 text-ai-blue mb-2 mx-auto" />
                    <p className="text-xs text-foreground/80 font-mono font-bold">EXECUTE</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="gradient-text-purple font-bold text-lg">Neural Flow Constructor</p>
                  <p className="text-foreground/70 font-mono text-sm">// Drag quantum nodes below to architect your AI consciousness flows</p>
                  <p className="text-foreground/50 text-xs font-mono">Establish neural pathways between triggers, processors, and actions</p>
                </div>
              </>
            ) : (
              <>
                {/* Neural Flow Chain */}
                <div className="flex items-center justify-center space-x-6 mb-8 flex-wrap gap-6">
                  {droppedNodes.map((node, index) => {
                    const Icon = node.icon;
                    return (
                      <div key={node.id} className="flex items-center">
                        <div className="glass-card border border-white/20 p-4 rounded-2xl shadow-glow workflow-node hover:shadow-neon-cyan transition-all duration-500 group relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-ai-cyan/10 to-ai-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                          <Icon className={`h-6 w-6 ${node.color} mb-2 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300`} />
                          <p className="text-xs font-mono font-bold text-foreground relative z-10 group-hover:gradient-text-cyan transition-all duration-300">{node.name}</p>
                        </div>
                        {index < droppedNodes.length - 1 && (
                          <div className="w-12 h-1 bg-gradient-to-r from-ai-cyan to-ai-purple rounded-full animate-pulse mx-4"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button 
                  onClick={clearWorkflow} 
                  className="glass hover:glass-card border border-ai-pink/30 text-ai-pink hover:text-ai-pink/80 hover:shadow-neon-purple transition-all duration-300 font-mono mb-6"
                >
                  🗑️ Neural Reset
                </Button>
              </>
            )}

            {/* Quantum Node Library */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {workflowNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node)}
                    className="glass-card border border-white/20 p-4 rounded-2xl cursor-move hover:shadow-neon-cyan hover:border-ai-cyan/50 transition-all duration-500 workflow-node drag-handle group relative overflow-hidden animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    title={node.description}
                  >
                    {/* Neural pattern overlay */}
                    <div className="absolute inset-0 bg-neural-pattern bg-[length:20px_20px] animate-neural-pulse opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="relative z-10 text-center space-y-2">
                      <Icon className={`${node.color} h-8 w-8 mx-auto group-hover:scale-125 transition-transform duration-300`} />
                      <p className="text-xs font-mono font-bold text-foreground group-hover:gradient-text-cyan transition-all duration-300">{node.name}</p>
                      <p className="text-xs text-foreground/50 font-mono leading-tight">{node.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
