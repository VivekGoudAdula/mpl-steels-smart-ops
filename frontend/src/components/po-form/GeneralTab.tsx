
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

interface GeneralTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function GeneralTab({ formData, updateFormData }: GeneralTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800">General Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="poNumber">PO Number</Label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => updateFormData("poNumber", e.target.value)}
              placeholder="e.g. PO-2024-001"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>PO Date</Label>
            <DatePicker
              date={formData.poDate}
              setDate={(date) => updateFormData("poDate", date)}
            />
          </div>
          <div className="space-y-2">
            <Label>Vendor / Supplier</Label>
            <Select
              value={formData.vendorId}
              onValueChange={(value) => updateFormData("vendorId", value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Purchase Type</Label>
            <Select
              value={formData.purchaseType}
              onValueChange={(value) => updateFormData("purchaseType", value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {purchaseTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractRef">Contract Reference No</Label>
            <Input
              id="contractRef"
              value={formData.contractRef}
              onChange={(e) => updateFormData("contractRef", e.target.value)}
              placeholder="Ref Number"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Billing Type</Label>
            <Select
              value={formData.billingType}
              onValueChange={(value) => updateFormData("billingType", value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Billing Type" />
              </SelectTrigger>
              <SelectContent>
                {billingTypes.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => updateFormData("contactPerson", e.target.value)}
              placeholder="Full Name"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData("contactEmail", e.target.value)}
              placeholder="email@example.com"
              className="bg-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800">Delivery & Logistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="consignee">Consignee</Label>
              <Input
                id="consignee"
                value={formData.consignee}
                onChange={(e) => updateFormData("consignee", e.target.value)}
                placeholder="Consignee Name"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Transport Type</Label>
              <Select
                value={formData.transportType}
                onValueChange={(value) => updateFormData("transportType", value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Transport" />
                </SelectTrigger>
                <SelectContent>
                  {transportTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromLocation">From Location</Label>
                <Input
                  id="fromLocation"
                  value={formData.fromLocation}
                  onChange={(e) => updateFormData("fromLocation", e.target.value)}
                  placeholder="Origin"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toLocation">To Location</Label>
                <Input
                  id="toLocation"
                  value={formData.toLocation}
                  onChange={(e) => updateFormData("toLocation", e.target.value)}
                  placeholder="Destination"
                  className="bg-white"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Textarea
                id="billingAddress"
                value={formData.billingAddress}
                onChange={(e) => updateFormData("billingAddress", e.target.value)}
                placeholder="Full Billing Address"
                className="bg-white min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingAddress">Shipping Address</Label>
              <Textarea
                id="shippingAddress"
                value={formData.shippingAddress}
                onChange={(e) => updateFormData("shippingAddress", e.target.value)}
                placeholder="Full Shipping Address"
                className="bg-white min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
