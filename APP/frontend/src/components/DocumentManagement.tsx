

import React, { useState, useMemo } from "react";
import { Search, X, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sampleDocuments, documentTypes, samplePOs } from "@/lib/mockData";
import { FilterBar } from "./shared/FilterBar";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";

export default function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPO, setSelectedPO] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewerDoc, setViewerDoc] = useState<any>(null);

  const filteredDocs = useMemo(() => {
    return sampleDocuments.filter((doc) => {
      const matchesSearch = 
        doc.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPO = selectedPO === "all" || doc.poNumber === selectedPO;
      const matchesType = selectedType === "all" || doc.documentType === selectedType;

      return matchesSearch && matchesPO && matchesType;
    });
  }, [searchQuery, selectedPO, selectedType]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPO("all");
    setSelectedType("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Repository</h1>
        <p className="text-slate-500 mt-1">Centralized access to all transaction documents across the procurement lifecycle</p>
      </div>

      {/* Standardized Filter Bar */}
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPO={selectedPO}
        setSelectedPO={setSelectedPO}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        resetFilters={resetFilters}
        samplePOs={samplePOs}
        documentTypes={documentTypes}
        placeholder="Search for PO, GRN, Invoice..."
      />

      {/* Active Filters / Chips */}
      {(selectedPO !== "all" || selectedType !== "all" || searchQuery) && (
        <div className="flex flex-wrap gap-2 items-center animate-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Active Filters:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="bg-slate-900 text-white border-transparent px-3 py-1 rounded-full flex items-center gap-1.5 transition-all">
              <Search className="w-3 h-3" />
              <span className="text-xs font-bold">"{searchQuery}"</span>
              <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setSearchQuery("")} />
            </Badge>
          )}

          {selectedPO !== "all" && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5 transition-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase">PO:</span>
              <span className="text-xs font-bold">{selectedPO}</span>
              <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSelectedPO("all")} />
            </Badge>
          )}

          {selectedType !== "all" && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5 transition-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Type:</span>
              <span className="text-xs font-bold">{documentTypes.find(t => t.id === selectedType)?.name}</span>
              <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSelectedType("all")} />
            </Badge>
          )}

          <button 
            onClick={resetFilters}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider px-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Generic Document Table */}
      <DocumentTable 
        documents={filteredDocs}
        onView={setViewerDoc}
        title="All Operational Documents"
      />

      {/* Document Viewer Modal */}
      <DocumentViewer 
        document={viewerDoc}
        isOpen={!!viewerDoc}
        onClose={() => setViewerDoc(null)}
      />
    </div>
  );
}


