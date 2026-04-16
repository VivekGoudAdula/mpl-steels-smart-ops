import React, { useState, useEffect, useMemo } from "react";
import { 
  X, 
  Download, 
  Search, 
  FileText, 
  Info, 
  History, 
  ChevronRight, 
  Sparkles, 
  Bot, 
  Send,
  MoreVertical,
  Trash2,
  Edit2,
  RefreshCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Filter,
  CheckCircle2,
  Lock,
  MessageSquare,
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Transaction, TransactionDocument, documentTypes } from "@/lib/mockData";

interface DocumentViewerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentViewer({ transaction: txn, isOpen, onClose }: DocumentViewerProps) {
  const [activeDoc, setActiveDoc] = useState<TransactionDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localDocs, setLocalDocs] = useState<TransactionDocument[]>([]);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({ type: 'PO', name: '' });

  // Set first document as active when opened
  useEffect(() => {
    if (isOpen && txn && txn.documents.length > 0) {
      setActiveDoc(txn.documents[0]);
      setLocalDocs(txn.documents);
    }
  }, [isOpen, txn]);

  const filteredDocs = useMemo(() => {
    if (!txn) return [];
    return localDocs.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [txn, searchQuery, localDocs]);

  if (!txn) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  
  const handleDownloadActive = () => {
    if (!activeDoc) return;
    toast.success(`Preparing secure download for ${activeDoc.name}...`);
    // Simulated download logic
    setTimeout(() => {
       const url = activeDoc.url || '/xerox-scan.pdf';
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', activeDoc.name);
       link.setAttribute('target', '_blank');
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
    }, 500);
  };

  const handleRemoveDoc = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this document from the transaction?")) {
      setLocalDocs(prev => prev.filter(d => d.id !== docId));
      if (activeDoc?.id === docId) setActiveDoc(null);
      toast.success("Document removed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingFile(file);
      setUploadMetadata({ type: 'PO', name: file.name });
    }
    e.target.value = '';
  };

  const finalizeUpload = () => {
    if (!uploadingFile) return;
    const newDoc: TransactionDocument = {
      id: `doc-up-${Date.now()}`,
      name: uploadMetadata.name,
      type: uploadMetadata.type,
      date: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(uploadingFile),
    };
    setLocalDocs(prev => [...prev, newDoc]);
    setActiveDoc(newDoc);
    setUploadingFile(null);
    toast.success("Document securely uploaded to enterprise portal");
  };

  const getDocTypeColor = (type: string) => {
    const config = documentTypes.find(t => t.id === type);
    return config?.color || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "p-0 overflow-hidden border-none shadow-2xl bg-[#f8fafc] focus:outline-none flex flex-col transition-all duration-300",
        isFullscreen 
          ? "max-w-[100vw] sm:max-w-[100vw] w-[100vw] h-[100vh] rounded-none m-0" 
          : "max-w-[95vw] sm:max-w-[95vw] w-[95vw] h-[92vh] rounded-3xl"
      )}>
        
        {/* Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center text-white">
                <FilesIcon size={16} />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-none">Transaction Workspace</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-indigo-600 font-mono tracking-tight">{txn.txnId}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {txn.documents.length} Records</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-full px-3 py-1 mr-4 border border-slate-200">
              <Lock size={12} className="text-slate-400 mr-1.5" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enterprise Secured</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all h-9 w-9"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </header>

        {/* 3-Panel Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* PANEL 1: Document Explorer (Left) - 20% */}
          <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Docs</h3>
                <RefreshCw size={12} className="text-slate-300 hover:text-indigo-600 cursor-pointer" />
              </div>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  placeholder="Explorer search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 pr-3 bg-slate-50 border-slate-100 rounded-xl focus:bg-white text-xs font-medium placeholder:text-slate-300 ring-0 focus-visible:ring-1 focus-visible:ring-indigo-100"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredDocs.length === 0 ? (
                <div className="py-10 text-center px-4">
                  <p className="text-xs text-slate-400 italic">No matching records found</p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={cn(
                      "group p-3 rounded-2xl cursor-pointer transition-all border border-transparent",
                      activeDoc?.id === doc.id 
                        ? "bg-indigo-50 border-indigo-100 shadow-sm" 
                        : "hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                        getDocTypeColor(doc.type)
                      )}>
                        <FileText size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-xs font-bold truncate mb-0.5",
                          activeDoc?.id === doc.id ? "text-indigo-950" : "text-slate-700"
                        )}>
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{doc.type}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                          <span className="text-[9px] font-bold text-slate-400">{doc.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          title="Download"
                          onClick={() => toast.success(`Downloading ${doc.name}...`)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Download size={14} />
                        </button>
                        <button 
                          title="Remove Document"
                          onClick={(e) => handleRemoveDoc(doc.id, e)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <input 
                type="file" 
                id="doc-upload" 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
              <Button 
                onClick={() => document.getElementById('doc-upload')?.click()}
                className="w-full bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest shadow-sm gap-2"
              >
                <PlusIcon size={14} />
                Upload New Document
              </Button>
            </div>
          </aside>

          {/* PANEL 2: Central Viewer (Center) - Flexible */}
          <main className="flex-1 flex flex-col bg-slate-200/50 relative overflow-hidden">
            {/* Viewer Toolbar */}
            <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 mx-4 mt-3 rounded-2xl shadow-sm z-10">
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-black text-slate-900 flex items-center gap-2 truncate max-w-[300px]">
                  <FileText size={14} className="text-indigo-500" />
                  {activeDoc?.name || "Select a document"}
                </p>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-[10px] font-black text-slate-600 w-10 text-center">{zoom}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-0.5">
                  <button className="p-1.5 hover:bg-white rounded shadow-none hover:shadow-sm transition-all text-slate-400 hover:text-slate-900">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[10px] px-2 font-black text-slate-500">1 / 1</span>
                  <button className="p-1.5 hover:bg-white rounded shadow-none hover:shadow-sm transition-all text-slate-400 hover:text-slate-900">
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <button onClick={handleDownloadActive} className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm shadow-indigo-100">
                  <Download size={16} />
                </button>
                <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

            {/* Document Frame */}
            <div className="flex-1 p-4 pb-6 overflow-hidden flex flex-col">
              <div className="flex-1 bg-gray-100 rounded-3xl shadow-inner border border-gray-200 relative custom-scrollbar p-2 flex justify-center">
                {activeDoc ? (
                  <iframe 
                    key={`${activeDoc.id}-${zoom}`}
                    src={`${activeDoc.url || '/xerox-scan.pdf'}#toolbar=0&navpanes=0&zoom=${zoom}`} 
                    className="w-full h-full min-h-[800px] max-w-5xl border border-gray-200 bg-white shadow-xl rounded-xl"
                    title="Enterprise Viewer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-200">
                      <FilesIcon size={40} />
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-widest">Workspace Ready</h4>
                      <p className="text-xs text-slate-400 font-medium">Select a document from the left explorer to begin review</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* PANEL 3: Intelligence & Context (Right) - 25% */}
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Context Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-indigo-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Details</h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-2 gap-y-4 shadow-sm">
                  <MetadataRow label="TXN ID" value={txn.txnId} />
                  <MetadataRow label="Activity" value={txn.date} />
                  <MetadataRow label="PO Ref" value={txn.poNumber} />
                  <MetadataRow label="WB Ref" value={txn.wbNumber} />
                  <MetadataRow label="GRN Ref" value={txn.grnNumber} />
                  <MetadataRow label="Inv Ref" value={txn.invoiceNumber} />
                </div>
              </section>

              <div className="h-px bg-slate-100" />

              {/* AI Section */}
              <section className="space-y-4 flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-600" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Document Intelligence</h3>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full">
                    ACTIVE
                  </Badge>
                </div>

                <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[300px] shadow-sm">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar bg-gray-50/30">
                    <div className="flex flex-col gap-1.5 max-w-[90%]">
                      <div className="bg-white p-3 rounded-xl rounded-tl-none border border-gray-200 shadow-sm">
                        <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                          Workspace Assistant ready. Ask anything about <b>{activeDoc?.name || 'these documents'}</b>.
                        </p>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                        <Bot size={8} /> Assistant
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 items-end ml-auto max-w-[90%]">
                      <div className="bg-[#002147] p-3 rounded-xl rounded-tr-none shadow-sm">
                        <p className="text-[11px] text-white leading-relaxed font-medium capitalize">
                          Analyze verification status
                        </p>
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 uppercase mr-1">Reviewer</span>
                    </div>

                    <div className="flex flex-col gap-1.5 max-w-[90%]">
                      <div className="bg-white p-3 rounded-xl rounded-tl-none border border-gray-200 shadow-sm border-l-2 border-l-[#002147]">
                        <p className="text-[11px] font-black text-[#002147] mb-1 flex items-center gap-1.5">
                          <CheckCircle2 size={10} /> AI Analysis
                        </p>
                        <p className="text-[11px] text-gray-600 font-medium italic">
                          GRN verification completed. Data matches PO-123. Invoice pending final approval.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white border-t border-gray-200">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ask anything..." 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="enterprise-input h-9 text-[11px]"
                      />
                      <Button size="icon" className="h-9 w-9 bg-[#002147] hover:bg-[#002147]/90 text-white rounded-xl shadow-sm shrink-0">
                        <Send size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* History / Audit Section */}
              <section className="space-y-4">
                <Button variant="outline" className="w-full justify-between h-11 rounded-xl border-gray-200 hover:bg-gray-50 group font-bold text-[10px] uppercase tracking-widest transition-all text-gray-600 hover:text-gray-900 shadow-sm">
                  <span className="flex items-center gap-2">
                    <History size={14} className="text-gray-400 group-hover:text-gray-600" />
                    Full Audit Log
                  </span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </Button>
              </section>

            </div>
          </aside>
        </div>
        {/* Upload Metadata Dialog */}
        <Dialog open={!!uploadingFile} onOpenChange={(open) => !open && setUploadingFile(null)}>
          <DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-2xl border-none top-[50%] translate-y-[-50%]">
            <h3 className="text-[14px] font-black uppercase tracking-widest text-[#002147] mb-4 flex items-center gap-2">
              <FileText size={16} /> 
              Upload New Document
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Document Name</label>
                <Input 
                  value={uploadMetadata.name} 
                  onChange={(e) => setUploadMetadata({...uploadMetadata, name: e.target.value})}
                  className="enterprise-input h-11"
                  placeholder="e.g. supplier_invoice.pdf"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Document Classification</label>
                <select 
                  value={uploadMetadata.type}
                  onChange={(e) => setUploadMetadata({...uploadMetadata, type: e.target.value})}
                  className="w-full h-11 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-slate-700"
                >
                  {documentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={() => setUploadingFile(null)} className="rounded-xl font-bold hover:bg-gray-100 text-gray-500">Cancel</Button>
                <Button onClick={finalizeUpload} className="enterprise-button-primary shadow-sm h-10 px-6">Upload to Portal</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

function MetadataRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-slate-800 truncate pr-2">{value || "N/A"}</span>
    </div>
  );
}

// Icons
function FilesIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
      <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
      <path d="M15 2v4.5h4.5" />
    </svg>
  );
}

function PlusIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
