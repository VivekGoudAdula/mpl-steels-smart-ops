
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
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { samplePOs, sampleWBEntries } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function GRNModule() {
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

  // Filter WB entries based on PO
  const filteredWBs = sampleWBEntries.filter(wb => wb.poId === formData.poId);

  // Handle PO selection
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
          wbId: "" // Reset WB when PO changes
        }));
      }
    } else {
      setSelectedPO(null);
      setFormData(prev => ({
        ...prev,
        vendorName: "",
        materialType: "",
        expectedQty: 0,
        wbId: ""
      }));
    }
  }, [formData.poId]);

  // Handle WB selection
  useEffect(() => {
    if (formData.wbId) {
      const wb = sampleWBEntries.find(w => w.id === formData.wbId);
      if (wb) {
        setSelectedWB(wb);
        setFormData(prev => ({
          ...prev,
          receivedQty: wb.netWeight,
          acceptedQty: wb.netWeight, // Default accepted to received
          rejectedQty: 0
        }));
      }
    } else {
      setSelectedWB(null);
    }
  }, [formData.wbId]);

  // Auto-calculate rejected quantity
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

    const grnEntry = {
      ...formData,
      file: file?.name || null
    };

    console.log("Saving Goods Receipt Note:", grnEntry);
    toast.success("GRN created and verified successfully!");
  };

  const handleCancel = () => {
    if (confirm("Reset GRN form?")) {
      setFormData({
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
      setFile(null);
    }
  };

  const isQtyMismatch = selectedWB && formData.receivedQty > selectedWB.netWeight;
  const hasRejections = formData.rejectedQty > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Goods Receipt Note (GRN)</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Draft</Badge>
          </div>
          <p className="text-slate-500 mt-1">Record and validate received materials against PO and Weighbridge data</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} className="bg-white">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Save className="w-4 h-4 mr-2" />
            Save GRN
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", formData.poId ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500")}>1</div>
            <span className={cn("text-sm font-medium", formData.poId ? "text-blue-600" : "text-slate-500")}>Purchase Order</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", formData.wbId ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500")}>2</div>
            <span className={cn("text-sm font-medium", formData.wbId ? "text-blue-600" : "text-slate-500")}>Weighbridge</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", formData.receivedQty > 0 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500")}>3</div>
            <span className={cn("text-sm font-medium", formData.receivedQty > 0 ? "text-blue-600" : "text-slate-500")}>GRN Verification</span>
          </div>
        </div>
        <Progress value={formData.poId ? (formData.wbId ? (formData.receivedQty > 0 ? 100 : 66) : 33) : 0} className="h-2" />
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
                <Label>Select Weighbridge Entry</Label>
                <Select 
                  value={formData.wbId} 
                  onValueChange={(val) => updateField("wbId", val)}
                  disabled={!formData.poId}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={formData.poId ? "Link a WB Entry" : "Select PO first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredWBs.map(wb => (
                      <SelectItem key={wb.id} value={wb.id}>{wb.id} – {wb.vehicleNumber} ({wb.netWeight}T)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Material Receipt */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <PackageCheck className="w-5 h-5 mr-2 text-slate-600" />
                Material Receipt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>GRN Number</Label>
                  <Input value={formData.grnNumber} readOnly className="bg-slate-100 font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input value={formData.materialType} readOnly placeholder="Auto-filled" className="bg-slate-100" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Received Quantity (Tons)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={formData.receivedQty} 
                      onChange={(e) => updateField("receivedQty", parseFloat(e.target.value) || 0)}
                      className={cn("bg-white pr-10 font-bold", isQtyMismatch && "border-yellow-500 bg-yellow-50")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">T</span>
                  </div>
                  {isQtyMismatch && (
                    <p className="text-[10px] text-yellow-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> Received qty exceeds WB net weight ({selectedWB.netWeight}T)
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Accepted Quantity (Tons)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={formData.acceptedQty} 
                      onChange={(e) => updateField("acceptedQty", parseFloat(e.target.value) || 0)}
                      className="bg-white pr-10 font-bold text-emerald-600"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">T</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rejected Quantity (Tons)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={formData.rejectedQty} 
                      readOnly
                      className={cn("bg-slate-100 pr-10 font-bold", hasRejections ? "text-red-600" : "text-slate-400")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">T</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Check */}
          <Card className={cn("border-none shadow-sm transition-colors duration-300", formData.qualityStatus === "fail" ? "bg-red-50/50" : "bg-slate-50/50")}>
            <CardHeader className="pb-3 border-b border-slate-100 mb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <ShieldCheck className={cn("w-5 h-5 mr-2", formData.qualityStatus === "fail" ? "text-red-600" : "text-emerald-600")} />
                Quality Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Quality Status</Label>
                  <Select value={formData.qualityStatus} onValueChange={(val) => updateField("qualityStatus", val)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pass">Pass</SelectItem>
                      <SelectItem value="fail">Fail</SelectItem>
                      <SelectItem value="conditional">Conditional Pass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Inspection Remarks</Label>
                  <Textarea 
                    value={formData.remarks} 
                    onChange={(e) => updateField("remarks", e.target.value)}
                    placeholder="Enter observations or reasons for rejection..."
                    className="bg-white min-h-[80px]"
                  />
                </div>
              </div>

              {formData.qualityStatus === "fail" && (
                <div className="p-4 bg-red-100 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 animate-pulse">
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-bold">Quality Rejection Alert</p>
                    <p className="text-sm">Material has failed quality standards. Please ensure rejection quantity is correctly recorded and vendor is notified.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="border-none shadow-lg bg-slate-900 text-white overflow-hidden">
            <CardHeader className="pb-2 bg-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-70">Validation Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase opacity-50 font-bold">PO Expected</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{formData.expectedQty}</span>
                  <span className="text-xs opacity-70">TONS</span>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div className="space-y-1">
                <p className="text-[10px] uppercase opacity-50 font-bold">WB Net Weight</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-400">{selectedWB ? selectedWB.netWeight : "0.0"}</span>
                  <span className="text-xs opacity-70">TONS</span>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div className="space-y-1">
                <p className="text-[10px] uppercase opacity-50 font-bold">GRN Received</p>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-3xl font-black", isQtyMismatch ? "text-yellow-400" : "text-emerald-400")}>
                    {formData.receivedQty.toFixed(1)}
                  </span>
                  <span className="text-xs opacity-70 font-bold">TONS</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                  <span>Acceptance Rate</span>
                  <span>{formData.receivedQty > 0 ? Math.round((formData.acceptedQty / formData.receivedQty) * 100) : 0}%</span>
                </div>
                <Progress value={formData.receivedQty > 0 ? (formData.acceptedQty / formData.receivedQty) * 100 : 0} className="h-1 bg-white/10" />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-800 flex items-center">
                <Upload className="w-4 h-4 mr-2 text-slate-500" />
                GRN Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:border-blue-400 transition-all cursor-pointer"
                  onClick={() => document.getElementById("grn-upload")?.click()}
                >
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-[10px] text-slate-500 text-center font-medium">Upload signed GRN</p>
                  <input
                    type="file"
                    id="grn-upload"
                    className="hidden"
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      className="h-6 w-6 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
              fileName: file?.name || "GRN.pdf",
              documentType: "GRN",
              transactionId: formData.grnNumber || "NEW",
              poNumber: formData.poId,
              date: new Date().toISOString().split('T')[0]
            }}
          />

          {/* Info Card */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900">Traceability Note</p>
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  This GRN will be linked to PO: {formData.poId || "---"} and WB: {formData.wbId || "---"}. 
                  Ensure all weight discrepancies are noted in remarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
