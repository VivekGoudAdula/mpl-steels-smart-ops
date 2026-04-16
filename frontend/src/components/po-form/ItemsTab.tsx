
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="enterprise-card p-0 overflow-hidden">
        <div className="flex flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Order Items</h3>
          <Button onClick={addItem} className="enterprise-button bg-[#002147] hover:bg-[#001633] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div>
          <div className="bg-white">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40%] h-12 text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-6">Item Name</TableHead>
                  <TableHead className="text-right h-12 text-[10px] font-bold uppercase tracking-widest text-gray-500">Quantity</TableHead>
                  <TableHead className="text-right h-12 text-[10px] font-bold uppercase tracking-widest text-gray-500">Rate (₹)</TableHead>
                  <TableHead className="text-right h-12 text-[10px] font-bold uppercase tracking-widest text-gray-500 pr-6">Total</TableHead>
                  <TableHead className="w-[80px] h-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-gray-500 font-medium">
                      No items added yet. Click "Add Item" to begin procurement.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-gray-50">
                      <TableCell className="pl-6 py-3">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          placeholder="Enter item name..."
                          className="enterprise-input w-full h-[40px] text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                          className="enterprise-input w-full h-[40px] text-right font-mono font-bold"
                        />
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                          className="enterprise-input w-full h-[40px] text-right font-mono font-bold"
                        />
                      </TableCell>
                      <TableCell className="text-right font-bold text-gray-900 pr-6 py-3 min-w-[120px]">
                        ₹{(item.quantity * item.rate).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-[40px] w-[40px] text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {items.length > 0 && (
                <TableFooter className="bg-[#002147] text-white">
                  <TableRow className="hover:bg-[#001b3d]">
                    <TableCell colSpan={3} className="text-right h-14 font-bold uppercase tracking-wider text-xs pl-6 text-white/70">Grand Total</TableCell>
                    <TableCell className="text-right text-white font-bold text-lg pr-6">
                      ₹{calculateTotal().toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
