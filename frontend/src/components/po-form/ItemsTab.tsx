
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Item {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

interface ItemsTabProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

export function ItemsTab({ items, setItems }: ItemsTabProps) {
  const addItem = () => {
    const newItem: Item = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      quantity: 0,
      rate: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800">Order Items</CardTitle>
          <Button onClick={addItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[40%]">Item Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-500 italic">
                      No items added yet. Click "Add Item" to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          placeholder="Enter item name"
                          className="border-none focus-visible:ring-1 bg-transparent"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                          className="text-right border-none focus-visible:ring-1 bg-transparent"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                          className="text-right border-none focus-visible:ring-1 bg-transparent"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{(item.quantity * item.rate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {items.length > 0 && (
                <TableFooter className="bg-slate-50 font-bold">
                  <TableRow>
                    <TableCell colSpan={3} className="text-right">Grand Total</TableCell>
                    <TableCell className="text-right text-blue-600">
                      ₹{calculateTotal().toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
