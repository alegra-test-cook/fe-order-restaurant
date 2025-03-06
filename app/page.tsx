import { RestaurantInterface } from "@/components/restaurant-interface"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Sistema de Restaurante</h1>
      <RestaurantInterface />
    </main>
  )
}

