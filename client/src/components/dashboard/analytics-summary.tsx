import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AnalyticsSummary() {
  const analytics = [
    {
      label: "Response Rate",
      value: "94%",
      progress: 94,
      color: "bg-green-500",
    },
    {
      label: "Avg. Response Time",
      value: "1.2s",
      progress: 85,
      color: "bg-primary",
    },
    {
      label: "User Satisfaction",
      value: "4.8/5",
      progress: 96,
      color: "bg-orange-500",
    },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white">
            Analytics
          </CardTitle>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
          >
            View Details <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {analytics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.label}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Today's Highlights
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Conversations:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                127
              </span>
            </div>
            <div className="flex justify-between">
              <span>Messages:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                456
              </span>
            </div>
            <div className="flex justify-between">
              <span>Resolutions:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                89%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
