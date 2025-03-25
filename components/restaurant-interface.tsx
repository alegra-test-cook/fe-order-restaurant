"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, FileText, Book } from "lucide-react";
import { OrderItem, type Order } from "@/components/OrderItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogsManager } from "@/components/LogsManager";

const API_URL =
  "http://ec2-18-225-234-44.us-east-2.compute.amazonaws.com/orders";

export function RestaurantInterface() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("ordenes");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error("Error al obtener órdenes");

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOrderDish = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al crear orden");

      const newOrder = await response.json();
      setOrders((prev) => [newOrder, ...prev]);

      setTimeout(() => fetchOrders(), 1000);
    } catch (error) {
      console.error("Error al crear la orden:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleOrderDish}
          disabled={isLoading}
          className="text-lg px-8 py-6"
        >
          {isLoading ? "Procesando..." : "Pedir Plato"}
        </Button>
      </div>

      <Tabs defaultValue="ordenes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="ordenes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Órdenes
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ordenes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lista de Órdenes</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={isRefreshing}
              >
                <RefreshCcw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay órdenes. ¡Haz clic en "Pedir Plato" para comenzar!
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderItem key={order.orderId} order={order} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <LogsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
