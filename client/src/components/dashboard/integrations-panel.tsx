import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: number;
  name: string;
  type: string;
  isConnected: boolean;
}

const integrationIcons: Record<string, string> = {
  'Salesforce': '🏢',
  'HubSpot': '🧡',
  'Mailchimp': '📧',
  'Stripe': '💳',
  'Zapier': '⚡',
  'Slack': '💬',
};

const integrationColors: Record<string, string> = {
  'Salesforce': 'bg-blue-100 dark:bg-blue-900/30',
  'HubSpot': 'bg-orange-100 dark:bg-orange-900/30',
  'Mailchimp': 'bg-green-100 dark:bg-green-900/30',
  'Stripe': 'bg-purple-100 dark:bg-purple-900/30',
  'Zapier': 'bg-yellow-100 dark:bg-yellow-900/30',
  'Slack': 'bg-purple-100 dark:bg-purple-900/30',
};

export function IntegrationsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ["/api/integrations"],
  });

  const connectIntegrationMutation = useMutation({
    mutationFn: async (integrationId: number) => {
      const response = await apiRequest("PUT", `/api/integrations/${integrationId}`, {
        isConnected: true
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Integration connected!",
        description: `${data.name} has been successfully connected.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to connect integration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const availableIntegrations = [
    { name: 'Mailchimp', type: 'Email Marketing' },
    { name: 'Stripe', type: 'Payment Processing' },
    { name: 'Zapier', type: 'Automation' },
    { name: 'Slack', type: 'Team Communication' },
  ];

  const addIntegrationMutation = useMutation({
    mutationFn: async (integration: { name: string; type: string }) => {
      const response = await apiRequest("POST", "/api/integrations", {
        name: integration.name,
        type: integration.type,
        config: { apiKey: "demo", endpoint: `https://api.${integration.name.toLowerCase()}.com` },
        isConnected: false,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Integration added!",
        description: `${data.name} is now available to configure.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add integration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map((integration: Integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg integration-item"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${integrationColors[integration.name] || 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center text-lg`}>
                  {integrationIcons[integration.name] || '🔗'}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{integration.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{integration.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {integration.isConnected ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <Badge variant="secondary" className="text-xs">Connected</Badge>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => connectIntegrationMutation.mutate(integration.id)}
                    disabled={connectIntegrationMutation.isPending}
                    className="text-xs"
                  >
                    {connectIntegrationMutation.isPending ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Add new integrations */}
          {availableIntegrations.map((integration) => {
            const isAlreadyAdded = integrations.some((i: Integration) => i.name === integration.name);
            if (isAlreadyAdded) return null;

            return (
              <div
                key={integration.name}
                className="flex items-center justify-between p-3 border border-dashed border-gray-200 dark:border-slate-600 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${integrationColors[integration.name] || 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center text-lg opacity-50`}>
                    {integrationIcons[integration.name] || '🔗'}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{integration.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{integration.type}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addIntegrationMutation.mutate(integration)}
                  disabled={addIntegrationMutation.isPending}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Add
                </Button>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 text-primary hover:text-primary/80 border-gray-200 dark:border-slate-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </CardContent>
    </Card>
  );
}
