import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

type Order = {
  orderId: string
  status: "finalizado" | "en proceso"
  dish: string
  createdAt: string
  finishedAt?: string
}

// En una aplicación real, esto sería una base de datos
let orders: Order[] = []

export async function GET() {
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dish } = body

    if (!dish) {
      return NextResponse.json({ error: "Se requiere el nombre del plato" }, { status: 400 })
    }

    const orderId = randomBytes(12).toString("hex")
    const newOrder: Order = {
      orderId,
      status: "en proceso",
      dish,
      createdAt: new Date().toISOString(),
    }

    // En una aplicación real, guardarías en una base de datos
    orders = [newOrder, ...orders]

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Error al crear la orden:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

