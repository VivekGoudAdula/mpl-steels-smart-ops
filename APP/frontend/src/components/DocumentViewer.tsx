
import React, { useState, useEffect } from "react";
import { 
  X, 
  Download, 
  ExternalLink, 
  Loader2,
  FileText,
  Info,
  History,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  Sparkles,
  Bot,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface DocumentViewerProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentViewer({ document: doc, isOpen, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, doc]);

  if (!doc) return null;

  const isPdf = doc.fileName.toLowerCase().endsWith(".pdf");
  // Use the local Xerox scan if it's a PDF, otherwise a fallback
  const fileUrl = isPdf 
    ? "/xerox-scan.pdf" 
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
            {/* Left: Native Document View Area (75%) */}
            <div className="flex-[3] bg-slate-200/40 h-full p-4">
              <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                {isLoading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-slate-200 animate-spin" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Native Viewer...</p>
                  </div>
                ) : (
                  <iframe 
                    src={`${fileUrl}#toolbar=1&navpanes=0&view=FitH`} 
                    className="w-full h-full border-none"
                    title="PDF Viewer"
                  />
                )}
              </div>
            </div>

            {/* Right: Metadata Panel (25%) */}
            <aside className="flex-1 bg-white border-l border-slate-100 overflow-y-auto p-6 space-y-8 shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] flex flex-col">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-blue-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Document Context</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  <MetadataItem label="TXN ID" value={doc.transactionId} />
                  <MetadataItem label="PO #" value={doc.poNumber} />
                  <MetadataItem label="WB #" value={doc.wbNumber} />
                  <MetadataItem label="GRN #" value={doc.grnNumber} />
                  <MetadataItem label="Inv #" value={doc.invoiceNumber} />
                  <MetadataItem label="Date" value={doc.date} />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Document Assistant (Future RAG) */}
              <div className="space-y-4 flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-600" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Document Intelligence</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">AI Ready</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden min-h-[350px]">
                  {/* Chat Messages Log */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-1 max-w-[90%]">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          Hello! I've indexed this document. You can ask me anything.
                        </p>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">MPL AI</span>
                    </div>

                    <div className="flex flex-col gap-1 items-end ml-auto max-w-[90%]">
                      <div className="bg-slate-900 p-3 rounded-2xl rounded-tr-none shadow-lg">
                        <p className="text-[11px] text-white leading-relaxed font-medium">
                          What's the total weight?
                        </p>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mr-1">You</span>
                    </div>

                    <div className="flex flex-col gap-1 max-w-[90%]">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                        <p className="text-[11px] text-slate-600 leading-relaxed font-black mb-1 flex items-center gap-1.5">
                          <Bot size={10} className="text-purple-600" />
                          RAG Result
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          The weight is <b>24.450 MT</b>.
                        </p>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">MPL AI</span>
                    </div>
                  </div>

                  {/* Input Box */}
                  <div className="p-3 bg-white border-t border-slate-100">
                    <div className="relative group">
                      <Input 
                        placeholder="Ask anything..." 
                        className="h-10 pl-3 pr-10 bg-slate-50 border-none rounded-xl focus:bg-white transition-all text-[11px] font-medium"
                      />
                      <Button 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-slate-900 hover:bg-purple-600 text-white rounded-lg transition-all"
                      >
                        <Send size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button variant="outline" className="w-full justify-between text-[10px] font-bold uppercase tracking-widest h-11 rounded-xl border-slate-200 hover:bg-slate-50 group">
                  <span className="flex items-center gap-2">
                    <History size={14} className="text-slate-400" />
                    Audit Log
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
