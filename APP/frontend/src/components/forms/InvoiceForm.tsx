
import React, { useState, useEffect } from "react";
import { 
  Save, 
  X, 
  Link2, 
  Receipt, 
  CreditCard, 
  FileText, 
  Upload, 
  Trash2, 
  Eye,
  IndianRupee,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { samplePOs, sampleGRNEntries } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function InvoiceForm({ isModal, onClose }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    poId: "",
    grnId: "",
    baseAmount: 0,
    taxPercent: 18,
    taxAmount: 0,
    totalAmount: 0,
    paymentStatus: "pending",
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    vendorName: "",
    materialType: "",
    acceptedQty: 0,
  });

  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [selectedGRN, setSelectedGRN] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const filteredGRNs = sampleGRNEntries.filter(grn => grn.poId === formData.poId);

  useEffect(() => {
    if (formData.poId) {
      const po = samplePOs.find(p => p.id === formData.poId);
      if (po) {
        setSelectedPO(po);
        setFormData(prev => ({ ...prev, vendorName: po.vendorName, grnId: "" }));
      }
    } else {
      setSelectedPO(null);
      setFormData(prev => ({ ...prev, vendorName: "", grnId: "" }));
    }
  }, [formData.poId]);

  useEffect(() => {
    if (formData.grnId) {
      const grn = sampleGRNEntries.find(g => g.id === formData.grnId);
      if (grn) {
        setSelectedGRN(grn);
        setFormData(prev => ({ ...prev, materialType: grn.materialType, acceptedQty: grn.acceptedQty }));
      }
    } else {
      setSelectedGRN(null);
      setFormData(prev => ({ ...prev, materialType: "", acceptedQty: 0 }));
    }
  }, [formData.grnId]);

  useEffect(() => {
    const tax = (formData.baseAmount * formData.taxPercent) / 100;
    const total = formData.baseAmount + tax;
    setFormData(prev => ({ ...prev, taxAmount: tax, totalAmount: total }));
  }, [formData.baseAmount, formData.taxPercent]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.poId || !formData.grnId || !formData.invoiceNumber || formData.baseAmount <= 0) {
      toast.error("Please fill in all required fields (PO, GRN, Invoice #, and Base Amount)");
      return;
    }
    toast.success("Invoice saved and posted successfully!");
    if (onClose) onClose();
  };

  return (
    <div className={cn("bg-white", isModal ? "p-8" : "max-w-6xl mx-auto px-4 py-8")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Invoice Processing</h1>
          <p className="text-slate-500 mt-1">Generate and link supplier invoices to procurement and receipt data</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl bg-white border-slate-200 font-bold active:scale-95 transition-all">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all">
            <Save className="w-4 h-4 mr-2" />
            Post Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-10">
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <Link2 className="w-5 h-5 mr-3 text-blue-600" />
                Transaction Matching (3-Way)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-8">
              <FormGroup label="Purchase Order">
                <Select value={formData.poId} onValueChange={(val) => updateField("poId", val)}>
                  <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all font-medium">
                    <SelectValue placeholder="Select PO Reference" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    {samplePOs.map(po => (<SelectItem key={po.id} value={po.id} className="rounded-lg py-2.5">
                      {po.id} – {po.vendorName}
                    </SelectItem>))}
                  </SelectContent>
                </Select>
              </FormGroup>
              <FormGroup label="Goods Receipt (GRN)">
                <Select value={formData.grnId} onValueChange={(val) => updateField("grnId", val)} disabled={!formData.poId}>
                  <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all font-medium">
                    <SelectValue placeholder={formData.poId ? "Link Verified GRN" : "Select PO first"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-2xl">
                    {filteredGRNs.map(grn => (<SelectItem key={grn.id} value={grn.id} className="rounded-lg py-2.5">
                      {grn.id} – {grn.materialType}
                    </SelectItem>))}
                  </SelectContent>
                </Select>
              </FormGroup>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <Receipt className="w-5 h-5 mr-3 text-slate-600" />
                Supplier Billing Info
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-8">
              <FormGroup label="Invoice Number">
                <Input 
                  value={formData.invoiceNumber} 
                  onChange={(e) => updateField("invoiceNumber", e.target.value)} 
                  placeholder="e.g. INV/2024/001" 
                  className="h-12 border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-bold" 
                />
              </FormGroup>
              <FormGroup label="Invoice Date">
                <Input 
                  type="date" 
                  value={formData.invoiceDate} 
                  onChange={(e) => updateField("invoiceDate", e.target.value)} 
                  className="h-12 border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium pr-4" 
                />
              </FormGroup>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                <IndianRupee className="w-5 h-5 mr-3 text-emerald-600" />
                Payable Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormGroup label="Base Net Amount">
                  <div className="relative group">
                    <Input 
                      type="number" 
                      value={formData.baseAmount || ""} 
                      onChange={(e) => updateField("baseAmount", parseFloat(e.target.value) || 0)} 
                      className="h-12 border-slate-200 rounded-xl bg-white font-black text-lg focus:ring-4 focus:ring-blue-50 transition-all pr-12" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">₹</span>
                  </div>
                </FormGroup>
                <FormGroup label="GST Percent">
                  <Select value={formData.taxPercent.toString()} onValueChange={(val) => updateField("taxPercent", parseInt(val))}>
                    <SelectTrigger className="h-12 border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-2xl">
                      <SelectItem value="5" className="rounded-lg py-2.5 px-3">5% GST</SelectItem>
                      <SelectItem value="12" className="rounded-lg py-2.5 px-3">12% GST</SelectItem>
                      <SelectItem value="18" className="rounded-lg py-2.5 px-3">18% GST</SelectItem>
                      <SelectItem value="28" className="rounded-lg py-2.5 px-3">28% GST</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>
                <FormGroup label="GST Amount">
                  <div className="relative group">
                    <Input 
                      value={formData.taxAmount.toLocaleString()} 
                      readOnly 
                      className="h-12 border-none rounded-xl bg-slate-200/50 font-black text-lg text-slate-600 pr-12" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">₹</span>
                  </div>
                </FormGroup>
              </div>

              <div className="bg-slate-900 rounded-3xl p-10 text-white flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Grand Total Payable</p>
                  <p className="text-5xl font-black tracking-tighter">₹ {formData.totalAmount.toLocaleString()}</p>
                </div>
                <div className="h-16 w-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 shadow-inner z-10">
                  <IndianRupee size={32} className="text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-slate-200/50">
            <CardHeader className="pb-4 pt-6 px-6 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Audit & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <AuditRow label="Linked PO Value" value={selectedPO?.totalAmount || 0} isCurrency />
              <Separator className="bg-slate-100" />
              <AuditRow label="Accepted Receipt MT" value={formData.acceptedQty} unit="TONS" />
              <Separator className="bg-slate-100" />
              <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] pt-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </div>
                Voucher Approved
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Digital Copy
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              {!file ? (
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-white hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('inv-up')?.click()}
                >
                  <div className="bg-slate-50 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">PDF Attachment</p>
                  <input type="file" id="inv-up" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
              ) : (
                <div className="flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all group">
                  <div className="bg-slate-900 p-2.5 rounded-xl mr-3 shadow-lg shadow-slate-200">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase">{(file.size / 1024).toFixed(1)} KB • PDF</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
                    <Trash2 className="w-4 h-4" />
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

function AuditRow({ label, value, unit, isCurrency }: { label: string, value: number, unit?: string, isCurrency?: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-60">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-900 tracking-tight">
          {isCurrency ? '₹ ' : ''}{value.toLocaleString()}
        </span>
        {unit && <span className="text-[10px] font-black opacity-30 mt-1">{unit}</span>}
      </div>
    </div>
  );
}
