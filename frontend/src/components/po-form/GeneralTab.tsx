
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="enterprise-card">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900">General Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormGroup label="PO Number">
            <Input
              value={formData.poNumber}
              onChange={(e) => updateFormData("poNumber", e.target.value)}
              placeholder="e.g. PO-2024-001"
              className="enterprise-input w-full"
            />
          </FormGroup>
          <FormGroup label="PO Date">
            <DatePicker
              date={formData.poDate}
              setDate={(date) => updateFormData("poDate", date)}
              className="enterprise-input w-full"
            />
          </FormGroup>
          <FormGroup label="Vendor / Supplier">
            <Select value={formData.vendorId} onValueChange={(value) => updateFormData("vendorId", value)}>
              <SelectTrigger className="enterprise-input w-full">
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
          <FormGroup label="Purchase Type">
            <Select value={formData.purchaseType} onValueChange={(value) => updateFormData("purchaseType", value)}>
              <SelectTrigger className="enterprise-input w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {purchaseTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
          <FormGroup label="Contract Reference No">
            <Input
              value={formData.contractRef}
              onChange={(e) => updateFormData("contractRef", e.target.value)}
              placeholder="Ref Number"
              className="enterprise-input w-full"
            />
          </FormGroup>
          <FormGroup label="Billing Type">
            <Select value={formData.billingType} onValueChange={(value) => updateFormData("billingType", value)}>
              <SelectTrigger className="enterprise-input w-full">
                <SelectValue placeholder="Select Billing Type" />
              </SelectTrigger>
              <SelectContent>
                {billingTypes.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="enterprise-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">Contact Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="Contact Person">
              <Input
                value={formData.contactPerson}
                onChange={(e) => updateFormData("contactPerson", e.target.value)}
                placeholder="Full Name"
                className="enterprise-input w-full"
              />
            </FormGroup>
            <FormGroup label="Contact Email">
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateFormData("contactEmail", e.target.value)}
                placeholder="email@example.com"
                className="enterprise-input w-full"
              />
            </FormGroup>
          </div>
        </div>

        <div className="enterprise-card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">Logistics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="Consignee">
              <Input
                value={formData.consignee}
                onChange={(e) => updateFormData("consignee", e.target.value)}
                placeholder="Consignee Name"
                className="enterprise-input w-full"
              />
            </FormGroup>
            <FormGroup label="Transport Type">
              <Select value={formData.transportType} onValueChange={(value) => updateFormData("transportType", value)}>
                <SelectTrigger className="enterprise-input w-full">
                  <SelectValue placeholder="Select Transport" />
                </SelectTrigger>
                <SelectContent>
                  {transportTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormGroup>
          </div>
        </div>
      </div>

      <div className="enterprise-card">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-900">Address Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Billing Address">
            <Textarea
              value={formData.billingAddress}
              onChange={(e) => updateFormData("billingAddress", e.target.value)}
              placeholder="Full Billing Address"
              className="enterprise-input w-full min-h-[120px] resize-none py-3"
            />
          </FormGroup>
          <FormGroup label="Shipping Address">
            <Textarea
              value={formData.shippingAddress}
              onChange={(e) => updateFormData("shippingAddress", e.target.value)}
              placeholder="Full Shipping Address"
              className="enterprise-input w-full min-h-[120px] resize-none py-3"
            />
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
