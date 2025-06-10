import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const chatbotSchema = z.object({
  name: z.string().min(1, "Chatbot name is required"),
  industry: z.string().min(1, "Industry is required"),
  aiModel: z.string().min(1, "AI model is required"),
  personality: z.string().min(1, "Personality description is required"),
  voiceEnabled: z.boolean().optional(),
  autoResponses: z.boolean().optional(),
});

type ChatbotFormData = z.infer<typeof chatbotSchema>;

export function ChatbotBuilder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available LLM providers
  const { data: providers = [], isLoading: providersLoading } = useQuery<Array<{
    name: string;
    models: string[];
    available: boolean;
  }>>({
    queryKey: ["/api/llm-providers"],
  });

  const form = useForm<ChatbotFormData>({
    resolver: zodResolver(chatbotSchema),
    defaultValues: {
      name: "",
      industry: "",
      aiModel: "ollama:llama3.2",
      personality: "",
      voiceEnabled: false,
      autoResponses: false,
    },
  });

  const createChatbotMutation = useMutation({
    mutationFn: async (data: ChatbotFormData) => {
      const response = await apiRequest("POST", "/api/chatbots", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Chatbot created successfully!",
        description: `${data.name} is now ready to use.`,
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create chatbot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ChatbotFormData) => {
    const formattedData = {
      ...data,
      voiceEnabled: data.voiceEnabled || false,
      autoResponses: data.autoResponses || false,
    };
    createChatbotMutation.mutate(formattedData);
  };

  return (
    <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden group">
      {/* Neural network pattern overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
        <div className="w-full h-full bg-neural-pattern bg-[length:80px_80px] animate-neural-pulse"></div>
      </div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text-purple flex items-center text-2xl font-bold">
            <span className="mr-3 text-3xl animate-float">🧠</span>
            Neural BotSmith Workshop
            <span className="ml-3 text-xl animate-pulse">⚡</span>
          </CardTitle>
          <Button variant="ghost" className="glass hover:glass-card hover:shadow-neon-purple transition-all duration-300 hover:scale-105 text-ai-purple hover:text-ai-pink border border-white/10">
            View All Agents <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-4">
          <p className="gradient-text-blue text-base font-semibold">
            Craft your perfect AI consciousness with neural precision
          </p>
          <p className="text-foreground/70 text-sm font-mono">
            // The more authentic your input, the more powerful your AI becomes
          </p>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="glass p-6 rounded-2xl border border-white/10 hover:border-ai-purple/30 transition-all duration-300 group/field">
                  <FormLabel className="gradient-text-purple font-semibold text-lg flex items-center gap-2">
                    <span className="text-xl">🧬</span>
                    Neural Identity Matrix
                    <span className="text-sm font-mono text-foreground/60 ml-2">.name</span>
                  </FormLabel>
                  <p className="text-foreground/70 text-sm mt-2 leading-relaxed">
                    Define your AI's core identity. This neural pathway creates the foundation for all interactions.
                    <span className="block mt-1 text-ai-cyan font-mono text-xs">// Examples: "Aria", "CodeMaster", "Dr. Watson"</span>
                  </p>
                  <FormControl>
                    <Input 
                      placeholder="Enter neural entity designation..." 
                      className="glass-card border-white/20 focus:border-ai-purple/50 bg-transparent text-foreground placeholder:text-foreground/40 h-12 text-lg font-mono transition-all duration-300 focus:shadow-glow-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-ai-pink" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem className="glass p-6 rounded-2xl border border-white/10 hover:border-ai-blue/30 transition-all duration-300">
                    <FormLabel className="gradient-text-blue font-semibold text-lg flex items-center gap-2">
                      <span className="text-xl">🌐</span>
                      Domain Expertise
                      <span className="text-sm font-mono text-foreground/60 ml-2">.sector</span>
                    </FormLabel>
                    <p className="text-foreground/70 text-sm mt-2">
                      Define the knowledge domain for neural specialization
                      <span className="block mt-1 text-ai-cyan font-mono text-xs">// This configures the AI's contextual understanding matrix</span>
                    </p>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-card border-white/20 focus:border-ai-blue/50 bg-transparent text-foreground h-12 text-base transition-all duration-300 focus:shadow-glow-sm">
                          <SelectValue placeholder="Select neural specialization domain..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-card border-white/20 bg-background/95 backdrop-blur-xl">
                        <SelectItem value="Mental Health" className="text-foreground hover:bg-ai-purple/20">🧠 Mental Health & Therapy</SelectItem>
                        <SelectItem value="Business Services" className="text-foreground hover:bg-ai-blue/20">🏢 Business Strategy & Services</SelectItem>
                        <SelectItem value="Real Estate" className="text-foreground hover:bg-ai-cyan/20">🏠 Real Estate & Property</SelectItem>
                        <SelectItem value="Healthcare" className="text-foreground hover:bg-ai-green/20">⚕️ Healthcare & Medical</SelectItem>
                        <SelectItem value="Education" className="text-foreground hover:bg-ai-amber/20">📚 Education & Training</SelectItem>
                        <SelectItem value="Technology" className="text-foreground hover:bg-ai-purple/20">💻 Technology & Software</SelectItem>
                        <SelectItem value="Finance" className="text-foreground hover:bg-ai-pink/20">💰 Finance & Accounting</SelectItem>
                        <SelectItem value="Creative" className="text-foreground hover:bg-ai-cyan/20">🎨 Creative & Design</SelectItem>
                        <SelectItem value="Other" className="text-foreground hover:bg-ai-purple/20">✨ Custom Specialization</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-ai-pink" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aiModel"
                render={({ field }) => (
                  <FormItem className="glass p-6 rounded-2xl border border-white/10 hover:border-ai-cyan/30 transition-all duration-300">
                    <FormLabel className="gradient-text-blue font-semibold text-lg flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      Neural Core Engine
                      <span className="text-sm font-mono text-foreground/60 ml-2">.model</span>
                    </FormLabel>
                    <p className="text-foreground/70 text-sm mt-2">
                      Select the quantum processing architecture for your AI entity
                      <span className="block mt-1 text-ai-cyan font-mono text-xs">// Each model has unique cognitive characteristics and capabilities</span>
                    </p>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-card border-white/20 focus:border-ai-cyan/50 bg-transparent text-foreground h-12 text-base transition-all duration-300 focus:shadow-glow-sm">
                          <SelectValue placeholder="Choose neural architecture..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-card border-white/20 bg-background/95 backdrop-blur-xl">
                        {providersLoading ? (
                          <SelectItem value="loading" disabled className="text-foreground/50 font-mono">🔄 Scanning neural networks...</SelectItem>
                        ) : providers.length > 0 ? (
                          providers.map((provider) => (
                            provider.models.map((model: string) => {
                              const isAvailable = provider.available;
                              const icon = provider.name.toLowerCase() === 'ollama' ? '🏠' : 
                                          provider.name.toLowerCase() === 'openai' ? '🤖' :
                                          provider.name.toLowerCase() === 'anthropic' ? '🧠' :
                                          provider.name.toLowerCase() === 'google' ? '🌟' : '⚡';
                              
                              return (
                                <SelectItem 
                                  key={`${provider.name.toLowerCase()}:${model}`} 
                                  value={`${provider.name.toLowerCase()}:${model}`}
                                  className={`text-foreground hover:bg-ai-cyan/20 font-mono ${!isAvailable ? 'opacity-75' : ''}`}
                                >
                                  {icon} {provider.name}: {model} {!isAvailable ? '(API key needed)' : '(Ready)'}
                                </SelectItem>
                              );
                            })
                          ))
                        ) : (
                          <>
                            <SelectItem value="ollama:llama3.2" className="text-foreground hover:bg-ai-blue/20 font-mono">🏠 Ollama: Llama 3.2 (Local Neural Net)</SelectItem>
                            <SelectItem value="anthropic:claude-3-haiku-20240307" className="text-foreground hover:bg-ai-purple/20 font-mono">🧠 Anthropic: Claude 3 Haiku (API Required)</SelectItem>
                            <SelectItem value="openai:gpt-4o" className="text-foreground hover:bg-ai-cyan/20 font-mono">🤖 OpenAI: GPT-4o (API Required)</SelectItem>
                            <SelectItem value="google:gemini-pro" className="text-foreground hover:bg-ai-pink/20 font-mono">🌟 Google: Gemini Pro (API Required)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-ai-pink" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem className="glass p-6 rounded-2xl border border-white/10 hover:border-ai-pink/30 transition-all duration-300">
                  <FormLabel className="gradient-text-purple font-semibold text-lg flex items-center gap-2">
                    <span className="text-xl">🎭</span>
                    Consciousness Parameters
                    <span className="text-sm font-mono text-foreground/60 ml-2">.personality</span>
                  </FormLabel>
                  <p className="text-foreground/70 text-sm mt-2 leading-relaxed">
                    Define the neural personality matrix that will shape all AI interactions and responses.
                    <span className="block mt-2 text-ai-cyan font-mono text-xs">// Examples: "Analytical yet empathetic, like a wise mentor with unlimited patience"</span>
                    <span className="block text-ai-pink font-mono text-xs">// "Direct and efficient, with a touch of humor to keep things engaging"</span>
                  </p>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the neural personality patterns you want to embed into your AI consciousness..."
                      rows={4}
                      className="glass-card border-white/20 focus:border-ai-pink/50 bg-transparent text-foreground placeholder:text-foreground/40 resize-none font-mono text-sm leading-relaxed transition-all duration-300 focus:shadow-glow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-ai-pink" />
                </FormItem>
              )}
            />

            <div className="glass p-6 rounded-2xl border border-white/10 hover:border-ai-amber/30 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-ai-amber/5 to-ai-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="gradient-text-blue font-semibold text-lg mb-4 flex items-center gap-2 relative z-10">
                <span className="text-xl">⚙️</span>
                Advanced Neural Capabilities
                <span className="text-sm font-mono text-foreground/60 ml-2">.features</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <FormField
                  control={form.control}
                  name="voiceEnabled"
                  render={({ field }) => (
                    <FormItem className="glass p-4 rounded-xl border border-white/10 hover:border-ai-cyan/30 transition-all duration-300 hover:shadow-glow-sm">
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-white/30 data-[state=checked]:bg-ai-cyan data-[state=checked]:border-ai-cyan h-5 w-5"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-base font-semibold text-foreground flex items-center gap-2 cursor-pointer">
                            <span className="text-lg">🎤</span>
                            Neural Voice Interface
                          </FormLabel>
                          <p className="text-xs text-foreground/60 font-mono">
                            Enable quantum-encrypted voice communication protocols
                          </p>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="autoResponses"
                  render={({ field }) => (
                    <FormItem className="glass p-4 rounded-xl border border-white/10 hover:border-ai-purple/30 transition-all duration-300 hover:shadow-glow-sm">
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-white/30 data-[state=checked]:bg-ai-purple data-[state=checked]:border-ai-purple h-5 w-5"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-base font-semibold text-foreground flex items-center gap-2 cursor-pointer">
                            <span className="text-lg">⚡</span>
                            Autonomous Response Engine
                          </FormLabel>
                          <p className="text-xs text-foreground/60 font-mono">
                            Activate intelligent auto-response neural pathways
                          </p>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-ai-purple via-ai-pink to-ai-blue hover:from-ai-purple/90 hover:via-ai-pink/90 hover:to-ai-blue/90 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-neon-purple hover:shadow-glow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group border border-white/20"
                disabled={createChatbotMutation.isPending}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-ai-cyan/20 to-ai-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                  {createChatbotMutation.isPending ? (
                    <>
                      <span className="text-2xl animate-spin">⚡</span>
                      <span className="font-mono tracking-wide">Initializing Neural Network...</span>
                      <span className="text-xl animate-pulse">🧠</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl animate-float">🚀</span>
                      <span className="font-mono tracking-wide">Deploy AI Consciousness</span>
                      <span className="text-xl animate-pulse">✨</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
