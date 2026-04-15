
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
          <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl bg-white border-slate-200 font-bold active:scale-95 transition-all">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all">
            <Save className="w-4 h-4 mr-2" />
            Verify GRN
          </Button>
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
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <Link2 className="w-5 h-5 mr-3 text-blue-600" />
                Upstream Document Linking
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-8">
              <FormGroup label="Purchase Order">
                <Select value={formData.poId} onValueChange={(val) => updateField("poId", val)}>
                  <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-medium">
                    <SelectValue placeholder="Link a PO Reference" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    {samplePOs.map(po => (<SelectItem key={po.id} value={po.id} className="rounded-lg py-2.5">{po.id} – {po.vendorName}</SelectItem>))}
                  </SelectContent>
                </Select>
              </FormGroup>
              <FormGroup label="Weighbridge Entry">
                <Select value={formData.wbId} onValueChange={(val) => updateField("wbId", val)} disabled={!formData.poId}>
                  <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-medium">
                    <SelectValue placeholder={formData.poId ? "Link a Weight Slip" : "Select PO reference first"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    {filteredWBs.map(wb => (<SelectItem key={wb.id} value={wb.id} className="rounded-lg py-2.5">{wb.id} – {wb.vehicleNumber} ({wb.netWeight}T)</SelectItem>))}
                  </SelectContent>
                </Select>
              </FormGroup>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <PackageCheck className="w-5 h-5 mr-3 text-slate-600" />
                Material Verification (MT)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="GRN Reference">
                  <Input value={formData.grnNumber} readOnly className="h-12 border-none rounded-xl bg-slate-200/50 font-mono font-bold text-slate-600" />
                </FormGroup>
                <FormGroup label="Material Name">
                  <Input value={formData.materialType || "Auto-detected"} readOnly className="h-12 border-none rounded-xl bg-slate-200/50 font-bold text-slate-600" />
                </FormGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <WeightInput label="Received Quantity" value={formData.receivedQty} onChange={(val) => updateField("receivedQty", val)} warning={isQtyMismatch} />
                <WeightInput label="Accepted Quantity" value={formData.acceptedQty} onChange={(val) => updateField("acceptedQty", val)} color="text-emerald-600 border-emerald-100" />
                <WeightInput label="Rejected / Surplus" value={formData.rejectedQty} readOnly color={hasRejections ? "text-red-500 border-red-100" : "text-slate-400"} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn("border-none shadow-none rounded-2xl transition-colors duration-500", formData.qualityStatus === "fail" ? "bg-red-50/50 border border-red-100" : "bg-slate-50/50")}>
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <ShieldCheck className={cn("w-5 h-5 mr-3", formData.qualityStatus === "fail" ? "text-red-600" : "text-emerald-600")} />
                Quality Inspection Detail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormGroup label="Quality Disposition">
                  <Select value={formData.qualityStatus} onValueChange={(val) => updateField("qualityStatus", val)}>
                    <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-4 focus:ring-blue-50 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="pass" className="rounded-lg py-2.5">Pass</SelectItem>
                      <SelectItem value="fail" className="rounded-lg py-2.5">Fail</SelectItem>
                      <SelectItem value="conditional" className="rounded-lg py-2.5">Conditional Pass</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>
                <div className="md:col-span-2">
                  <FormGroup label="Inspection Remarks">
                    <Textarea 
                      value={formData.remarks} 
                      onChange={(e) => updateField("remarks", e.target.value)} 
                      placeholder="Enter detailed observations about material quality..." 
                      className="bg-white border-slate-200 rounded-xl min-h-[100px] focus:ring-4 focus:ring-blue-50 transition-all font-medium py-3" 
                    />
                  </FormGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden rounded-2xl">
            <CardHeader className="pb-2 pt-6 px-6 border-b border-slate-800">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Validation Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <SummaryRow label="PO Allocated Qty" value={formData.expectedQty} unit="MT" />
              <Separator className="bg-white/10" />
              <SummaryRow label="Weighbridge Net" value={selectedWB?.netWeight || 0} unit="MT" color="text-blue-400" />
              <Separator className="bg-white/10" />
              <SummaryRow label="GRN Record Qty" value={formData.receivedQty} unit="MT" color={isQtyMismatch ? "text-amber-400" : "text-emerald-400"} />
            </CardContent>
          </Card>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 animate-in slide-in-from-right-4 duration-500">
            <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Traceability Note</p>
              <p className="text-[11px] text-blue-800 leading-relaxed font-medium">This GRN record will automatically propagate to Finance for automated 3-way matching and invoice generation.</p>
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

function Step({ num, label, active }: { num: number, label: string, active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500", active ? "bg-slate-900 text-white shadow-lg" : "bg-slate-200 text-slate-500 shadow-inner")}>{num}</div>
      <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500", active ? "text-slate-900" : "text-slate-400")}>{label}</span>
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
          className={cn("h-12 border-slate-200 rounded-xl pr-12 font-black text-base shadow-sm group-focus-within:ring-4 group-focus-within:ring-blue-50 transition-all", readOnly ? "bg-slate-200/50" : "bg-white", color)} 
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest group-focus-within:text-blue-500">MT</span>
        {warning && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1.5 text-amber-600 animate-in slide-in-from-top-1 duration-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Weight mismatch detected</span>
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
