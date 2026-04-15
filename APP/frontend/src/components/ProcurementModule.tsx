
import React, { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger
} from "@/components/ui/dialog";
import { sampleDocuments, samplePOs, documentTypes } from "@/lib/mockData";
import { DocumentTable } from "./shared/DocumentTable";
import { FilterBar } from "./shared/FilterBar";
import DocumentViewer from "./DocumentViewer";
import PurchaseOrderForm from "./forms/PurchaseOrderForm";

export default function ProcurementModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPO, setSelectedPO] = useState("all");
  const [viewerDoc, setViewerDoc] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const poDocuments = useMemo(() => {
    return sampleDocuments.filter(doc => doc.documentType === "PO");
  }, []);

  const filteredDocs = useMemo(() => {
    return poDocuments.filter((doc) => {
      const matchesSearch = 
        doc.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPO = selectedPO === "all" || doc.poNumber === selectedPO;

      return matchesSearch && matchesPO;
    });
  }, [searchQuery, selectedPO, poDocuments]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPO("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Procurement</h1>
          <p className="text-slate-500 mt-1">Manage and track all purchase orders and vendor procurement documentation</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 h-12 font-bold shadow-lg shadow-slate-200 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Create Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
            <div className="p-1">
              <PurchaseOrderForm isModal onClose={() => setIsCreateModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Standardized Filter Bar */}
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPO={selectedPO}
        setSelectedPO={setSelectedPO}
        resetFilters={resetFilters}
        samplePOs={samplePOs}
        placeholder="Search PO number or keyword..."
      />

      {/* Generic Document Table */}
      <DocumentTable 
        documents={filteredDocs}
        onView={setViewerDoc}
        title="Purchase Orders"
      />

      <DocumentViewer 
        document={viewerDoc}
        isOpen={!!viewerDoc}
        onClose={() => setViewerDoc(null)}
      />
    </div>
  );
}
