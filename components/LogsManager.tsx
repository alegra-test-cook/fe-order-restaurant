"use client";

import { useState, useEffect } from "react";
import { LogsView, type LogEntry } from "@/components/LogsView";

const API_URL = "https://sandboxtesting.info/orders";

export function LogsManager() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/logs`);
      if (!response.ok) {
        throw new Error("Error al obtener logs");
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error al cargar logs:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <LogsView 
      logs={logs} 
      onRefreshLogs={fetchLogs} 
      isRefreshing={isRefreshing}
    />
  );
}

export const useLogsManager = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/logs`);
      if (!response.ok) {
        throw new Error("Error al obtener logs");
      }

      const data = await response.json();
      setLogs(data);
      return data;
    } catch (error) {
      console.error("Error al cargar logs:", error);
      return [];
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    logs,
    isRefreshing,
    fetchLogs
  };
}; 