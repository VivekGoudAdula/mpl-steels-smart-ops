
import React, { useState, useEffect } from "react";
import { 
  Save, 
  X, 
  Link2, 
  PackageCheck, 
  ShieldCheck, 
  FileText, 
  Upload, 
  Trash2, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Info
} from "lucide-react";
import DocumentViewer from "../DocumentViewer";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { samplePOs, sampleWBEntries } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface GRNFormProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function GRNForm({ isModal, onClose }: GRNFormProps) {
  const [formData, setFormData] = useState({
    grnNumber: "GRN-" + Math.floor(10000 + Math.random() * 90000),
    poId: "",
    wbId: "",
    receivedQty: 0,
    acceptedQty: 0,
    rejectedQty: 0,
    qualityStatus: "pass",
    remarks: "",
    materialType: "",
    vendorName: "",
    expectedQty: 0,
  });

  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [selectedWB, setSelectedWB] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const filteredWBs = sampleWBEntries.filter(wb => wb.poId === formData.poId);

  useEffect(() => {
    if (formData.poId) {
      const po = samplePOs.find(p => p.id === formData.poId);
      if (po) {
        setSelectedPO(po);
        setFormData(prev => ({
          ...prev,
          vendorName: po.vendorName,
          materialType: po.materialType,
          expectedQty: po.quantity,
          wbId: ""
        }));
      }
    } else {
      setSelectedPO(null);
      setFormData(prev => ({ ...prev, vendorName: "", materialType: "", expectedQty: 0, wbId: "" }));
    }
  }, [formData.poId]);

  useEffect(() => {
    if (formData.wbId) {
      const wb = sampleWBEntries.find(w => w.id === formData.wbId);
      if (wb) {
        setSelectedWB(wb);
        setFormData(prev => ({ ...prev, receivedQty: wb.netWeight, acceptedQty: wb.netWeight, rejectedQty: 0 }));
      }
    } else {
      setSelectedWB(null);
    }
  }, [formData.wbId]);

  useEffect(() => {
    const rejected = Math.max(0, formData.receivedQty - formData.acceptedQty);
    if (rejected !== formData.rejectedQty) {
      setFormData(prev => ({ ...prev, rejectedQty: rejected }));
    }
  }, [formData.receivedQty, formData.acceptedQty]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.poId || !formData.wbId || formData.receivedQty <= 0) {
      toast.error("Please ensure PO and WB are selected and quantities are valid.");
      return;
    }
    toast.success("GRN created and verified successfully!");
    if (onClose) onClose();
  };

  const isQtyMismatch = selectedWB && formData.receivedQty > selectedWB.netWeight;
  const hasRejections = formData.rejectedQty > 0;

  return (
    <div className={cn("bg-white", isModal ? "p-8" : "max-w-6xl mx-auto px-4 py-8")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Goods Receipt Note</h1>
          <p className="text-slate-500 mt-1">Record and validate received materials against PO and Weighbridge data</p>
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
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">Verify GRN</span>
          </button>
        </div>

      </div>

      <div className="mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-5">
        <div className="flex items-center justify-between px-4">
          <Step num={1} label="Link Purchase Order" active={!!formData.poId} />
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <Step num={2} label="Link Weighbridge" active={!!formData.wbId} />
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <Step num={3} label="Quantity Verification" active={formData.receivedQty > 0} />
        </div>
        <Progress value={formData.poId ? (formData.wbId ? (formData.receivedQty > 0 ? 100 : 66) : 33) : 0} className="h-2.5 rounded-full bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-10">
        <div className="lg:col-span-3 space-y-6">
          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Link2 className="w-5 h-5 mr-3 text-[#002147]" />
                Upstream Document Linking
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Purchase Order">
                <Select value={formData.poId} onValueChange={(val) => updateField("poId", val)}>
                  <SelectTrigger className="enterprise-input w-full">
                    <SelectValue placeholder="Link a PO Reference" />
                  </SelectTrigger>
                  <SelectContent>
                    {samplePOs.map(po => (<SelectItem key={po.id} value={po.id}>{po.id} – {po.vendorName}</SelectItem>))}
                  </SelectContent>
                </Select>
              </FormGroup>
              <FormGroup label="Weighbridge Entry">
                <Select value={formData.wbId} onValueChange={(val) => updateField("wbId", val)} disabled={!formData.poId}>
                  <SelectTrigger className="enterprise-input w-full">
                    <SelectValue placeholder={formData.poId ? "Link a Weight Slip" : "Select PO reference first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredWBs.map(wb => (<SelectItem key={wb.id} value={wb.id}>{wb.id} – {wb.vehicleNumber} ({wb.netWeight}T)</SelectItem>))}
                  </SelectContent>
                </Select>
              </FormGroup>
            </div>
          </div>

          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <PackageCheck className="w-5 h-5 mr-3 text-gray-600" />
                Material Verification (MT)
              </h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="GRN Reference">
                  <Input value={formData.grnNumber} readOnly className="enterprise-input w-full bg-gray-50 border-gray-200 font-mono text-gray-500" />
                </FormGroup>
                <FormGroup label="Material Name">
                  <Input value={formData.materialType || "Auto-detected"} readOnly className="enterprise-input w-full bg-gray-50 border-gray-200 text-gray-700 font-bold" />
                </FormGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WeightInput label="Received Qty" value={formData.receivedQty} onChange={(val) => updateField("receivedQty", val)} warning={isQtyMismatch} />
                <WeightInput label="Accepted Qty" value={formData.acceptedQty} onChange={(val) => updateField("acceptedQty", val)} color="text-green-700 bg-green-50 border-green-200" />
                <WeightInput label="Rejected / Surplus" value={formData.rejectedQty} readOnly color={hasRejections ? "text-red-600 bg-red-50 border-red-200" : "text-gray-400 bg-gray-50"} />
              </div>
            </div>
          </div>

          <div className={cn("enterprise-card transition-colors duration-500", formData.qualityStatus === "fail" ? "bg-red-50 border-red-200" : "")}>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <ShieldCheck className={cn("w-5 h-5 mr-3", formData.qualityStatus === "fail" ? "text-red-600" : "text-green-600")} />
                Quality Inspection Detail
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormGroup label="Quality Disposition">
                <Select value={formData.qualityStatus} onValueChange={(val) => updateField("qualityStatus", val)}>
                  <SelectTrigger className="enterprise-input w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pass">Pass</SelectItem>
                    <SelectItem value="fail">Fail</SelectItem>
                    <SelectItem value="conditional">Conditional Pass</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
              <div className="md:col-span-2">
                <FormGroup label="Inspection Remarks">
                  <Textarea 
                    value={formData.remarks} 
                    onChange={(e) => updateField("remarks", e.target.value)} 
                    placeholder="Enter detailed observations about material quality..." 
                    className="enterprise-input w-full min-h-[100px] resize-none py-3 leading-relaxed" 
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="enterprise-card bg-[#002147] text-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#002147] bg-white/20 inline-block px-2 py-1 rounded mb-6">Validation Summary</h3>
            <div className="space-y-6">
              <SummaryRow label="PO Allocated Qty" value={formData.expectedQty} unit="MT" />
              <Separator className="bg-white/10" />
              <SummaryRow label="Weighbridge Net" value={selectedWB?.netWeight || 0} unit="MT" color="text-blue-300" />
              <Separator className="bg-white/10" />
              <SummaryRow label="GRN Record Qty" value={formData.receivedQty} unit="MT" color={isQtyMismatch ? "text-yellow-400" : "text-green-400"} />
            </div>
          </div>

          <div className="enterprise-card bg-blue-50 border-blue-200 flex gap-4">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Traceability Note</p>
              <p className="text-xs text-blue-800 leading-relaxed">This GRN record will automatically propagate to Finance for automated 3-way matching and invoice generation.</p>
            </div>
          </div>
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

function Step({ num, label, active }: { num: number, label: string, active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all duration-300", active ? "bg-[#002147] text-white" : "bg-gray-100 text-gray-500")}>{num}</div>
      <span className={cn("text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hidden sm:inline-block", active ? "text-gray-900" : "text-gray-400")}>{label}</span>
    </div>
  );
}

function WeightInput({ label, value, onChange, readOnly, warning, color }: { label: string, value: number, onChange?: (val: number) => void, readOnly?: boolean, warning?: boolean, color?: string }) {
  return (
    <FormGroup label={label}>
      <div className="relative group">
        <Input 
          type="number" 
          value={value || ""} 
          readOnly={readOnly} 
          onChange={(e) => onChange && onChange(parseFloat(e.target.value) || 0)} 
          className={cn("enterprise-input w-full pr-10 font-bold text-base", color)} 
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">MT</span>
        {warning && (
          <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-red-600">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Weight mismatch detected</span>
          </div>
        )}
      </div>
    </FormGroup>
  );
}

function SummaryRow({ label, value, unit, color }: { label: string, value: number, unit: string, color?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{label}</p>
      <div className="flex items-baseline gap-3">
        <span className={cn("text-3xl font-black tracking-tight", color)}>{value.toFixed(2)}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{unit}</span>
      </div>
    </div>
  );
}
