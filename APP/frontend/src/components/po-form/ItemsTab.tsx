
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
      <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Order Items</CardTitle>
          <Button onClick={addItem} className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-blue-100">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40%] h-14 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-6">Item Name</TableHead>
                  <TableHead className="text-right h-14 text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity</TableHead>
                  <TableHead className="text-right h-14 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate (₹)</TableHead>
                  <TableHead className="text-right h-14 text-[10px] font-black uppercase tracking-widest text-slate-400 pr-6">Total</TableHead>
                  <TableHead className="w-[80px] h-14"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                      No items added yet. Click "Add Item" to begin procurement.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-slate-50/30">
                      <TableCell className="pl-6 py-4">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          placeholder="Enter item name..."
                          className="h-11 border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 rounded-xl bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                          className="h-11 text-right border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 rounded-xl bg-slate-50/50 focus:bg-white transition-all font-mono font-bold"
                        />
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                          className="h-11 text-right border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 rounded-xl bg-slate-50/50 focus:bg-white transition-all font-mono font-bold"
                        />
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900 pr-6 py-4">
                        ₹{(item.quantity * item.rate).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {items.length > 0 && (
                <TableFooter className="bg-slate-900 border-t border-slate-800">
                  <TableRow className="hover:bg-slate-950">
                    <TableCell colSpan={3} className="text-right h-16 text-slate-400 font-bold uppercase tracking-wider text-[10px] pl-6">Grand Total</TableCell>
                    <TableCell className="text-right text-white font-black text-lg pr-6">
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
