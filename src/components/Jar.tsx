import { useState } from "react";
import {
  Trash2,
  PieChart as PieChartIcon,
  List as ListIcon,
  Plus,
  Minus,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

import type { JarItem } from "../types";
import { COLORS } from "@/constants";

interface JarProps {
  jarItems: JarItem[];
  onRemoveFruit: (fruitId: number) => void;
  onUpdateQuantity: (fruitId: number, quantity: number) => void;
  onClearJar?: () => void;
  totalCalories?: number;
  totalItems?: number;
}

const Jar = ({
  jarItems,
  onRemoveFruit,
  onUpdateQuantity,
  onClearJar,
  totalCalories: propTotalCalories,
  totalItems: propTotalItems,
}: JarProps) => {
  const [showChart, setShowChart] = useState(false);

  const totalCalories =
    propTotalCalories ??
    jarItems.reduce(
      (sum, item) => sum + item.nutritions.calories * item.quantity,
      0
    );

  const totalItems =
    propTotalItems ?? jarItems.reduce((sum, item) => sum + item.quantity, 0);

  const chartData = jarItems.map((item, index) => ({
    name: item.name,
    value: item.nutritions.calories * item.quantity,
    color: COLORS[index % COLORS.length],
    quantity: item.quantity,
    caloriesPerUnit: item.nutritions.calories,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Fruit Jar</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowChart(false)}
            variant={!showChart ? "default" : "outline"}
            size="sm"
          >
            <ListIcon size={14} className="mr-1" />
            List
          </Button>
          <Button
            onClick={() => setShowChart(true)}
            variant={showChart ? "default" : "outline"}
            size="sm"
          >
            <PieChartIcon size={14} className="mr-1" />
            Chart
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
              <p className="text-sm text-gray-600">Total Fruits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {totalCalories}
              </p>
              <p className="text-sm text-gray-600">Total Calories</p>
            </div>
          </div>
          {onClearJar && jarItems.length > 0 && (
            <div className="mt-4 text-center">
              <Button
                onClick={onClearJar}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear Jar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {jarItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-8xl mb-4">🫙</div>
          <p className="text-gray-500 text-lg">Your jar is empty</p>
          <p className="text-gray-400 text-sm">
            Add some fruits to get started!
          </p>
        </div>
      ) : (
        <>
          {!showChart ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto flex flex-col gap-2">
              {jarItems.map((item) => (
                <Card key={item.id} className="p-0 m-0">
                  <CardContent className="p-4 m-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="inline-block mr-4">
                            {item.nutritions.calories} cal/fruit
                          </span>
                          <span className="inline-block text-blue-600 font-medium">
                            Total: {item.nutritions.calories * item.quantity}{" "}
                            cal
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 mr-4">
                          <Button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity - 1)
                            }
                            variant="outline"
                            size="sm"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            variant="outline"
                            size="sm"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <Button
                          onClick={() => onRemoveFruit(item.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default Jar;
