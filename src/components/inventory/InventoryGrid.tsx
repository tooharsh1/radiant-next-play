import { Card } from "@/components/ui/card";
import { Droplet } from "lucide-react";

interface InventoryGridProps {
  inventory: Record<string, number>;
}

export function InventoryGrid({ inventory }: InventoryGridProps) {
  const getStockStatus = (units: number) => {
    if (units === 0) return { label: "Out of Stock", color: "bg-destructive/10 border-destructive text-destructive" };
    if (units < 15) return { label: "Low Stock", color: "bg-yellow-50 border-yellow-300 text-yellow-700" };
    if (units < 30) return { label: "Medium Stock", color: "bg-blue-50 border-blue-300 text-blue-700" };
    return { label: "Good Stock", color: "bg-green-50 border-green-300 text-green-700" };
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Object.entries(inventory).map(([bloodGroup, units]) => {
        const status = getStockStatus(units);
        return (
          <Card
            key={bloodGroup}
            className={`p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${status.color}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-primary fill-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">{bloodGroup}</h3>
                <p className="text-3xl font-bold mt-1">{units}</p>
                <p className="text-xs mt-1 font-medium">{status.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
