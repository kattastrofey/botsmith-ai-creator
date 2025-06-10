import { Sidebar } from "@/components/dashboard/sidebar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ChatbotBuilder } from "@/components/dashboard/chatbot-builder";
import { WorkflowBuilder } from "@/components/dashboard/workflow-builder";
import { ChatPreview } from "@/components/dashboard/chat-preview";
import { IntegrationsPanel } from "@/components/dashboard/integrations-panel";
import { AnalyticsSummary } from "@/components/dashboard/analytics-summary";
import { ProviderStatus } from "@/components/dashboard/provider-status";
import { FloatingChat } from "@/components/chat-widget/floating-chat";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden neural-bg">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Futuristic Header with Glassmorphism */}
        <header className="glass-card border-b border-white/10 px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold gradient-text-purple flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                AI Control Center
                <span className="text-xl animate-float">✨</span>
              </h2>
              <p className="text-foreground/80 font-medium">
                Neural network powered chatbot orchestration
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-ai-purple to-ai-pink hover:from-ai-purple/90 hover:to-ai-pink/90 text-white shadow-neon-purple hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/create-agent'}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create AI Agent
              </Button>
              <Button variant="ghost" size="icon" className="glass hover:glass-card hover:shadow-neon-blue transition-all duration-300 hover:scale-110">
                <Bell className="h-5 w-5 text-ai-cyan" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content with Enhanced Styling */}
        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Neural Network Status Display */}
          <StatsCards />

          {/* AI Operations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary AI Workshop */}
            <div className="lg:col-span-2 space-y-8">
              <ChatbotBuilder />
              <WorkflowBuilder />
            </div>

            {/* Neural Analytics Sidebar */}
            <div className="space-y-8">
              <ChatPreview />
              <ProviderStatus />
              <IntegrationsPanel />
              <AnalyticsSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <FloatingChat />
    </div>
  );
}
