
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Payment Terms</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-8">
          <FormGroup label="Payment Mode">
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => updateFormData("paymentMode", value)}
            >
              <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 font-medium">
                <SelectValue placeholder="Select Payment Option" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl">
                <SelectItem value="credit" className="rounded-lg py-2.5">Credit</SelectItem>
                <SelectItem value="cash" className="rounded-lg py-2.5">Cash</SelectItem>
                <SelectItem value="bank_transfer" className="rounded-lg py-2.5">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </FormGroup>
          <FormGroup label="Payment Days">
            <div className="space-y-2">
              <Input
                type="number"
                value={formData.paymentDays}
                onChange={(e) => updateFormData("paymentDays", parseInt(e.target.value) || 0)}
                placeholder="e.g. 30"
                className="h-12 bg-white rounded-xl border-slate-200"
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Number of days from invoice date</p>
            </div>
          </FormGroup>
        </CardContent>
      </Card>
    </div>
  );
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">
        {label}
      </Label>
      {children}
    </div>
  );
}
