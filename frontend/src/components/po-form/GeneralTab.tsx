
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vendors, purchaseTypes, billingTypes, transportTypes } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface GeneralTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function GeneralTab({ formData, updateFormData }: GeneralTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">General Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-8">
          <FormGroup label="PO Number">
            <Input
              value={formData.poNumber}
              onChange={(e) => updateFormData("poNumber", e.target.value)}
              placeholder="e.g. PO-2024-001"
              className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all"
            />
          </FormGroup>
          <FormGroup label="PO Date">
            <DatePicker
              date={formData.poDate}
              setDate={(date) => updateFormData("poDate", date)}
              className="h-12 w-full bg-white rounded-xl border-slate-200"
            />
          </FormGroup>
          <FormGroup label="Vendor / Supplier">
            <Select value={formData.vendorId} onValueChange={(value) => updateFormData("vendorId", value)}>
              <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 font-medium">
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id} className="rounded-lg py-2.5">{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
          <FormGroup label="Purchase Type">
            <Select value={formData.purchaseType} onValueChange={(value) => updateFormData("purchaseType", value)}>
              <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                {purchaseTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="rounded-lg py-2.5">{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
          <FormGroup label="Contract Reference No">
            <Input
              value={formData.contractRef}
              onChange={(e) => updateFormData("contractRef", e.target.value)}
              placeholder="Ref Number"
              className="h-12 bg-white rounded-xl border-slate-200"
            />
          </FormGroup>
          <FormGroup label="Billing Type">
            <Select value={formData.billingType} onValueChange={(value) => updateFormData("billingType", value)}>
              <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50">
                <SelectValue placeholder="Select Billing Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                {billingTypes.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="rounded-lg py-2.5">{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-8">
            <FormGroup label="Contact Person">
              <Input
                value={formData.contactPerson}
                onChange={(e) => updateFormData("contactPerson", e.target.value)}
                placeholder="Full Name"
                className="h-12 bg-white rounded-xl border-slate-200"
              />
            </FormGroup>
            <FormGroup label="Contact Email">
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateFormData("contactEmail", e.target.value)}
                placeholder="email@example.com"
                className="h-12 bg-white rounded-xl border-slate-200"
              />
            </FormGroup>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Logistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-8">
            <FormGroup label="Consignee">
              <Input
                value={formData.consignee}
                onChange={(e) => updateFormData("consignee", e.target.value)}
                placeholder="Consignee Name"
                className="h-12 bg-white rounded-xl border-slate-200"
              />
            </FormGroup>
            <FormGroup label="Transport Type">
              <Select value={formData.transportType} onValueChange={(value) => updateFormData("transportType", value)}>
                <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50">
                  <SelectValue placeholder="Select Transport" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                  {transportTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="rounded-lg py-2.5">{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormGroup>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Address Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-8">
          <FormGroup label="Billing Address">
            <Textarea
              value={formData.billingAddress}
              onChange={(e) => updateFormData("billingAddress", e.target.value)}
              placeholder="Full Billing Address"
              className="bg-white rounded-xl border-slate-200 min-h-[120px] focus:ring-4 focus:ring-blue-50 transition-all"
            />
          </FormGroup>
          <FormGroup label="Shipping Address">
            <Textarea
              value={formData.shippingAddress}
              onChange={(e) => updateFormData("shippingAddress", e.target.value)}
              placeholder="Full Shipping Address"
              className="bg-white rounded-xl border-slate-200 min-h-[120px] focus:ring-4 focus:ring-blue-50 transition-all"
            />
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
