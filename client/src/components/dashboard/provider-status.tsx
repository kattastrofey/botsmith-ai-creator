import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Provider {
  name: string;
  models: string[];
  available: boolean;
}

export function ProviderStatus() {
  const { data: providers = [], isLoading } = useQuery<Provider[]>({
    queryKey: ["/api/llm-providers"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <span>AI Providers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">Loading provider status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <span>AI Providers</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              {provider.available ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <h4 className="font-medium">{provider.name}</h4>
                <p className="text-sm text-gray-500">
                  {provider.models.length} model{provider.models.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <Badge variant={provider.available ? "default" : "secondary"}>
              {provider.available ? "Ready" : "API Key Needed"}
            </Badge>
          </div>
        ))}
        
        {providers.filter(p => !p.available).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Need more AI options?</strong> Some providers require API keys to unlock additional models. 
              Contact support to add your API credentials for expanded functionality.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}