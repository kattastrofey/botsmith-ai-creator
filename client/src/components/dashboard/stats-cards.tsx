import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageCircle, Cog, Plug, Zap, Brain, Network, Cpu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const cards = [
    {
      title: "Neural Agents",
      subtitle: "Active AI Entities",
      value: stats?.activeChatbots || 0,
      change: "+12%",
      icon: Brain,
      color: "purple",
      gradient: "from-ai-purple to-ai-pink",
      glowColor: "neon-purple",
    },
    {
      title: "Mind Bridges",
      subtitle: "Human-AI Conversations",
      value: stats?.conversations || 0,
      change: "+24%",
      icon: Network,
      color: "blue",
      gradient: "from-ai-blue to-ai-cyan",
      glowColor: "neon-blue",
    },
    {
      title: "Synaptic Flows",
      subtitle: "Automated Processes",
      value: stats?.automations || 0,
      change: "+8%",
      icon: Zap,
      color: "cyan",
      gradient: "from-ai-cyan to-ai-blue",
      glowColor: "neon-cyan",
    },
    {
      title: "Data Conduits",
      subtitle: "External Integrations",
      value: stats?.integrations || 0,
      change: "+2",
      icon: Cpu,
      color: "pink",
      gradient: "from-ai-pink to-ai-purple",
      glowColor: "shadow-neon-purple",
    },
  ];

  const getIconBgColor = (color: string) => {
    switch (color) {
      case "purple": return "bg-gradient-to-br from-ai-purple/20 to-ai-pink/20";
      case "blue": return "bg-gradient-to-br from-ai-blue/20 to-ai-cyan/20";
      case "cyan": return "bg-gradient-to-br from-ai-cyan/20 to-ai-blue/20";
      case "pink": return "bg-gradient-to-br from-ai-pink/20 to-ai-purple/20";
      default: return "bg-gradient-to-br from-ai-purple/10 to-ai-blue/10";
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "purple": return "text-ai-purple";
      case "blue": return "text-ai-blue";
      case "cyan": return "text-ai-cyan";
      case "pink": return "text-ai-pink";
      default: return "text-ai-purple";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="stat-card glass-card group">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-3 bg-white/20 rounded-full w-24"></div>
                    <div className="h-2 bg-white/10 rounded-full w-16"></div>
                    <div className="h-8 bg-white/30 rounded-lg w-20"></div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-ai-purple/20 to-ai-blue/20 rounded-xl backdrop-blur-sm border border-white/10"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-ai-cyan/40 rounded-full w-8"></div>
                  <div className="h-3 bg-white/20 rounded-full w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.title} 
            className={`stat-card glass-card group hover:${card.glowColor} transition-all duration-500 border-white/10 hover:border-white/20 relative overflow-hidden animate-slide-in`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Neural pattern overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
              <div className="w-full h-full bg-neural-pattern bg-[length:50px_50px] animate-neural-pulse"></div>
            </div>
            
            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                {/* Header with Icon */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground/90 tracking-wide uppercase">
                      {card.title}
                    </p>
                    <p className="text-xs text-foreground/60 font-mono">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className={`w-14 h-14 ${getIconBgColor(card.color)} rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-all duration-300 group-hover:shadow-glow`}>
                    <Icon className={`${getIconColor(card.color)} h-7 w-7 group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                </div>
                
                {/* Main Value */}
                <div className="space-y-2">
                  <p className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 font-mono`}>
                    {card.value.toLocaleString()}
                  </p>
                  
                  {/* Change Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-ai-cyan text-sm font-bold flex items-center gap-1">
                      <Zap className="h-3 w-3 animate-pulse" />
                      {card.change}
                    </span>
                    <span className="text-foreground/50 text-xs font-mono">
                      neural activity
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
