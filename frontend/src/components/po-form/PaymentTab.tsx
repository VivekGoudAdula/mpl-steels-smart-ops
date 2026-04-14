
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function PaymentTab({ formData, updateFormData }: PaymentTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800">Payment Terms</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => updateFormData("paymentMode", value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentDays">Payment Days</Label>
            <Input
              id="paymentDays"
              type="number"
              value={formData.paymentDays}
              onChange={(e) => updateFormData("paymentDays", parseInt(e.target.value) || 0)}
              placeholder="e.g. 30"
              className="bg-white"
            />
            <p className="text-xs text-slate-500 italic">Number of days from invoice date</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
