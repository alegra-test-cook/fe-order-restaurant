"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export type Order = {
  orderId: string;
  status: "finalizado" | "en proceso";
  dish: string;
  createdAt: string;
  finishedAt?: string;
  image?: string;
  description?: string;
};

export function OrderItem({ order }: { order: Order }) {
  const createdAt = new Date(order?.createdAt || new Date());
  const timeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: es,
  });

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {order.image && (
        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={order.image}
            alt={order.dish}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-medium">{order.dish}</h3>
          <Badge
            variant={order.status === "finalizado" ? "success" : "secondary"}
          >
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
        {order.description && (
          <p className="text-sm text-gray-600 mb-2">{order.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Orden #{order.orderId.substring(0, 8)} • Creado {timeAgo}
        </p>
        {order.finishedAt && (
          <p className="text-sm text-muted-foreground">
            Finalizado: {new Date(order.finishedAt).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
} 