"use client";

import { useState, useEffect } from "react";
import { WarehouseView, type Ingredient } from "@/components/WarehouseView";

const API_URL = "https://sandboxtesting.info/warehouse/ingredients";

export function WarehouseManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Error al obtener ingredientes");
      }

      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error("Error al cargar ingredientes:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <WarehouseView 
      ingredients={ingredients} 
      onRefresh={fetchIngredients} 
      isRefreshing={isRefreshing}
    />
  );
} 