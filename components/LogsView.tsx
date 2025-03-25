"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Info } from "lucide-react";

export type LogEntry = {
  _id: string;
  timestamp: string;
  service: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  data: Record<string, any>;
};

interface LogsViewProps {
  logs: LogEntry[];
  onRefreshLogs: () => void;
  isRefreshing: boolean;
}

export function LogsView({ logs, onRefreshLogs, isRefreshing }: LogsViewProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warn":
        return "warning";
      case "info":
        return "secondary";
      case "debug":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getServiceColor = (service: string) => {
    const services: Record<string, string> = {
      "order-service": "bg-blue-100 text-blue-800",
      "kitchen": "bg-green-100 text-green-800",
      "warehouse": "bg-amber-100 text-amber-800",
      "market": "bg-purple-100 text-purple-800",
    };
    
    return services[service] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registro de Actividad del Sistema</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshLogs}
          disabled={isRefreshing}
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Actualizar Logs
        </Button>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay actividad registrada.
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <LogItem 
                key={log._id} 
                log={log} 
                levelColor={getLevelColor(log.level)}
                serviceColor={getServiceColor(log.service)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface LogItemProps {
  log: LogEntry;
  levelColor: string;
  serviceColor: string;
}

function LogItem({ log, levelColor, serviceColor }: LogItemProps) {
  const formatDataToList = (data: Record<string, any>) => {
    if (!data || Object.keys(data).length === 0) return null;
    
    return Object.entries(data).map(([key, value], index) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      const formattedValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : value.toString();
        
      return (
        <div key={index} className="flex items-start gap-2 mb-1">
          <span className="font-medium text-xs">✦ {formattedKey}:</span>
          <span className="text-xs">{formattedValue}</span>
        </div>
      );
    });
  };
  
  return (
    <div className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Badge variant={levelColor as any} className="capitalize">
            {log.level}
          </Badge>
          <span className={`text-xs px-2 py-1 rounded-full ${serviceColor}`}>
            {log.service}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      </div>
      <p className="text-sm mb-1">{log.message}</p>
      
      {log.data && Object.keys(log.data).length > 0 && (
        <div className="mt-2 text-xs bg-slate-50 p-2 rounded border">
          <p className="font-medium mb-2 flex items-center">
            <Info className="h-3 w-3 mr-1" /> 
            Información adicional
          </p>
          <div className="space-y-1">
            {formatDataToList(log.data)}
          </div>
        </div>
      )}
    </div>
  );
} 