
import React, { useState, useEffect } from "react";
import { 
  X, 
  Download, 
  ExternalLink, 
  File, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Loader2,
  FileText,
  Info,
  History,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface DocumentViewerProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentViewer({ document: doc, isOpen, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showMetadata, setShowMetadata] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, doc]);

  if (!doc) return null;

  const isPdf = doc.fileName.toLowerCase().endsWith(".pdf");
  // Using a more reliable PDF for demo purposes
  const fileUrl = isPdf 
    ? "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" 
    : "https://picsum.photos/seed/steel/800/1200";

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = fileUrl;
    link.download = doc.fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(fileUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1200px] w-[80vw] sm:max-w-[80vw] h-[85vh] p-0 overflow-hidden border border-slate-200 shadow-2xl bg-white rounded-[2rem] focus:outline-none">
        <div className="flex flex-col h-full bg-slate-50">
          {/* Header Bar - Full Width */}
          <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-lg shadow-black/10">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-none mb-1">{doc.fileName}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {doc.documentType}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-mono font-bold text-blue-600">
                    {doc.transactionId}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-100 rounded-full p-1 mr-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-white transition-all"
                  onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                >
                  <ZoomOut size={16} />
                </Button>
                <span className="text-[10px] font-mono font-bold w-12 text-center text-slate-600">{zoom}%</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-white transition-all"
                  onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                >
                  <ZoomIn size={16} />
                </Button>
              </div>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-widest h-9 px-4"
                onClick={handleDownload}
              >
                <Download size={14} className="mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-widest h-9 px-4"
                onClick={handleOpenNewTab}
              >
                <ExternalLink size={14} className="mr-2" />
                Open
              </Button>
              
              <div className="h-6 w-px bg-slate-200 mx-1" />

              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                onClick={onClose}
              >
                <X size={20} />
              </Button>
            </div>
          </header>

          {/* Split Layout: Document (Left) | Metadata (Right) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Document View Area (75%) */}
            <div className="flex-[3] overflow-y-auto bg-slate-200/40 custom-scrollbar h-full px-8 py-12">
              <div 
                className="relative mx-auto transition-all duration-300 ease-in-out"
                style={{ 
                  width: `${zoom}%`,
                  maxWidth: zoom > 100 ? 'none' : '1000px',
                  minWidth: '400px'
                }}
              >
                {isLoading ? (
                  <div className="w-full aspect-[1/1.414] bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-slate-200 animate-spin" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initializing Viewer...</p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden"
                  >
                    {/* High-Fidelity Quotation PDF Mock */}
                    <div className="aspect-[1/1.414] bg-white p-[8%] flex flex-col font-sans text-black">
                      <div className="mb-16 text-center">
                        <h1 className="text-4xl font-black tracking-tight mb-4">JSW Steel - Steel Quotation</h1>
                        <div className="h-1.5 w-20 bg-black mx-auto rounded-full opacity-10" />
                      </div>

                      <div className="w-full border-2 border-black rounded-lg overflow-hidden">
                        <div className="grid grid-cols-[1fr_2fr] border-b-2 border-black bg-slate-50">
                          <div className="p-4 font-bold border-r-2 border-black text-xs uppercase tracking-widest">Parameter</div>
                          <div className="p-4 font-bold text-xs uppercase tracking-widest">Details</div>
                        </div>
                        <QuotationRow label="Vendor Name" value="JSW Steel" />
                        <QuotationRow label="Price per ton" value="₹4800" />
                        <QuotationRow label="Delivery Time" value="7 days" />
                        <QuotationRow label="Steel Grade" value="A" />
                        <QuotationRow label="Thickness" value="8 mm" />
                        <QuotationRow label="Payment Terms" value="Net 45 days" />
                        <QuotationRow label="Remarks" value="Lower cost, but thinner material" isLast />
                      </div>

                      <div className="mt-auto pt-20 flex justify-between items-end opacity-40">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest">Authorized Signatory</p>
                          <div className="w-40 h-12 border-b-2 border-black italic flex items-end text-sm pb-1">JSW Sales Team</div>
                        </div>
                        <div className="text-right text-[8px] font-mono space-y-1">
                          <p className="font-bold">REF: JSW/QT/2024/0882</p>
                          <p>DIGITAL COPY - MPL STEELS OS</p>
                          <p>VERIFIED: {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: Metadata Panel (25%) */}
            <aside className="flex-1 bg-white border-l border-slate-100 overflow-y-auto p-8 space-y-10 shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-blue-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Document Context</h3>
                </div>
                <div className="grid gap-6">
                  <MetadataItem label="Transaction ID" value={doc.transactionId} />
                  <MetadataItem label="PO Number" value={doc.poNumber} />
                  <MetadataItem label="WB Number" value={doc.wbNumber} />
                  <MetadataItem label="GRN Number" value={doc.grnNumber} />
                  <MetadataItem label="Invoice Number" value={doc.invoiceNumber} />
                  <MetadataItem label="Document Date" value={doc.date} />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security & Compliance</h3>
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 space-y-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold">Encrypted Asset</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    This asset is cryptographically hashed and stored in the MPL secure vault. Any tampering will invalidate the digital seal.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Seal Intact</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button variant="outline" className="w-full justify-between text-[10px] font-bold uppercase tracking-widest h-12 rounded-xl border-slate-200 hover:bg-slate-50 group">
                  <span className="flex items-center gap-2">
                    <History size={14} className="text-slate-400" />
                    Audit History
                  </span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full justify-between text-[10px] font-bold uppercase tracking-widest h-12 rounded-xl border-slate-200 hover:bg-slate-50 group">
                  <span className="flex items-center gap-2">
                    <Maximize2 size={14} className="text-slate-400" />
                    Full Screen
                  </span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetadataItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value || "N/A"}</p>
    </div>
  );
}

function QuotationRow({ label, value, isLast }: { label: string, value: string, isLast?: boolean }) {
  return (
    <div className={cn("grid grid-cols-[1fr_2fr]", !isLast && "border-b-2 border-black")}>
      <div className="p-5 font-bold border-r-2 border-black bg-slate-50/50 text-sm uppercase tracking-wider">{label}</div>
      <div className="p-5 text-base font-medium">{value}</div>
    </div>
  );
}
