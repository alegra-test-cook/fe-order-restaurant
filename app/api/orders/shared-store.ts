// Este archivo es para compartir el almacenamiento de órdenes entre los route handlers
// En una aplicación real, usarías una base de datos

export type Order = {
  orderId: string
  status: "finalizado" | "en proceso"
  dish: string
  createdAt: string
  finishedAt?: string
}

// Almacenamiento compartido de órdenes
export const orders: Order[] = []

