"use server"

import { randomBytes } from "crypto"

type Order = {
  orderId: string
  status: "finalizado" | "en proceso"
  dish: string
  createdAt: string
  finishedAt?: string
}

// In a real application, this would be a database
let orders: Order[] = []

export async function createOrder(dish: string): Promise<Order> {
  const orderId = randomBytes(12).toString("hex")
  const newOrder: Order = {
    orderId,
    status: "en proceso",
    dish,
    createdAt: new Date().toISOString(),
  }

  // In a real app, you would save to a database
  orders = [newOrder, ...orders]

  return newOrder
}

export async function updateOrderStatus(orderId: string): Promise<Order> {
  // In a real app, you would update the database
  const orderIndex = orders.findIndex((order) => order.orderId === orderId)

  if (orderIndex === -1) {
    throw new Error(`Order with ID ${orderId} not found`)
  }

  const updatedOrder: Order = {
    ...orders[orderIndex],
    status: "finalizado",
    finishedAt: new Date().toISOString(),
  }

  orders[orderIndex] = updatedOrder

  return updatedOrder
}

export async function getOrders(): Promise<Order[]> {
  // In a real app, you would fetch from a database
  return orders
}

