
import React, { useState, useEffect } from "react";
import { 
  Save, 
  X, 
  Truck, 
  Scale, 
  Clock, 
  FileText, 
  Upload, 
  Trash2, 
  ChevronLeft,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { samplePOs } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function WeighbridgeEntry() {
  const [formData, setFormData] = useState({
    wbNumber: "WB-" + Math.floor(10000 + Math.random() * 90000),
    poId: "",
    vehicleNumber: "",
    driverName: "",
    grossWeight: 0,
    tareWeight: 0,
    entryDateTime: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    materialType: "",
    vendorName: "",
  });

  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  // Auto-fill when PO is selected
  useEffect(() => {
    if (formData.poId) {
      const po = samplePOs.find(p => p.id === formData.poId);
      if (po) {
        setSelectedPO(po);
        setFormData(prev => ({
          ...prev,
          vendorName: po.vendorName,
          materialType: po.materialType
        }));
      }
    } else {
      setSelectedPO(null);
      setFormData(prev => ({
        ...prev,
        vendorName: "",
        materialType: ""
      }));
    }
  }, [formData.poId]);

  const netWeight = formData.grossWeight - formData.tareWeight;
  const isNegativeWeight = netWeight < 0;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.poId || !formData.vehicleNumber || formData.grossWeight <= 0) {
      toast.error("Please fill in all required fields (PO, Vehicle, and Gross Weight)");
      return;
    }

    const wbEntry = {
      ...formData,
      weights: {
        gross: formData.grossWeight,
        tare: formData.tareWeight,
        net: netWeight
      },
      file: file?.name || null
    };

    console.log("Saving Weighbridge Entry:", wbEntry);
    toast.success("Weighbridge Entry saved successfully!");
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to reset the form?")) {
      setFormData({
        wbNumber: "WB-" + Math.floor(10000 + Math.random() * 90000),
        poId: "",
        vehicleNumber: "",
        driverName: "",
        grossWeight: 0,
        tareWeight: 0,
        entryDateTime: new Date().toISOString().slice(0, 16),
        materialType: "",
        vendorName: "",
      });
      setFile(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Weighbridge Entry</h1>
          <p className="text-slate-500 mt-1">Capture incoming material weight details for factory entry</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} className="bg-white">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* PO Linking Section */}
          <Card className="border-none shadow-sm bg-slate-50/50 overflow-hidden">
            <div className="h-1 bg-blue-600 w-full" />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                PO Linking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="poSelect">Select Purchase Order</Label>
                <Select
                  value={formData.poId}
                  onValueChange={(val) => updateField("poId", val)}
                >
                  <SelectTrigger id="poSelect" className="bg-white border-slate-200">
                    <SelectValue placeholder="Choose a PO to link" />
                  </SelectTrigger>
                  <SelectContent>
                    {samplePOs.map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.id} – {po.vendorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPO && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-white rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Vendor</p>
                    <p className="font-medium text-slate-900">{selectedPO.vendorName}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Material</p>
                    <p className="font-medium text-slate-900">{selectedPO.materialType}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-slate-600" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>WB Number</Label>
                <Input value={formData.wbNumber} readOnly className="bg-slate-100 font-mono text-slate-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => updateField("vehicleNumber", e.target.value)}
                  placeholder="e.g. MH-12-AB-1234"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => updateField("driverName", e.target.value)}
                  placeholder="Enter driver name"
                  className="bg-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Weight Details */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-slate-600" />
                Weight Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="grossWeight">Gross Weight (Tons)</Label>
                  <div className="relative">
                    <Input
                      id="grossWeight"
                      type="number"
                      value={formData.grossWeight}
                      onChange={(e) => updateField("grossWeight", parseFloat(e.target.value) || 0)}
                      className="bg-white pr-12 text-lg font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">T</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tareWeight">Tare Weight (Tons)</Label>
                  <div className="relative">
                    <Input
                      id="tareWeight"
                      type="number"
                      value={formData.tareWeight}
                      onChange={(e) => updateField("tareWeight", parseFloat(e.target.value) || 0)}
                      className="bg-white pr-12 text-lg font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">T</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Net Weight (Tons)</Label>
                  <div className={cn(
                    "h-10 px-3 flex items-center justify-between rounded-md border text-xl font-bold transition-all duration-300",
                    isNegativeWeight 
                      ? "bg-red-50 border-red-200 text-red-600" 
                      : "bg-blue-600 border-blue-700 text-white shadow-inner"
                  )}>
                    <span>{netWeight.toFixed(3)}</span>
                    <span className="text-xs opacity-80">TONS</span>
                  </div>
                </div>
              </div>

              {isNegativeWeight && (
                <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-100 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  Warning: Net weight cannot be negative. Please check Gross and Tare values.
                </div>
              )}
              
              {!isNegativeWeight && netWeight > 0 && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-2 rounded-md border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                  Calculation: {formData.grossWeight} (Gross) - {formData.tareWeight} (Tare) = {netWeight.toFixed(3)} (Net)
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Logistics */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-slate-600" />
                Logistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entryDateTime">Entry Date & Time</Label>
                <Input
                  id="entryDateTime"
                  type="datetime-local"
                  value={formData.entryDateTime}
                  onChange={(e) => updateField("entryDateTime", e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Material Type</Label>
                <Input
                  value={formData.materialType}
                  readOnly
                  placeholder="Auto-filled from PO"
                  className="bg-slate-100 text-slate-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-slate-600" />
                WB Slip
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:border-blue-400 transition-all cursor-pointer"
                  onClick={() => document.getElementById("wb-upload")?.click()}
                >
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 text-center font-medium">Click to upload WB Slip</p>
                  <input
                    type="file"
                    id="wb-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              ) : (
                <div className="flex items-center p-3 bg-white border rounded-lg group">
                  <div className="bg-blue-50 p-2 rounded mr-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PO Summary Card */}
          {selectedPO && (
            <Card className="border-none shadow-md bg-blue-600 text-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">PO Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">{selectedPO.id}</p>
                  <p className="text-sm opacity-90">{selectedPO.vendorName}</p>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-70 uppercase">Material</p>
                    <p className="font-medium">{selectedPO.materialType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70 uppercase">Order Qty</p>
                    <p className="font-bold text-lg">{selectedPO.quantity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
