
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
  CheckCircle2,
  Loader2
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
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function InvoiceForm({ isModal, onClose, onSuccess }: InvoiceFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTxns, setIsLoadingTxns] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    transactionId: "",
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

  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        // Transactions with GRN but no Invoice
        setTransactions(res.data.filter((t: any) => t.grn && !t.invoice));
      } catch (error) {
        toast.error("Failed to load transactions");
      } finally {
        setIsLoadingTxns(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (formData.transactionId) {
      const txn = transactions.find(t => t._id === formData.transactionId);
      if (txn) {
        setSelectedTxn(txn);
        setFormData(prev => ({
          ...prev,
          vendorName: "Linked View: " + txn.txn_id,
          materialType: txn.po.material,
          acceptedQty: txn.grn.accepted_qty,
          baseAmount: txn.grn.accepted_qty * txn.po.rate // Autofill estimated amount
        }));
      }
    } else {
      setSelectedTxn(null);
    }
  }, [formData.transactionId, transactions]);

  useEffect(() => {
    const tax = (formData.baseAmount * formData.taxPercent) / 100;
    const total = formData.baseAmount + tax;
    setFormData(prev => ({ ...prev, taxAmount: tax, totalAmount: total }));
  }, [formData.baseAmount, formData.taxPercent]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.transactionId || !formData.invoiceNumber || formData.baseAmount <= 0) {
      toast.error("Please fill in all required fields (Transaction, Invoice #, and Base Amount)");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        invoice_number: formData.invoiceNumber,
        amount: formData.baseAmount,
        tax: formData.taxAmount,
        total: formData.totalAmount,
        status: formData.paymentStatus,
      };

      await api.post(`/transactions/${formData.transactionId}/invoice`, payload);
      toast.success("Invoice saved and posted successfully!");
      if (onSuccess) onSuccess();
      else if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to post invoice");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("bg-white", isModal ? "p-8" : "max-w-6xl mx-auto px-4 py-8")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Invoice Processing</h1>
          <p className="text-slate-500 mt-1">Generate and link supplier invoices to procurement and receipt data</p>
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
            disabled={isSaving}
            className="enterprise-button-primary h-12 px-8 flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white">Posting...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white">Post Invoice</span>
              </>
            )}
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-10">
        <div className="lg:col-span-3 space-y-6">
          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Link2 className="w-5 h-5 mr-3 text-[#002147]" />
                Transaction Matching (3-Way)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Link Active Transaction">
                <Select value={formData.transactionId} onValueChange={(val) => updateField("transactionId", val)}>
                  <SelectTrigger className="enterprise-input w-full">
                    <SelectValue placeholder={isLoadingTxns ? "Scanning transactions..." : "Select Transaction Reference"} />
                  </SelectTrigger>
                  <SelectContent>
                    {transactions.map(t => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.txn_id} (PO: {t.po.po_number})
                      </SelectItem>
                    ))}
                    {transactions.length === 0 && !isLoadingTxns && (
                      <SelectItem value="none" disabled>No transactions awaiting invoice</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormGroup>
              <div className="flex flex-col justify-end">
                {selectedTxn && (
                   <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
                     <CheckCircle2 className="w-4 h-4 text-blue-600" />
                     <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">GRN linked: {selectedTxn.grn.grn_number} ({selectedTxn.grn.accepted_qty}T)</span>
                   </div>
                )}
              </div>
            </div>
          </div>

          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <Receipt className="w-5 h-5 mr-3 text-gray-600" />
                Supplier Billing Info
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Invoice Number">
                <Input
                  value={formData.invoiceNumber}
                  onChange={(e) => updateField("invoiceNumber", e.target.value)}
                  placeholder="e.g. INV/2024/001"
                  className="enterprise-input w-full"
                />
              </FormGroup>
              <FormGroup label="Invoice Date">
                <Input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => updateField("invoiceDate", e.target.value)}
                  className="enterprise-input w-full"
                />
              </FormGroup>
            </div>
          </div>

          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <IndianRupee className="w-5 h-5 mr-3 text-[#002147]" />
                Payable Financials
              </h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormGroup label="Base Net Amount">
                  <div className="relative group">
                    <Input
                      type="number"
                      value={formData.baseAmount || ""}
                      onChange={(e) => updateField("baseAmount", parseFloat(e.target.value) || 0)}
                      className="enterprise-input w-full pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  </div>
                </FormGroup>
                <FormGroup label="GST Percent">
                  <Select value={formData.taxPercent.toString()} onValueChange={(val) => updateField("taxPercent", parseInt(val))}>
                    <SelectTrigger className="enterprise-input w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5% GST</SelectItem>
                      <SelectItem value="12">12% GST</SelectItem>
                      <SelectItem value="18">18% GST</SelectItem>
                      <SelectItem value="28">28% GST</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>
                <FormGroup label="GST Amount">
                  <div className="relative group">
                    <Input
                      value={formData.taxAmount.toLocaleString()}
                      readOnly
                      className="enterprise-input w-full bg-gray-50 text-gray-500 pr-8 border-gray-200"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  </div>
                </FormGroup>
              </div>

              <div className="bg-[#002147] rounded-xl p-6 text-white flex justify-between items-center relative overflow-hidden shadow-sm">
                <div className="z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#002147] bg-white/20 inline-block px-2 py-1 rounded mb-2">Grand Total Payable</p>
                  <p className="text-3xl font-bold tracking-tight">₹ {formData.totalAmount.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center z-10 border border-white/20">
                  <IndianRupee size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="enterprise-card bg-gray-50 border-gray-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">Audit & Compliance</h3>
            <div className="space-y-6">
              <AuditRow label="Linked PO Value" value={(selectedTxn?.po?.quantity * selectedTxn?.po?.rate) || 0} isCurrency />
              <Separator className="bg-gray-200" />
              <AuditRow label="Accepted Receipt MT" value={formData.acceptedQty} unit="TONS" />
              <Separator className="bg-gray-200" />
              <div className="flex items-center gap-2 text-green-700 font-bold text-[10px] uppercase tracking-wider bg-green-50 p-2 rounded-lg border border-green-100">
                <CheckCircle2 size={14} />
                Voucher Approved
              </div>
            </div>
          </div>

          <div className="enterprise-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Digital Copy
            </h3>
            <div>
              {!file ? (
                <div
                  className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:border-[#002147] hover:bg-gray-100 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('inv-up')?.click()}
                >
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#002147] mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Attach PDF</p>
                  <input type="file" id="inv-up" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
              ) : (
                <div className="flex items-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#002147] transition-all group">
                  <div className="bg-[#002147] p-2 rounded mr-3">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={() => setFile(null)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
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
