
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
      <div className="enterprise-card">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900">Payment Terms</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Payment Mode">
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => updateFormData("paymentMode", value)}
            >
              <SelectTrigger className="enterprise-input w-full">
                <SelectValue placeholder="Select Payment Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
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
                className="enterprise-input w-full"
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Number of days from invoice date</p>
            </div>
          </FormGroup>
        </div>
      </div>
    </div>
  );
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
        {label}
      </Label>
      {children}
    </div>
  );
}
