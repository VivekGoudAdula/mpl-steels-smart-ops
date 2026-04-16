
import React, { useState, useRef } from "react";
import { 
  FileUp, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Loader2, 
  History,
  Info,
  Edit3,
  Check,
  X,
  Zap,
  Clock,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function ProcessAutomation() {
  const [step, setStep] = useState<WorkflowStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  const [formData, setFormData] = useState<ExtractedData>({
    vendorName: "",
    material: "",
    quantity: "",
    rate: "",
    total: "",
    paymentTerms: ""
  });
  const [status, setStatus] = useState<"none" | "approved" | "rejected">("none");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast.success("Document uploaded successfully");
    }
  };

  const startExtraction = () => {
    setStep("extracting");
    setTimeout(() => {
      setFormData({
        vendorName: "Tata Steel Limited",
        material: "Hot Rolled Steel Coils",
        quantity: "50 Tons",
        rate: "₹48,500 / Ton",
        total: "₹24,25,000",
        paymentTerms: "Net 45 Days"
      });
      setStep("review");
      toast.info("AI extraction complete. Please review the data.");
    }, 2500);
  };

  const handleApprove = () => {
    setStatus("approved");
    setStep("finalized");
    toast.success("PO created successfully after validation");
  };

  const handleReject = () => {
    setStatus("rejected");
    setStep("finalized");
    toast.error("Submission rejected for correction");
  };

  const resetWorkflow = () => {
    setStep("upload");
    setFile(null);
    setStatus("none");
    setFormData({
      vendorName: "",
      material: "",
      quantity: "",
      rate: "",
      total: "",
      paymentTerms: ""
    });
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-300"></span>
            Workflow Intelligence
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Process RPA Automation</h1>
          <p className="text-sm text-gray-500 mt-1">Extract, validate, and process operational documents with human-in-the-loop control.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-gray-200">
            <Switch id="auto-submit" checked={isAutoSubmit} onCheckedChange={setIsAutoSubmit} className="data-[state=checked]:bg-[#002147]" />
            <Label htmlFor="auto-submit" className="text-xs font-bold text-gray-600 uppercase cursor-pointer">Auto-Submit</Label>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="enterprise-card py-4 bg-gray-50">
        <div className="flex justify-between items-center max-w-3xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 rounded-full"></div>
          {[
            { id: "upload", label: "Ingestion", icon: FileUp },
            { id: "extracting", label: "Extraction", icon: Cpu },
            { id: "review", label: "Validation", icon: Eye },
            { id: "finalized", label: "Execution", icon: ShieldCheck }
          ].map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = 
              (step === "extracting" && i < 1) || 
              (step === "review" && i < 2) || 
              (step === "finalized" && i < 4);
            
            return (
              <div key={s.id} className="relative flex flex-col items-center gap-3 bg-gray-50 px-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all z-10",
                  isActive ? "bg-[#002147] text-white shadow-md ring-4 ring-[#002147]/10" : 
                  isCompleted ? "bg-green-100 text-green-700" : 
                  "bg-white border border-gray-200 text-gray-400"
                )}>
                  <s.icon size={18} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider bg-gray-50 px-2",
                  isActive ? "text-[#002147]" : isCompleted ? "text-green-700" : "text-gray-400"
                )}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto mt-8"
          >
            <div className="enterprise-card p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
                <p className="text-sm text-gray-500 mt-1">Upload a Quotation, Invoice, or PO securely.</p>
              </div>

              <div className="relative group mb-6">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={handleFileUpload}
                />
                <div className={cn(
                  "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-colors",
                  file ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50 group-hover:border-blue-300 group-hover:bg-blue-50/50"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center",
                    file ? "bg-green-100 text-green-600" : "bg-white text-gray-400 shadow-sm"
                  )}>
                    {file ? <CheckCircle2 size={32} /> : <FileUp size={32} />}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {file ? file.name : "Drag & drop or Click to browse"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PDF, PNG, JPG (Max 10MB)"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                className="enterprise-button bg-[#002147] text-white hover:bg-[#002147]/90 w-full gap-2 disabled:opacity-50 disabled:pointer-events-none"
                disabled={!file}
                onClick={startExtraction}
              >
                <Zap size={18} />
                EXECUTE PROCESS
              </button>
            </div>
          </motion.div>
        )}

        {step === "extracting" && (
          <motion.div 
            key="extracting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="w-16 h-16 rounded-xl bg-white shadow-sm border border-gray-200 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900">AI Extraction in Progress</h3>
              <p className="text-sm text-gray-500">Parsing document layout and mapping data to schema...</p>
            </div>
          </motion.div>
        )}

        {(step === "review" || step === "finalized") && (
          <motion.div 
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-6 mt-6"
          >
            {/* Left: Document Viewer */}
            <div className="enterprise-card h-[700px] flex flex-col p-0 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Source Document</h3>
                    <p className="text-[10px] text-gray-500">{file?.name}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white text-[10px] font-bold text-gray-600">Original Scan</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100/50">
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl w-full min-h-[800px] p-8 space-y-8 relative">
                   {/* Minimal Document Mockup */}
                   <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="w-24 h-6 bg-gray-800 rounded"></div>
                      <div className="space-y-1">
                        <div className="w-40 h-2 bg-gray-200 rounded"></div>
                        <div className="w-32 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="w-20 h-3 bg-gray-800 rounded ml-auto"></div>
                      <div className="w-28 h-2 bg-gray-200 rounded ml-auto"></div>
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 w-full my-6"></div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <div className="w-16 h-2 bg-gray-300 rounded"></div>
                       <div className="w-full h-8 bg-gray-100 rounded border border-gray-200"></div>
                    </div>
                    <div className="space-y-2">
                       <div className="w-16 h-2 bg-gray-300 rounded"></div>
                       <div className="w-full h-8 bg-gray-100 rounded border border-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Validation Form */}
            <div className="space-y-6">
              <div className="enterprise-card p-0 overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Extracted Schema Check</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Please review the AI populated fields.</p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 flex items-center gap-1 text-[10px] font-bold uppercase">
                    <Zap size={10} /> Needs Validation
                  </Badge>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-600">Vendor Entity</Label>
                      <Input 
                        value={formData.vendorName} 
                        onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                        className="enterprise-input w-full bg-blue-50/30 border-blue-100"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-600">Material Category</Label>
                      <Input 
                        value={formData.material} 
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="enterprise-input w-full bg-blue-50/30 border-blue-100"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-600">Net Quantity</Label>
                      <Input 
                        value={formData.quantity} 
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        className="enterprise-input w-full bg-blue-50/30 border-blue-100"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-600">Unit Rate</Label>
                      <Input 
                        value={formData.rate} 
                        onChange={(e) => setFormData({...formData, rate: e.target.value})}
                        className="enterprise-input w-full bg-blue-50/30 border-blue-100"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-600">Gross Valuation</Label>
                      <Input 
                        value={formData.total} 
                        onChange={(e) => setFormData({...formData, total: e.target.value})}
                        className="enterprise-input w-full bg-blue-50/30 border-blue-100 font-semibold"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-600">Payment Terms</Label>
                      <Input 
                        value={formData.paymentTerms} 
                        onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                        className="enterprise-input w-full bg-blue-50/30 border-blue-100"
                        disabled={step === "finalized"}
                      />
                    </div>
                  </div>

                  {step === "review" && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={handleApprove}
                        className="enterprise-button flex-1 bg-green-600 text-white hover:bg-green-700 gap-2"
                      >
                        <Check size={16} />
                        Approve & Commit
                      </button>
                      <button 
                        onClick={handleReject}
                        className="enterprise-button flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 gap-2"
                      >
                        <X size={16} />
                        Flag Issue
                      </button>
                    </div>
                  )}

                  {step === "finalized" && (
                    <div className={cn(
                      "mt-6 p-4 rounded-xl border flex items-start gap-4",
                      status === "approved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    )}>
                      <div className={cn(
                        "p-2 rounded-lg mt-0.5",
                        status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {status === "approved" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                      </div>
                      <div>
                        <h4 className={cn("text-sm font-bold", status === "approved" ? "text-green-900" : "text-red-900")}>
                          {status === "approved" ? "Data Committed to ERP" : "Validation Rejected"}
                        </h4>
                        <p className={cn("text-xs mt-1", status === "approved" ? "text-green-700" : "text-red-700")}>
                          {status === "approved" 
                            ? "A new Purchase Order sequence was successfully generated." 
                            : "This document extraction was manually overridden and flagged for review."}
                        </p>
                        <Button 
                          variant="link" 
                          onClick={resetWorkflow}
                          className={cn("p-0 h-auto mt-2 text-xs font-bold", status === "approved" ? "text-green-800" : "text-red-800")}
                        >
                          Process Another File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimal Audit Log */}
              <div className="enterprise-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History size={14} className="text-gray-400" />
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Audit Trail</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Document Ingested</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Automated System via API</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Entity Resolved</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">High confidence match for layout analysis</p>
                    </div>
                  </div>
                  {status !== "none" && (
                    <div className="flex items-start gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", status === "approved" ? "bg-green-500" : "bg-red-500")}></div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          Human Review: {status === "approved" ? "Approved" : "Rejected"}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">User Action Recorded</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
