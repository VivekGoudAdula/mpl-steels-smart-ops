
import React, { useState, useRef } from "react";
import { 
  FileUp, 
  X, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Download, 
  Eye, 
  EyeOff,
  Star,
  FileText,
  History,
  TrendingDown,
  Award,
  Trash2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

type ComparisonType = "quotation" | "contract" | "specification";

interface FileState {
  id: string;
  name: string;
  size: string;
  type: string;
}

export default function DocumentComparison() {
  const [files, setFiles] = useState<Record<string, FileState | null>>({
    A: null,
    B: null,
    C: null
  });
  const [compType, setCompType] = useState<ComparisonType>("quotation");
  const [isComparing, setIsComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);

  const handleFileUpload = (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [slot]: {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          type: file.type
        }
      }));
    }
  };

  const removeFile = (slot: string) => {
    setFiles(prev => ({ ...prev, [slot]: null }));
    setShowResults(false);
  };

  const runComparison = () => {
    if (!files.A || !files.B) return;
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-300"></span>
            Analytics & Insights
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Document Comparison</h1>
          <p className="text-sm text-gray-500 mt-1">Compare quotations, contracts, and specifications with AI-powered insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-gray-200">
            <History className="w-4 h-4 mr-2" />
            Comparison History
          </Button>
          <Button variant="outline" className="bg-white border-gray-200">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="enterprise-card h-fit">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900">1. Upload Documents</h3>
              <p className="text-xs text-gray-500">Select at least two documents to start</p>
            </div>
            <div className="space-y-4">
              {['A', 'B', 'C'].map((slot) => (
                <div key={slot} className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Document {slot} {slot === 'C' && "(Optional)"}
                  </Label>
                  {files[slot] ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-[#002147] flex items-center justify-center text-white shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-gray-900 truncate">{files[slot]?.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{files[slot]?.size}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(slot)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative group">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        onChange={(e) => handleFileUpload(slot, e)}
                      />
                      <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group-hover:border-[#002147] group-hover:bg-gray-50 transition-all">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                          <Plus size={16} />
                        </div>
                        <p className="text-xs font-medium text-gray-500">Click or drag to upload</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="enterprise-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900">2. Comparison Type</h3>
            </div>
            <div className="space-y-6">
              <Select value={compType} onValueChange={(v: ComparisonType) => setCompType(v)}>
                <SelectTrigger className="enterprise-input w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quotation">Vendor Quotation</SelectItem>
                  <SelectItem value="contract">Contract Version</SelectItem>
                  <SelectItem value="specification">Rate Sheet / Specification</SelectItem>
                </SelectContent>
              </Select>

              <button 
                className="enterprise-button w-full bg-[#002147] hover:bg-[#002147]/90 disabled:opacity-50"
                disabled={!files.A || !files.B || isComparing}
                onClick={runComparison}
              >
                {isComparing ? (
                  <div className="flex items-center justify-center gap-2 w-full text-white">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full text-white">
                    <ArrowRightLeft size={16} />
                    COMPARE DOCUMENTS
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2">
          {!showResults ? (
            <div className="h-full min-h-[400px] border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                <ArrowRightLeft size={32} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">No Comparison Active</h3>
                <p className="text-xs text-gray-500 max-w-[250px] mx-auto mt-2">Upload documents and select a comparison type to see the analysis here.</p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <Switch id="diff-only" checked={diffOnly} onCheckedChange={setDiffOnly} />
                  <Label htmlFor="diff-only" className="text-xs font-semibold text-gray-700">Highlight differences only</Label>
                </div>
                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                  AI Analysis Complete
                </Badge>
              </div>

              {/* Summary Box */}
              <div className="bg-[#002147] rounded-xl p-5 text-white relative overflow-hidden shadow-sm">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">Comparison Summary</h4>
                    <div className="space-y-1">
                      {compType === "quotation" && (
                        <p className="text-xs text-gray-300 leading-relaxed">
                          👉 <span className="text-green-400 font-bold">Vendor B</span> offers the lowest price (₹4,800) but has a longer delivery time (7 days). 
                          <span className="text-blue-300 font-bold ml-1">Vendor C</span> is recommended for urgent requirements due to 5-star rating and 4-day delivery.
                        </p>
                      )}
                      {compType === "contract" && (
                        <p className="text-xs text-gray-300 leading-relaxed">
                          👉 Major changes detected in <span className="text-yellow-400 font-bold">Payment Terms</span> and a new <span className="text-red-400 font-bold">Penalty Clause</span> has been added. 
                          Consistency check: 85% match with standard templates.
                        </p>
                      )}
                      {compType === "specification" && (
                        <p className="text-xs text-gray-300 leading-relaxed">
                          👉 <span className="text-red-400 font-bold">Thickness</span> parameter failed validation (8mm vs 10mm expected). 
                          Weight is within tolerance but shows a <span className="text-yellow-400 font-bold">2% variance</span>.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Tables */}
              <div className="enterprise-card p-0 overflow-hidden">
                  {compType === "quotation" && (
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-b border-gray-100">
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">Vendor</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">Price</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">Delivery Time</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto text-right">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Vendor A", price: "₹5,000", delivery: "5 days", rating: 4, bestPrice: false, bestRating: false },
                          { name: "Vendor B", price: "₹4,800", delivery: "7 days", rating: 3, bestPrice: true, bestRating: false },
                          { name: "Vendor C", price: "₹5,100", delivery: "4 days", rating: 5, bestPrice: false, bestRating: true },
                        ].map((row, i) => (
                          <TableRow key={i} className="group hover:bg-gray-50 border-b border-gray-50">
                            <TableCell className="font-bold text-gray-900 text-sm py-4">{row.name}</TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2 text-sm">
                                {row.price}
                                {row.bestPrice && <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-bold uppercase py-0.5 px-1.5 h-auto rounded tracking-wider">Lowest</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm py-4">{row.delivery}</TableCell>
                            <TableCell className="text-right py-4">
                              <div className="flex items-center justify-end gap-2 text-sm">
                                <div className="flex text-yellow-500">
                                  {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={12} fill={j < row.rating ? "currentColor" : "none"} />
                                  ))}
                                </div>
                                {row.bestRating && <Badge className="bg-blue-100 text-blue-700 border-none text-[9px] font-bold uppercase py-0.5 px-1.5 h-auto rounded tracking-wider">Best</Badge>}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {compType === "contract" && (
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-b border-gray-100">
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto w-[200px]">Clause</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">Old Version</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">New Version</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { clause: "Payment Terms", old: "Net 30 days", new: "Net 45 days", status: "changed" },
                          { clause: "Penalty Clause", old: "Not present", new: "Added: 0.5% per week delay", status: "added" },
                          { clause: "Force Majeure", old: "Standard Clause v1", new: "Standard Clause v1", status: "match" },
                          { clause: "Termination", old: "30 days notice", new: "60 days notice", status: "changed" },
                          { clause: "Arbitration", old: "Mumbai Jurisdiction", new: "Not present", status: "removed" },
                        ].filter(row => !diffOnly || row.status !== "match").map((row, i) => (
                          <TableRow key={i} className="group hover:bg-gray-50 border-b border-gray-50">
                            <TableCell className="font-bold text-gray-700 text-sm py-3 px-4">{row.clause}</TableCell>
                            <TableCell className={cn("text-sm py-3 px-4", row.status === "removed" && "text-red-500 line-through")}>
                              {row.old}
                            </TableCell>
                            <TableCell className={cn(
                              "text-sm font-medium py-3 px-4",
                              row.status === "changed" && "bg-yellow-50 text-yellow-700",
                              row.status === "added" && "bg-green-50 text-green-700",
                              row.status === "removed" && "text-gray-400"
                            )}>
                              <div className="flex items-center justify-between">
                                {row.new}
                                {row.status === "changed" && <AlertTriangle size={14} className="text-yellow-500" />}
                                {row.status === "added" && <Plus size={14} className="text-green-500" />}
                                {row.status === "removed" && <X size={14} className="text-red-500" />}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {compType === "specification" && (
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-b border-gray-100">
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">Parameter</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">Expected</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto">Vendor Value</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase tracking-wider text-gray-500 py-4 h-auto text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { param: "Steel Grade", expected: "Grade A", actual: "Grade A", status: "match" },
                          { param: "Thickness", expected: "10mm", actual: "8mm", status: "issue" },
                          { param: "Weight", expected: "100kg", actual: "98kg", status: "warning" },
                          { param: "Tensile Strength", expected: "450 MPa", actual: "455 MPa", status: "match" },
                          { param: "Carbon Content", expected: "0.2%", actual: "0.25%", status: "warning" },
                        ].filter(row => !diffOnly || row.status !== "match").map((row, i) => (
                          <TableRow key={i} className="group hover:bg-gray-50 border-b border-gray-50">
                            <TableCell className="font-bold text-gray-700 text-sm py-4">{row.param}</TableCell>
                            <TableCell className="text-sm text-gray-500 py-4">{row.expected}</TableCell>
                            <TableCell className={cn(
                              "text-sm font-bold py-4",
                              row.status === "match" && "text-green-600",
                              row.status === "warning" && "text-yellow-600",
                              row.status === "issue" && "text-red-600"
                            )}>
                              {row.actual}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <div className="flex items-center justify-end">
                                {row.status === "match" && <CheckCircle2 size={16} className="text-green-500" />}
                                {row.status === "warning" && <AlertTriangle size={16} className="text-yellow-500" />}
                                {row.status === "issue" && <AlertCircle size={16} className="text-red-500" />}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
              </div>

              <div className="flex justify-end gap-3 p-4">
                <Button variant="outline" className="border-gray-200">
                  <Download className="w-4 h-4 mr-2" />
                  Save Comparison
                </Button>
                <button className="enterprise-button px-6 bg-[#002147] hover:bg-[#002147]/90 text-white">
                  Approve Selected Option
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
