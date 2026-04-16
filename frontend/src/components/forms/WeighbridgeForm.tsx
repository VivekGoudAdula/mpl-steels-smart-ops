
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
          <button 
            onClick={onClose} 
            className="enterprise-button-secondary h-12 px-6 flex items-center gap-2 group"
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Cancel</span>
          </button>
          <button 
            onClick={handleSave} 
            className="enterprise-button-primary h-12 px-8 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">Save Entry</span>
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-3 text-[#002147]" />
                PO Linking
              </h3>
            </div>
            <div className="space-y-6">
              <FormGroup label="Select Purchase Order">
                <Select value={formData.poId} onValueChange={(val) => updateField("poId", val)}>
                  <SelectTrigger className="enterprise-input w-full">
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
              </FormGroup>

              {selectedPO && (
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="enterprise-card bg-gray-50 border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Vendor Name</p>
                    <p className="font-bold text-gray-900 text-sm tracking-tight">{selectedPO.vendorName}</p>
                  </div>
                  <div className="enterprise-card bg-gray-50 border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Material Information</p>
                    <p className="font-bold text-gray-900 text-sm tracking-tight">{selectedPO.materialType}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Truck className="w-5 h-5 mr-3 text-gray-600" />
                Vehicle & Personnel
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormGroup label="WB Number">
                <Input value={formData.wbNumber} readOnly className="enterprise-input w-full bg-gray-50 font-mono text-gray-500 border-gray-200" />
              </FormGroup>
              <FormGroup label="Vehicle Number">
                <Input
                  value={formData.vehicleNumber}
                  onChange={(e) => updateField("vehicleNumber", e.target.value)}
                  placeholder="e.g. MH-12-AB-1234"
                  className="enterprise-input w-full uppercase"
                />
              </FormGroup>
              <FormGroup label="Driver Name">
                <Input
                  value={formData.driverName}
                  onChange={(e) => updateField("driverName", e.target.value)}
                  placeholder="Full name"
                  className="enterprise-input w-full"
                />
              </FormGroup>
            </div>
          </div>

          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Scale className="w-5 h-5 mr-3 text-[#002147]" />
                Weight Measurement (MT)
              </h3>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormGroup label="Gross Weight">
                  <div className="relative group">
                    <Input
                      type="number"
                      value={formData.grossWeight || ""}
                      onChange={(e) => updateField("grossWeight", parseFloat(e.target.value) || 0)}
                      className="enterprise-input w-full pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">MT</span>
                  </div>
                </FormGroup>
                <FormGroup label="Tare Weight">
                  <div className="relative group">
                    <Input
                      type="number"
                      value={formData.tareWeight || ""}
                      onChange={(e) => updateField("tareWeight", parseFloat(e.target.value) || 0)}
                      className="enterprise-input w-full pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">MT</span>
                  </div>
                </FormGroup>
                <FormGroup label="Calculated Net Weight">
                  <div className={cn(
                    "h-[48px] px-4 flex items-center justify-between rounded bg-white border font-bold transition-all shadow-sm",
                    isNegativeWeight 
                      ? "bg-red-50 border-red-200 text-red-600" 
                      : "bg-[#002147] border-[#002147] text-white"
                  )}>
                    <span>{netWeight.toFixed(3)}</span>
                    <span className="text-[9px] opacity-70 uppercase tracking-widest">MT</span>
                  </div>
                </FormGroup>
              </div>

              {isNegativeWeight && (
                <div className="mt-6 flex items-center gap-3 text-red-700 text-xs font-bold bg-red-50 p-4 rounded border border-red-100">
                  <AlertCircle className="w-4 h-4" />
                  Critical Error: Gross weight cannot be less than tare weight. Please calibrate sensors.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-3 text-gray-600" />
                Time & Status
              </h3>
            </div>
            <div className="space-y-6">
              <FormGroup label="Entry Date & Time">
                <Input
                  type="datetime-local"
                  value={formData.entryDateTime}
                  onChange={(e) => updateField("entryDateTime", e.target.value)}
                  className="enterprise-input w-full"
                />
              </FormGroup>
              <div className="enterprise-card bg-gray-50 border-gray-200">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Calibration Status</p>
                <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Sensors Calibrated
                </div>
              </div>
            </div>
          </div>

          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Upload className="w-5 h-5 mr-3 text-gray-600" />
                Weight Documentation
              </h3>
            </div>
            <div>
              {!file ? (
                <div 
                  className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:border-[#002147] hover:bg-gray-100 transition-all cursor-pointer group"
                  onClick={() => document.getElementById("wb-upload")?.click()}
                >
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#002147] mb-2" />
                  <p className="text-xs text-gray-500 text-center font-bold uppercase tracking-wider">Upload Weight Slip</p>
                  <input
                    type="file"
                    id="wb-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              ) : (
                <div className="flex items-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#002147] transition-colors group">
                  <div className="bg-[#002147] p-2 rounded mr-3">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
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
