import React, { useState, useEffect, useMemo } from "react";
import { 
  X, 
  Download, 
  Search, 
  FileText, 
  Info, 
  History, 
  ChevronRight, 
  Trash2,
  RefreshCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Minimize2,
  Loader2,
  Lock as LockIcon,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { documentTypes } from "@/lib/mockData";
import api, { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

interface DocumentViewerProps {
  transaction: any | null;
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  defaultType?: string;
}

export default function DocumentViewer({ transaction: txn, isOpen, onClose, userRole, defaultType }: DocumentViewerProps) {
  const [activeDoc, setActiveDoc] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localDocs, setLocalDocs] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({ type: 'PO', name: '' });
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    if (!txn?.id) return;
    setIsLoadingDocs(true);
    try {
      const res = await api.get(`/documents?txn_id=${txn.id}`);
      setLocalDocs(res.data);
      if (res.data.length > 0 && !activeDoc) {
        setActiveDoc(res.data[0]);
      }
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (isOpen && txn) {
      fetchDocuments();
    } else {
      setActiveDoc(null);
      setLocalDocs([]);
    }
  }, [isOpen, txn]);

  const filteredDocs = useMemo(() => {
    return localDocs.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, localDocs]);

  if (!txn) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  
  const BACKEND_URL = API_BASE_URL;
  const resolveDocUrl = (url: string) =>
    url?.startsWith("http") ? url : `${BACKEND_URL}${url}`;

  const handleDownloadActive = () => {
    if (!activeDoc) return;
    toast.success(`Opening ${activeDoc.name}...`);
    window.open(resolveDocUrl(activeDoc.url), '_blank');
  };

  const handleRemoveDoc = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Permanently delete this document from server?")) return;
    
    try {
      await api.delete(`/documents/${docId}`);
      toast.success("Document deleted");
      if (activeDoc?.id === docId) setActiveDoc(null);
      fetchDocuments();
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingFile(file);
      setUploadMetadata({
        type: defaultType || 'PO',
        name: file.name
      });
    }
  };

  const finalizeUpload = async () => {
    if (!uploadingFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadingFile);
      formData.append('type', uploadMetadata.type);
      formData.append('txn_id', txn.txnId); // Using the consistent txn_id string

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Secure bridge established. Document uploaded.");
      setUploadingFile(null);
      fetchDocuments();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const getDocTypeColor = (type: string) => {
    const config = documentTypes.find(t => t.id === type);
    return config?.color || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <>
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
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {localDocs.length} Records</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-full px-3 py-1 mr-4 border border-slate-200">
              <LockIcon size={12} className="text-slate-400 mr-1.5" />
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

        {/* 2-Panel Main Workspace (Left: PDF, Right: Sidebar with Info & Docs) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* PANEL 1: Central Viewer (Left) - Flexible */}
          <main className="flex-1 flex flex-col bg-slate-200/50 relative overflow-hidden h-full">
            {/* Viewer Toolbar */}
            <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 mx-4 mt-3 rounded-2xl shadow-sm z-10 transition-all">
              <div className="flex items-center gap-4 overflow-hidden">
                <p className="text-[11px] font-black text-slate-900 flex items-center gap-2 truncate max-w-[500px]">
                  <FileText size={14} className="text-indigo-500" />
                  {activeDoc?.name || "Select a document"}
                </p>
                <div className="h-4 w-px bg-slate-200 shrink-0" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-[10px] font-black text-slate-600 w-10 text-center">{zoom}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
              <div className="flex-1 bg-gray-100 rounded-[2.5rem] shadow-inner border border-slate-300 relative custom-scrollbar p-2 flex justify-center">
                {(() => {
                  const BACKEND = API_BASE_URL;
                  const resolveUrl = (url: string) =>
                    url.startsWith("http") ? url : `${BACKEND}${url}`;
                  const dummyUrl = `/xerox-scan.pdf#toolbar=0&navpanes=0&zoom=${zoom}`;

                  if (activeDoc) {
                    const src = `${resolveUrl(activeDoc.url)}#toolbar=0&navpanes=0&zoom=${zoom}`;
                    return (
                      <iframe
                        key={`${activeDoc.id}-${zoom}`}
                        src={src}
                        className="w-full h-full border border-slate-200 bg-white shadow-xl rounded-[2rem]"
                        title="Enterprise Viewer"
                      />
                    );
                  }
                  return (
                    <iframe
                      key={`dummy-${zoom}`}
                      src={dummyUrl}
                      className="w-full h-full border border-slate-200 bg-white shadow-xl rounded-[2rem]"
                      title="Sample Document"
                    />
                  );
                })()}
              </div>
            </div>
          </main>

          {/* PANEL 2: Context & Explorer (Right) - 25% Fixed Width */}
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 h-full overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* TOP: Transaction Information */}
              <div className="p-6 border-b border-slate-100 space-y-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-indigo-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Details</h3>
                </div>
                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 grid grid-cols-2 gap-y-4">
                  <MetadataRow label="TXN ID" value={txn.txnId} />
                  <MetadataRow label="Activity" value={txn.date} />
                  <MetadataRow label="PO Ref" value={txn.poNumber} />
                  <MetadataRow label="WB Ref" value={txn.wbNumber} />
                  <MetadataRow label="GRN Ref" value={txn.grnNumber} />
                  <MetadataRow label="Inv Ref" value={txn.invoiceNumber} />
                </div>
              </div>

              {/* BOTTOM: Document Explorer */}
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="px-6 py-4 border-b border-slate-100 space-y-3 sticky top-0 bg-white z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Docs</h3>
                    <button onClick={fetchDocuments} disabled={isLoadingDocs} className="p-1 hover:bg-slate-50 rounded">
                       <RefreshCw size={12} className={cn("text-slate-300 hover:text-indigo-600", isLoadingDocs && "animate-spin")} />
                    </button>
                  </div>
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                      placeholder="Explorer search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-9 pr-3 bg-slate-50/80 border-slate-100 rounded-xl focus:bg-white text-xs font-semibold placeholder:text-slate-400 focus-visible:ring-indigo-100 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {isLoadingDocs ? (
                     <div className="py-20 flex flex-col items-center gap-3">
                       <Loader2 className="w-6 h-6 text-indigo-100 animate-spin" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Accessing Ledger...</span>
                     </div>
                  ) : filteredDocs.length === 0 ? (
                    <div className="py-10 text-center px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">No items indexed for this scope</p>
                    </div>
                  ) : (
                    filteredDocs.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => setActiveDoc(doc)}
                        className={cn(
                          "group p-3 rounded-2xl cursor-pointer transition-all border",
                          activeDoc?.id === doc.id 
                            ? "bg-indigo-50/50 border-indigo-100 shadow-sm" 
                            : "bg-white border-transparent hover:border-slate-100 hover:shadow-xs"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-xs transition-transform group-hover:scale-105",
                            getDocTypeColor(doc.type)
                          )}>
                            <FileText size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-[10px] font-black truncate leading-tight",
                              activeDoc?.id === doc.id ? "text-indigo-950" : "text-slate-700"
                            )}>
                              {doc.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 opacity-70">
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{doc.type}</span>
                              <span className="text-[8px] font-bold text-slate-400">• {new Date(doc.uploaded_at || doc.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button 
                              title="Download"
                              onClick={() => window.open(resolveDocUrl(doc.url), '_blank')}
                              className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                            >
                              <Download size={14} />
                            </button>
                            {userRole !== "viewer" && (
                              <button 
                                title="Remove Document"
                                onClick={(e) => handleRemoveDoc(doc.id, e)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {userRole !== "viewer" && (
                  <div className="p-6 bg-white border-t border-slate-100 drop-shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                    <input 
                      type="file" 
                      id="doc-upload" 
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                    <Button 
                      onClick={() => document.getElementById('doc-upload')?.click()}
                      className="w-full bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl h-11 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95 gap-3"
                    >
                      <PlusIcon size={14} />
                      Add New Attachment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>

    {/* Upload Metadata Dialog */}
    <Dialog open={!!uploadingFile} onOpenChange={(open) => !open && setUploadingFile(null)}>
      <DialogContent className="max-w-lg p-0 bg-white rounded-2xl shadow-3xl border border-slate-200 top-[50%] translate-y-[-50%] ring-0 focus-visible:ring-0 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
               <FileText size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white leading-none">Finalize Transmission</h3>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em] mt-1.5">Asset Classification Portal</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/10">
            <Shield size={12} className="text-blue-400" />
            <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">B2B Secured</span>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* File Info Entry */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Label</label>
                <span className="text-[9px] font-bold text-slate-400 uppercase italic">Original: {uploadingFile?.name}</span>
              </div>
              <Input 
                value={uploadMetadata.name} 
                onChange={(e) => setUploadMetadata({...uploadMetadata, name: e.target.value})}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-sm focus:bg-white focus:border-blue-600 transition-all shadow-sm ring-0"
                placeholder="Naming Pattern: [DOC_TYPE]_[NAME].pdf"
              />
            </div>

            {!defaultType && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Global Category</label>
                <div className="relative">
                   <select 
                    value={uploadMetadata.type}
                    onChange={(e) => setUploadMetadata({...uploadMetadata, type: e.target.value})}
                    className="w-full h-12 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-slate-700 appearance-none shadow-sm cursor-pointer"
                  >
                    {documentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 flex items-start gap-3">
             <div className="mt-0.5 text-blue-600"><Info size={14} /></div>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
               By proceeding, this document will be indexed across the <b>{txn.txnId}</b> audit trail. Ensure classification matches the physical asset type.
             </p>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <Button variant="ghost" disabled={isUploading} onClick={() => setUploadingFile(null)} className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] h-12 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </Button>
            <Button disabled={isUploading} onClick={finalizeUpload} className="flex-1 bg-slate-900 text-white hover:bg-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] h-12 shadow-xl shadow-slate-200 transition-all active:scale-95">
               {isUploading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-blue-400" />
                    Committing Assets
                  </div>
               ) : "Establish Secure Link"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

function MetadataRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-slate-800 truncate pr-2 group-hover:text-indigo-600 transition-colors uppercase font-mono">{value || "N/A"}</span>
    </div>
  );
}

function FilesIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" /><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" /><path d="M15 2v4.5h4.5" /></svg>
  );
}

function PlusIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  );
}
