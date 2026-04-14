
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

type WorkflowStep = "upload" | "extracting" | "review" | "finalized";

interface ExtractedData {
  vendorName: string;
  material: string;
  quantity: string;
  rate: string;
  total: string;
  paymentTerms: string;
}

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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-slate-900 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Workflow Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Process RPA Automation</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl">Deploy autonomous agents to extract, validate, and process operational documents with human-in-the-loop approval control.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <Switch id="auto-submit" checked={isAutoSubmit} onCheckedChange={setIsAutoSubmit} className="data-[state=checked]:bg-slate-900" />
            <Label htmlFor="auto-submit" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Autonomous Submission</Label>
          </div>
        </div>
      </div>

      {/* Workflow Indicator */}
      <div className="max-w-4xl mx-auto relative py-4">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
        <div className="relative z-10 flex justify-between">
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
              <div key={s.id} className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4",
                  isActive ? "bg-slate-900 border-slate-100 text-white scale-110 shadow-2xl shadow-slate-200" : 
                  isCompleted ? "bg-emerald-500 border-emerald-50 text-white" : 
                  "bg-white border-slate-50 text-slate-200"
                )}>
                  <s.icon size={22} />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em]",
                  isActive ? "text-slate-900" : isCompleted ? "text-emerald-600" : "text-slate-300"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="text-center p-10 pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Document Ingestion</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-400">Upload a Quotation, Invoice, or PO to trigger the RPA engine.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleFileUpload}
                  />
                  <div className={cn(
                    "border-4 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center gap-6 transition-all duration-500",
                    file ? "border-emerald-100 bg-emerald-50/20" : "border-slate-50 bg-slate-50/30 group-hover:border-slate-200 group-hover:bg-slate-100/50"
                  )}>
                    <div className={cn(
                      "w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-xl",
                      file ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-white text-slate-300 group-hover:bg-slate-900 group-hover:text-white shadow-slate-100"
                    )}>
                      {file ? <CheckCircle2 size={48} /> : <FileUp size={48} />}
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-slate-900 tracking-tight">
                        {file ? file.name : "Select Source File"}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                        {file ? `${(file.size / 1024).toFixed(1)} KB • Verified` : "PDF, PNG, JPG • Max 10MB"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white text-lg font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-slate-200 disabled:opacity-20 transition-all hover:scale-[1.01]"
                  disabled={!file}
                  onClick={startExtraction}
                >
                  <Zap className="mr-3" size={24} />
                  Execute Extraction
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "extracting" && (
          <motion.div 
            key="extracting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">AI Extraction in Progress</h3>
              <p className="text-slate-500">Processing document layers and identifying key entities...</p>
            </div>
          </motion.div>
        )}

        {(step === "review" || step === "finalized") && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Left: Document Viewer */}
            <Card className="border border-slate-100 shadow-sm h-[700px] flex flex-col overflow-hidden rounded-3xl bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 shrink-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200">
                      <FileText size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Source Artifact</CardTitle>
                      <CardDescription className="text-[10px] font-bold text-slate-400">{file?.name}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-slate-200">Original Scan</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-8 bg-slate-100/30">
                <div className="bg-white shadow-2xl rounded-2xl w-full min-h-[800px] p-12 space-y-12 relative border border-slate-100">
                  {/* Mock Document Content */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="w-32 h-10 bg-slate-900 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="w-48 h-2 bg-slate-100 rounded-full"></div>
                        <div className="w-40 h-2 bg-slate-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="w-24 h-4 bg-slate-900 rounded-full ml-auto"></div>
                      <div className="w-32 h-2 bg-slate-100 rounded-full ml-auto"></div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="h-px bg-slate-100 w-full"></div>
                    <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-full h-6 bg-slate-50 rounded-lg border border-slate-100"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-full h-6 bg-slate-50 rounded-lg border border-slate-100"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="w-full h-48 bg-slate-50/50 rounded-3xl border border-slate-100 p-6 space-y-6">
                      <div className="flex justify-between">
                        <div className="w-48 h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full"></div>
                      </div>
                      <div className="h-px bg-slate-100"></div>
                      <div className="flex justify-between">
                        <div className="w-40 h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
                      </div>
                      <div className="h-px bg-slate-100"></div>
                      <div className="flex justify-between">
                        <div className="w-56 h-2 bg-slate-900 rounded-full"></div>
                        <div className="w-28 h-2 bg-slate-900 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] opacity-[0.02] pointer-events-none">
                    <h1 className="text-9xl font-black tracking-tighter">MPL STEELS</h1>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Auto-Filled Form */}
            <div className="space-y-8">
              <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Extracted Schema</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-400">Validate AI-populated fields against source.</CardDescription>
                  </div>
                  <Badge className="bg-slate-900 text-white border-none flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    <Zap size={10} />
                    Verified
                  </Badge>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor Entity</Label>
                      <Input 
                        value={formData.vendorName} 
                        onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                        className="bg-emerald-50/20 border-emerald-100 focus:bg-white rounded-2xl h-12 font-bold text-slate-900 transition-all"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Category</Label>
                      <Input 
                        value={formData.material} 
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="bg-emerald-50/20 border-emerald-100 focus:bg-white rounded-2xl h-12 font-bold text-slate-900 transition-all"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Quantity</Label>
                      <Input 
                        value={formData.quantity} 
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        className="bg-emerald-50/20 border-emerald-100 focus:bg-white rounded-2xl h-12 font-black text-slate-900 text-data transition-all"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Rate</Label>
                      <Input 
                        value={formData.rate} 
                        onChange={(e) => setFormData({...formData, rate: e.target.value})}
                        className="bg-emerald-50/20 border-emerald-100 focus:bg-white rounded-2xl h-12 font-black text-slate-900 text-data transition-all"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Valuation</Label>
                      <Input 
                        value={formData.total} 
                        onChange={(e) => setFormData({...formData, total: e.target.value})}
                        className="bg-emerald-50/20 border-emerald-100 focus:bg-white rounded-2xl h-12 font-black text-slate-900 text-data transition-all"
                        disabled={step === "finalized"}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Terms</Label>
                      <Input 
                        value={formData.paymentTerms} 
                        onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                        className="bg-emerald-50/20 border-emerald-100 focus:bg-white rounded-2xl h-12 font-bold text-slate-900 transition-all"
                        disabled={step === "finalized"}
                      />
                    </div>
                  </div>

                  {step === "review" && (
                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={handleApprove}
                        className="flex-1 h-14 bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-slate-200 transition-all hover:scale-[1.02]"
                      >
                        <Check className="mr-2" size={18} />
                        Approve & Execute
                      </Button>
                      <Button 
                        onClick={handleReject}
                        variant="ghost"
                        className="flex-1 h-14 text-red-600 hover:bg-red-50 font-black uppercase tracking-widest text-xs rounded-2xl"
                      >
                        <X className="mr-2" size={18} />
                        Flag for Review
                      </Button>
                    </div>
                  )}

                  {step === "finalized" && (
                    <div className={cn(
                      "p-8 rounded-3xl border-2 flex items-center gap-6 animate-in zoom-in duration-500",
                      status === "approved" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
                    )}>
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                        status === "approved" ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-red-500 text-white shadow-red-100"
                      )}>
                        {status === "approved" ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-xl tracking-tight">
                          {status === "approved" ? "Execution Successful" : "Workflow Terminated"}
                        </h4>
                        <p className="text-sm font-medium opacity-80 mt-1">
                          {status === "approved" 
                            ? "Document has been committed to the ledger and the PO is now active." 
                            : "The document has been flagged for manual intervention."}
                        </p>
                        <Button 
                          variant="link" 
                          onClick={resetWorkflow}
                          className={cn("p-0 h-auto mt-4 font-black uppercase tracking-widest text-[10px]", status === "approved" ? "text-emerald-700" : "text-red-700")}
                        >
                          Process Next Artifact
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audit Log */}
              <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                    <History size={16} className="text-slate-300" />
                    Autonomous Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 shadow-lg shadow-slate-200"></div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Ingestion Complete</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">Today, 10:45 AM • RPA Engine v4.0</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-100"></div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Schema Validation Passed</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">Today, 10:45 AM • 99.8% Confidence</p>
                      </div>
                    </div>
                    {status !== "none" && (
                      <div className="flex items-start gap-4">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shadow-lg", status === "approved" ? "bg-emerald-600 shadow-emerald-100" : "bg-red-600 shadow-red-100")}></div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            {status === "approved" ? "Human Override: Approved" : "Human Override: Rejected"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">Today, 10:47 AM • System Admin</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
