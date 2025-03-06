"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, RefreshCcw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type Order = {
  orderId: string
  status: "finalizado" | "en proceso"
  dish: string
  createdAt: string
  finishedAt?: string
}

const DISHES = [
  "Ensalada César",
  "Pasta Carbonara",
  "Pizza Margherita",
  "Hamburguesa Clásica",
  "Tacos al Pastor",
  "Sushi Variado",
  "Paella",
  "Ramen",
  "Pollo a la Parrilla",
  "Risotto de Champiñones",
]

export function RestaurantInterface() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Cargar órdenes al iniciar
  useEffect(() => {
    fetchOrders()
  }, [])

  // Función para obtener todas las órdenes
  const fetchOrders = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error("Error al obtener órdenes")

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error al cargar órdenes:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Función para crear una nueva orden
  const handleOrderDish = async () => {
    setIsLoading(true)
    try {
      const randomDish = DISHES[Math.floor(Math.random() * DISHES.length)]

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dish: randomDish }),
      })

      if (!response.ok) throw new Error("Error al crear orden")

      const newOrder = await response.json()
      setOrders((prev) => [newOrder, ...prev])

      // Simular finalización de orden después de un tiempo aleatorio (entre 5-15 segundos)
      setTimeout(
        async () => {
          try {
            const updateResponse = await fetch(`/api/orders/${newOrder.orderId}`, {
              method: "PATCH",
            })

            if (!updateResponse.ok) throw new Error("Error al actualizar orden")

            const updatedOrder = await updateResponse.json()
            setOrders((prev) => prev.map((order) => (order.orderId === updatedOrder.orderId ? updatedOrder : order)))
          } catch (error) {
            console.error("Error al actualizar estado de orden:", error)
          }
        },
        Math.random() * 10000 + 5000,
      )
    } catch (error) {
      console.error("Error al crear la orden:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Button size="lg" onClick={handleOrderDish} disabled={isLoading} className="text-lg px-8 py-6">
          {isLoading ? "Procesando..." : "Pedir Plato"}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Órdenes</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isRefreshing}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
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
    </div>
  )
}

function OrderItem({ order }: { order: Order }) {
  const createdAt = new Date(order.createdAt)
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: es })

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-medium">{order.dish}</h3>
          <Badge variant={order.status === "finalizado" ? "success" : "secondary"}>
            {order.status === "finalizado" ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Finalizado
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> En proceso
              </span>
            )}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Orden #{order.orderId.substring(0, 8)} • Creado {timeAgo}
        </p>
        {order.finishedAt && (
          <p className="text-sm text-muted-foreground">Finalizado: {new Date(order.finishedAt).toLocaleTimeString()}</p>
        )}
      </div>
    </div>
  )
}

