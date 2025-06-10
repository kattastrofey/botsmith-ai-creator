import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Bot, 
  Settings, 
  Workflow, 
  Plug, 
  User,
  LayoutDashboard,
  Brain,
  Network,
  Cpu,
  Activity,
  Command,
  Sparkles,
  PlusCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const navigation = [
    { 
      name: "Neural Command Center", 
      subtitle: "Mission Control",
      icon: Command, 
      href: "#", 
      current: true,
      gradient: "from-ai-purple to-ai-pink",
      glowColor: "shadow-neon-purple",
    },
    { 
      name: "AI Entities", 
      subtitle: "Neural Agents",
      icon: Brain, 
      href: "#", 
      current: false,
      gradient: "from-ai-blue to-ai-cyan",
      glowColor: "shadow-neon-blue",
    },
    { 
      name: "Synaptic Flows", 
      subtitle: "Workflows",
      icon: Zap, 
      href: "#", 
      current: false,
      gradient: "from-ai-cyan to-ai-blue",
      glowColor: "shadow-neon-cyan",
    },
    { 
      name: "Data Conduits", 
      subtitle: "Integrations",
      icon: Cpu, 
      href: "#", 
      current: false,
      gradient: "from-ai-pink to-ai-purple",
      glowColor: "shadow-neon-purple",
    },
    { 
      name: "Data Streams", 
      subtitle: "Analytics",
      icon: Activity, 
      href: "#", 
      current: false,
      gradient: "from-ai-amber to-ai-green",
      glowColor: "shadow-neon-cyan",
    },
    { 
      name: "Core Systems", 
      subtitle: "Settings",
      icon: Settings, 
      href: "#", 
      current: false,
      gradient: "from-ai-green to-ai-blue",
      glowColor: "shadow-neon-blue",
    },
  ];

  return (
    <div className="w-72 glass-sidebar flex-shrink-0 neural-bg relative">
      {/* Neural Brand Header */}
      <div className="p-6 border-b border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-ai-purple/10 to-ai-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="h-12 w-12 bg-gradient-to-r from-ai-purple via-ai-pink to-ai-blue rounded-2xl flex items-center justify-center shadow-neon-purple animate-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-neural-pattern bg-[length:20px_20px] animate-neural-pulse opacity-30"></div>
            <Brain className="h-6 w-6 text-white relative z-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold gradient-text-purple">
              adopt.a.bot
            </h1>
            <p className="text-xs text-foreground/60 font-mono">
              Neural Network OS v2.0
            </p>
          </div>
        </div>
      </div>

      {/* Neural Navigation Matrix */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "block w-full group relative overflow-hidden transition-all duration-500 transform hover:scale-[1.02]",
                item.current ? "" : "hover:-translate-x-1"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "glass-card border border-white/10 rounded-2xl p-4 transition-all duration-300",
                item.current
                  ? `bg-gradient-to-r ${item.gradient} bg-opacity-20 border-white/30 ${item.glowColor}`
                  : "hover:border-white/30 hover:bg-white/5"
              )}>
                {/* Neural pattern overlay */}
                <div className={cn(
                  "absolute inset-0 bg-neural-pattern bg-[length:30px_30px] animate-neural-pulse opacity-0 transition-opacity duration-500 rounded-2xl",
                  item.current ? "opacity-10" : "group-hover:opacity-5"
                )}></div>
                
                <div className="flex items-center space-x-4 relative z-10">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    item.current 
                      ? `bg-gradient-to-r ${item.gradient} shadow-glow`
                      : "bg-white/10 group-hover:bg-white/20"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      item.current 
                        ? "text-white" 
                        : "text-foreground/80 group-hover:text-foreground group-hover:scale-110"
                    )} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className={cn(
                      "text-sm font-bold block transition-all duration-300",
                      item.current 
                        ? "gradient-text-purple" 
                        : "text-foreground/90 group-hover:text-foreground"
                    )}>
                      {item.name}
                    </span>
                    <p className="text-xs text-foreground/50 font-mono">
                      {item.subtitle}
                    </p>
                  </div>
                  {item.current && (
                    <div className="w-2 h-2 bg-ai-cyan rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </nav>

      {/* Neural Entity Creation Portal */}
      <div className="p-6 border-t border-white/10 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ai-cyan to-transparent"></div>
        <Button className="w-full bg-gradient-to-r from-ai-purple via-ai-pink to-ai-blue hover:from-ai-purple/90 hover:via-ai-pink/90 hover:to-ai-blue/90 text-white font-bold py-4 rounded-2xl shadow-neon-purple hover:shadow-glow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group border border-white/20">
          {/* Button neural pattern */}
          <div className="absolute inset-0 bg-neural-pattern bg-[length:25px_25px] animate-neural-pulse opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"></div>
          
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="font-mono tracking-wide">Spawn New AI Entity</span>
            <PlusCircle className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
          </div>
        </Button>
        
        {/* Neural activity indicator */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-ai-cyan rounded-full animate-pulse"></div>
          <p className="text-xs text-foreground/50 font-mono">
            Neural networks: ACTIVE
          </p>
          <div className="w-2 h-2 bg-ai-pink rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

    </div>
  );
}
