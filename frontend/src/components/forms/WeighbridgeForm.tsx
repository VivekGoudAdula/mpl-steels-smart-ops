
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
import { toast } from "sonner";
import { samplePOs } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface WeighbridgeFormProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function WeighbridgeForm({ isModal, onClose }: WeighbridgeFormProps) {
  const [formData, setFormData] = useState({
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

  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

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
    toast.success("Weighbridge Entry saved successfully!");
    if (onClose) onClose();
  };

  return (
    <div className={cn("bg-white", isModal ? "p-8" : "max-w-5xl mx-auto px-4 py-8")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Weighbridge Entry</h1>
          <p className="text-slate-500 mt-1">Capture incoming material weight details for factory entry</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl bg-white border-slate-200 font-bold active:scale-95 transition-all">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all">
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-600" />
                PO Linking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-8">
              <FormGroup label="Select Purchase Order">
                <Select value={formData.poId} onValueChange={(val) => updateField("poId", val)}>
                  <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-medium">
                    <SelectValue placeholder="Choose a PO to link" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl border-slate-100 p-1">
                    {samplePOs.map((po) => (
                      <SelectItem key={po.id} value={po.id} className="rounded-lg py-2.5 px-3">
                        {po.id} – {po.vendorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormGroup>

              {selectedPO && (
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md animate-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Vendor Name</p>
                    <p className="font-black text-slate-900 text-sm tracking-tight">{selectedPO.vendorName}</p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md animate-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Material Information</p>
                    <p className="font-black text-slate-900 text-sm tracking-tight">{selectedPO.materialType}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <Truck className="w-5 h-5 mr-3 text-slate-600" />
                Vehicle & Personnel
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-8">
              <FormGroup label="WB Number">
                <Input value={formData.wbNumber} readOnly className="h-12 border-none rounded-xl bg-slate-200/50 font-mono font-bold text-slate-600" />
              </FormGroup>
              <FormGroup label="Vehicle Number">
                <Input
                  value={formData.vehicleNumber}
                  onChange={(e) => updateField("vehicleNumber", e.target.value)}
                  placeholder="e.g. MH-12-AB-1234"
                  className="h-12 border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-bold placeholder:font-normal"
                />
              </FormGroup>
              <FormGroup label="Driver Name">
                <Input
                  value={formData.driverName}
                  onChange={(e) => updateField("driverName", e.target.value)}
                  placeholder="Full name"
                  className="h-12 border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-medium"
                />
              </FormGroup>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <Scale className="w-5 h-5 mr-3 text-slate-600" />
                Weight Measurement (MT)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormGroup label="Gross Weight">
                  <div className="relative group">
                    <Input
                      type="number"
                      value={formData.grossWeight || ""}
                      onChange={(e) => updateField("grossWeight", parseFloat(e.target.value) || 0)}
                      className="h-12 border-slate-200 rounded-xl bg-white pr-12 text-base font-black focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest group-focus-within:text-blue-500">MT</span>
                  </div>
                </FormGroup>
                <FormGroup label="Tare Weight">
                  <div className="relative group">
                    <Input
                      type="number"
                      value={formData.tareWeight || ""}
                      onChange={(e) => updateField("tareWeight", parseFloat(e.target.value) || 0)}
                      className="h-12 border-slate-200 rounded-xl bg-white pr-12 text-base font-black focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest group-focus-within:text-blue-500">MT</span>
                  </div>
                </FormGroup>
                <FormGroup label="Calculated Net Weight">
                  <div className={cn(
                    "h-12 px-5 flex items-center justify-between rounded-xl border text-lg font-black transition-all duration-300 shadow-sm",
                    isNegativeWeight 
                      ? "bg-red-50 border-red-200 text-red-600" 
                      : "bg-slate-900 border-slate-800 text-white"
                  )}>
                    <span>{netWeight.toFixed(3)}</span>
                    <span className="text-[9px] opacity-60 uppercase font-black tracking-[0.2em]">Metric Tons</span>
                  </div>
                </FormGroup>
              </div>

              {isNegativeWeight && (
                <div className="mt-6 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] bg-red-50 p-4 rounded-xl border border-red-100 animate-in slide-in-from-top-4 duration-500">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  Critical Error: Gross weight cannot be less than tare weight. Please calibrate sensors.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <Clock className="w-5 h-5 mr-3 text-slate-600" />
                Time & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-8">
              <FormGroup label="Entry Date & Time">
                <Input
                  type="datetime-local"
                  value={formData.entryDateTime}
                  onChange={(e) => updateField("entryDateTime", e.target.value)}
                  className="h-12 border-slate-200 rounded-xl bg-white px-4 font-medium focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </FormGroup>
              <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 ml-1">Calibration Status</p>
                <div className="flex items-center gap-2.5 text-emerald-600 font-black text-xs uppercase tracking-[0.15em]">
                  <CheckCircle2 className="w-5 h-5" />
                  Sensors Calibrated
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <Upload className="w-5 h-5 mr-3 text-slate-600" />
                Weight Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              {!file ? (
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-white hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer group"
                  onClick={() => document.getElementById("wb-upload")?.click()}
                >
                  <div className="bg-slate-50 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center font-black uppercase tracking-[0.15em]">Upload Weight Slip</p>
                  <input
                    type="file"
                    id="wb-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              ) : (
                <div className="flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-blue-200 transition-colors">
                  <div className="bg-slate-900 p-3 rounded-xl mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{(file.size / 1024).toFixed(1)} KB • PDF</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
