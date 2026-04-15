
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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Comparison</h1>
          <p className="text-slate-500 mt-1">Compare quotations, contracts, and specifications with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <History className="w-4 h-4 mr-2" />
            Comparison History
          </Button>
          <Button variant="outline" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">1. Upload Documents</CardTitle>
              <CardDescription>Select at least two documents to start</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['A', 'B', 'C'].map((slot) => (
                <div key={slot} className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Document {slot} {slot === 'C' && "(Optional)"}
                  </Label>
                  {files[slot] ? (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-blue-900 truncate">{files[slot]?.name}</p>
                          <p className="text-[10px] text-blue-600 font-medium">{files[slot]?.size}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(slot)}
                        className="p-1.5 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <Plus size={16} />
                        </div>
                        <p className="text-xs font-medium text-slate-500">Click or drag to upload</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">2. Comparison Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select value={compType} onValueChange={(v: ComparisonType) => setCompType(v)}>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quotation">Vendor Quotation</SelectItem>
                  <SelectItem value="contract">Contract Version</SelectItem>
                  <SelectItem value="specification">Rate Sheet / Specification</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 disabled:opacity-50"
                disabled={!files.A || !files.B || isComparing}
                onClick={runComparison}
              >
                {isComparing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft size={18} />
                    Compare Documents
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2">
          {!showResults ? (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                <ArrowRightLeft size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-400">No Comparison Active</h3>
                <p className="text-slate-400 max-w-xs mx-auto mt-2">Upload documents and select a comparison type to see the analysis here.</p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="diff-only" checked={diffOnly} onCheckedChange={setDiffOnly} />
                    <Label htmlFor="diff-only" className="text-sm font-medium text-slate-600">Highlight differences only</Label>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1">
                  AI Analysis Complete
                </Badge>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold">Comparison Summary</h4>
                    <div className="space-y-1">
                      {compType === "quotation" && (
                        <p className="text-sm text-slate-300">
                          👉 <span className="text-emerald-400 font-bold">Vendor B</span> offers the lowest price (₹4,800) but has a longer delivery time (7 days). 
                          <span className="text-blue-400 font-bold ml-1">Vendor C</span> is recommended for urgent requirements due to 5-star rating and 4-day delivery.
                        </p>
                      )}
                      {compType === "contract" && (
                        <p className="text-sm text-slate-300">
                          👉 Major changes detected in <span className="text-amber-400 font-bold">Payment Terms</span> and a new <span className="text-red-400 font-bold">Penalty Clause</span> has been added. 
                          Consistency check: 85% match with standard templates.
                        </p>
                      )}
                      {compType === "specification" && (
                        <p className="text-sm text-slate-300">
                          👉 <span className="text-red-400 font-bold">Thickness</span> parameter failed validation (8mm vs 10mm expected). 
                          Weight is within tolerance but shows a <span className="text-amber-400 font-bold">2% variance</span>.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Tables */}
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  {compType === "quotation" && (
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-bold">Vendor</TableHead>
                          <TableHead className="font-bold">Price</TableHead>
                          <TableHead className="font-bold">Delivery Time</TableHead>
                          <TableHead className="font-bold text-right">Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Vendor A", price: "₹5,000", delivery: "5 days", rating: 4, bestPrice: false, bestRating: false },
                          { name: "Vendor B", price: "₹4,800", delivery: "7 days", rating: 3, bestPrice: true, bestRating: false },
                          { name: "Vendor C", price: "₹5,100", delivery: "4 days", rating: 5, bestPrice: false, bestRating: true },
                        ].map((row, i) => (
                          <TableRow key={i} className="group hover:bg-slate-50/50">
                            <TableCell className="font-bold text-slate-900">{row.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {row.price}
                                {row.bestPrice && <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px] font-bold uppercase tracking-wider">Lowest</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>{row.delivery}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={12} fill={j < row.rating ? "currentColor" : "none"} />
                                  ))}
                                </div>
                                {row.bestRating && <Badge className="bg-blue-100 text-blue-700 border-none text-[10px] font-bold uppercase tracking-wider">Best</Badge>}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {compType === "contract" && (
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-bold w-[200px]">Clause</TableHead>
                          <TableHead className="font-bold">Old Version</TableHead>
                          <TableHead className="font-bold">New Version</TableHead>
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
                          <TableRow key={i} className="group hover:bg-slate-50/50">
                            <TableCell className="font-bold text-slate-700">{row.clause}</TableCell>
                            <TableCell className={cn("text-sm", row.status === "removed" && "text-red-500 line-through")}>
                              {row.old}
                            </TableCell>
                            <TableCell className={cn(
                              "text-sm font-medium",
                              row.status === "changed" && "bg-amber-50 text-amber-700",
                              row.status === "added" && "bg-emerald-50 text-emerald-700",
                              row.status === "removed" && "text-slate-300"
                            )}>
                              <div className="flex items-center justify-between">
                                {row.new}
                                {row.status === "changed" && <AlertTriangle size={14} className="text-amber-500" />}
                                {row.status === "added" && <Plus size={14} className="text-emerald-500" />}
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
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-bold">Parameter</TableHead>
                          <TableHead className="font-bold">Expected</TableHead>
                          <TableHead className="font-bold">Vendor Value</TableHead>
                          <TableHead className="font-bold text-right">Status</TableHead>
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
                          <TableRow key={i} className="group hover:bg-slate-50/50">
                            <TableCell className="font-bold text-slate-700">{row.param}</TableCell>
                            <TableCell className="text-sm text-slate-500">{row.expected}</TableCell>
                            <TableCell className={cn(
                              "text-sm font-bold",
                              row.status === "match" && "text-emerald-600",
                              row.status === "warning" && "text-amber-600",
                              row.status === "issue" && "text-red-600"
                            )}>
                              {row.actual}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                {row.status === "match" && <CheckCircle2 size={18} className="text-emerald-500" />}
                                {row.status === "warning" && <AlertTriangle size={18} className="text-amber-500" />}
                                {row.status === "issue" && <AlertCircle size={18} className="text-red-500" />}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" className="bg-white">
                  <Download className="w-4 h-4 mr-2" />
                  Save Comparison
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Approve Selected Option
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
