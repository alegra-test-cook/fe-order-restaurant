"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Package } from "lucide-react";

export type Ingredient = {
  _id: string;
  name: string;
  stock: number;
};

interface WarehouseViewProps {
  ingredients: Ingredient[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function WarehouseView({ ingredients, onRefresh, isRefreshing }: WarehouseViewProps) {
  const getIngredientEmoji = (name: string) => {
    const emojis: Record<string, string> = {
      "tomato": "🍅",
      "lemon": "🍋",
      "potato": "🥔",
      "rice": "🍚",
      "ketchup": "🥫",
      "lettuce": "🥬",
      "onion": "🧅",
      "cheese": "🧀",
      "meat": "🥩",
      "chicken": "🍗",
      "carrot": "🥕",
      "fish": "🐟",
      "egg": "🥚",
      "bread": "🍞",
      "milk": "🥛",
      "pasta": "🍝",
      "flour": "🌾",
      "sugar": "🍬",
      "salt": "🧂",
      "olive oil": "🫒",
    };
    
    return emojis[name] || "📦";
  };
  
  const getStockColor = (stock: number) => {
    if (stock <= 1) return "text-red-500";
    if (stock <= 3) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventario de Bodega
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent>
        {ingredients.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay ingredientes disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map((ingredient) => (
              <div 
                key={ingredient._id} 
                className="border rounded-lg p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="text-3xl flex-shrink-0">
                  {getIngredientEmoji(ingredient.name)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium capitalize">
                    {ingredient.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Stock:
                    </span>
                    <span className={`font-medium ${getStockColor(ingredient.stock)}`}>
                      {ingredient.stock} {ingredient.stock === 1 ? "unidad" : "unidades"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 