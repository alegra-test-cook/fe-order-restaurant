import { type NextRequest, NextResponse } from "next/server"

// Referencia a las órdenes del archivo route.ts principal
// En una aplicación real, esto sería una consulta a la base de datos
import { orders } from "../shared-store"

export async function PATCH(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const orderId = params.orderId

    // En una aplicación real, buscarías en la base de datos
    const orderIndex = orders.findIndex((order) => order.orderId === orderId)

    if (orderIndex === -1) {
      return NextResponse.json({ error: `Orden con ID ${orderId} no encontrada` }, { status: 404 })
    }

    const updatedOrder = {
      ...orders[orderIndex],
      status: "finalizado",
      finishedAt: new Date().toISOString(),
    }

    // Actualizar la orden en el array
    orders[orderIndex] = updatedOrder

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error al actualizar la orden:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

