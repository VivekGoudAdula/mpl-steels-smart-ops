
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
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon,
  IndianRupee,
  ArrowUpRight,
  Eye
} from "lucide-react";
import DocumentViewer from "./DocumentViewer";
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

export default function InvoiceModule() {
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

  // Filter GRNs based on PO
  const filteredGRNs = sampleGRNEntries.filter(grn => grn.poId === formData.poId);

  // Handle PO selection
  useEffect(() => {
    if (formData.poId) {
      const po = samplePOs.find(p => p.id === formData.poId);
      if (po) {
        setSelectedPO(po);
        setFormData(prev => ({
          ...prev,
          vendorName: po.vendorName,
          grnId: "" // Reset GRN when PO changes
        }));
      }
    } else {
      setSelectedPO(null);
      setFormData(prev => ({ ...prev, vendorName: "", grnId: "" }));
    }
  }, [formData.poId]);

  // Handle GRN selection
  useEffect(() => {
    if (formData.grnId) {
      const grn = sampleGRNEntries.find(g => g.id === formData.grnId);
      if (grn) {
        setSelectedGRN(grn);
        setFormData(prev => ({
          ...prev,
          materialType: grn.materialType,
          acceptedQty: grn.acceptedQty,
        }));
      }
    } else {
      setSelectedGRN(null);
      setFormData(prev => ({ ...prev, materialType: "", acceptedQty: 0 }));
    }
  }, [formData.grnId]);

  // Auto-calculate tax and total
  useEffect(() => {
    const tax = (formData.baseAmount * formData.taxPercent) / 100;
    const total = formData.baseAmount + tax;
    setFormData(prev => ({
      ...prev,
      taxAmount: tax,
      totalAmount: total
    }));
  }, [formData.baseAmount, formData.taxPercent]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.poId || !formData.grnId || !formData.invoiceNumber || formData.baseAmount <= 0) {
      toast.error("Please fill in all required fields (PO, GRN, Invoice #, and Base Amount)");
      return;
    }

    console.log("Saving Invoice:", formData);
    toast.success("Invoice saved successfully!");
  };

  const handleCancel = () => {
    if (confirm("Reset invoice form?")) {
      setFormData({
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
      setFile(null);
    }
  };

  const isOverdue = formData.paymentStatus === "overdue";
  const isPaid = formData.paymentStatus === "paid";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Invoice Management</h1>
            <Badge variant={isPaid ? "default" : isOverdue ? "destructive" : "outline"} className={cn(
              isPaid && "bg-emerald-500 hover:bg-emerald-600",
              !isPaid && !isOverdue && "bg-blue-50 text-blue-700 border-blue-200"
            )}>
              {formData.paymentStatus.toUpperCase()}
            </Badge>
          </div>
          <p className="text-slate-500 mt-1">Track and manage supplier invoices for MPL Steels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} className="bg-white">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Save className="w-4 h-4 mr-2" />
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Transaction Linking */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Link2 className="w-5 h-5 mr-2 text-blue-600" />
                Transaction Linking
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Select Purchase Order</Label>
                <Select value={formData.poId} onValueChange={(val) => updateField("poId", val)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Link a PO" />
                  </SelectTrigger>
                  <SelectContent>
                    {samplePOs.map(po => (
                      <SelectItem key={po.id} value={po.id}>{po.id} – {po.vendorName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select GRN Entry</Label>
                <Select 
                  value={formData.grnId} 
                  onValueChange={(val) => updateField("grnId", val)}
                  disabled={!formData.poId}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={formData.poId ? "Link a GRN" : "Select PO first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredGRNs.map(grn => (
                      <SelectItem key={grn.id} value={grn.id}>{grn.id} – {grn.materialType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Billing Details */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-slate-600" />
                Billing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input 
                  id="invoiceNumber"
                  value={formData.invoiceNumber} 
                  onChange={(e) => updateField("invoiceNumber", e.target.value)}
                  placeholder="e.g. INV/2024/001"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <div className="relative">
                  <Input 
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate} 
                    onChange={(e) => updateField("invoiceDate", e.target.value)}
                    className="bg-white pl-10"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Details */}
          <Card className="border-none shadow-sm bg-slate-50/50 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <IndianRupee className="w-5 h-5 mr-2 text-emerald-600" />
                Amount Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="baseAmount">Base Amount (₹)</Label>
                  <Input 
                    id="baseAmount"
                    type="number" 
                    value={formData.baseAmount} 
                    onChange={(e) => updateField("baseAmount", parseFloat(e.target.value) || 0)}
                    className="bg-white text-lg font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxPercent">Tax (%)</Label>
                  <Select value={formData.taxPercent.toString()} onValueChange={(val) => updateField("taxPercent", parseInt(val))}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% (GST Exempt)</SelectItem>
                      <SelectItem value="5">5% (GST)</SelectItem>
                      <SelectItem value="12">12% (GST)</SelectItem>
                      <SelectItem value="18">18% (GST)</SelectItem>
                      <SelectItem value="28">28% (GST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tax Amount (₹)</Label>
                  <Input 
                    value={formData.taxAmount.toLocaleString()} 
                    readOnly 
                    className="bg-slate-100 font-medium text-slate-600"
                  />
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-50 font-bold mb-1">Total Payable Amount</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black tracking-tight">₹{formData.totalAmount.toLocaleString()}</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Net Total</Badge>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[10px] opacity-40 uppercase font-bold">Calculation</p>
                  <p className="text-sm font-medium opacity-80">{formData.baseAmount.toLocaleString()} + {formData.taxAmount.toLocaleString()} (Tax)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className={cn("border-none shadow-sm transition-colors duration-300", isOverdue ? "bg-red-50/50" : "bg-slate-50/50")}>
            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-slate-600" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <div className="flex gap-2">
                  <Select value={formData.paymentStatus} onValueChange={(val) => updateField("paymentStatus", val)}>
                    <SelectTrigger className="bg-white flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.paymentStatus !== "paid" && (
                    <Button 
                      variant="outline" 
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      onClick={() => updateField("paymentStatus", "paid")}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="relative">
                  <Input 
                    id="dueDate"
                    type="date"
                    value={formData.dueDate} 
                    onChange={(e) => updateField("dueDate", e.target.value)}
                    className="bg-white pl-10"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              {isOverdue && (
                <div className="md:col-span-2 p-4 bg-red-100 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 animate-pulse">
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-bold">Overdue Payment Warning</p>
                    <p className="text-sm">This invoice has passed its due date. Please prioritize payment to avoid supply chain disruptions.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="border-none shadow-lg bg-white overflow-hidden border border-slate-100">
            <CardHeader className="pb-2 bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Financial Validation</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-slate-400 font-bold">PO Value (Est.)</p>
                <p className="text-xl font-bold text-slate-900">₹{selectedGRN ? selectedGRN.poValue.toLocaleString() : "0"}</p>
              </div>
              <Separator className="bg-slate-100" />
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-slate-400 font-bold">GRN Accepted Qty</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-blue-600">{formData.acceptedQty}</span>
                  <span className="text-xs text-slate-500">TONS</span>
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-slate-400 font-bold">Invoice Total</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">₹{formData.totalAmount.toLocaleString()}</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-800 flex items-center">
                <Upload className="w-4 h-4 mr-2 text-slate-500" />
                Invoice Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:border-blue-400 transition-all cursor-pointer"
                  onClick={() => document.getElementById("inv-upload")?.click()}
                >
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-[10px] text-slate-500 text-center font-medium">Upload Invoice PDF</p>
                  <input
                    type="file"
                    id="inv-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              ) : (
                <div className="flex items-center p-2 bg-white border rounded-lg">
                  <div className="bg-blue-50 p-1.5 rounded mr-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-900 truncate">
                      {file.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsViewerOpen(true)}
                      className="h-6 w-6 text-slate-400 hover:text-blue-600"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <button
                      onClick={() => setFile(null)}
                      className="h-6 w-6 text-slate-400 hover:text-red-600 flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Viewer */}
          <DocumentViewer 
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            document={{
              fileName: file?.name || "Invoice.pdf",
              documentType: "Invoice",
              transactionId: formData.invoiceNumber || "NEW",
              poNumber: formData.poId,
              date: formData.invoiceDate
            }}
          />

          {/* Vendor Summary */}
          {formData.vendorName && (
            <div className="p-4 bg-slate-900 rounded-2xl text-white">
              <p className="text-[10px] uppercase opacity-50 font-bold mb-2">Supplier Details</p>
              <p className="font-bold text-lg leading-tight mb-1">{formData.vendorName}</p>
              <p className="text-xs opacity-70 mb-4">{formData.materialType}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded uppercase font-bold tracking-wider">Verified Vendor</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
