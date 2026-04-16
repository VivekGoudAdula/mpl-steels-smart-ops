import React, { useState, useMemo } from "react";
import { sampleTransactions, documentTypes, samplePOs } from "@/lib/mockData";
import { FilterBar } from "./shared/FilterBar";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";

import { Plus } from "lucide-react";

export default function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPO, setSelectedPO] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const filteredTransactions = useMemo(() => {
    return sampleTransactions.filter((txn) => {
      // 1. GLOBAL SEARCH
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch = 
          (txn.txnId && txn.txnId.toLowerCase().includes(query)) ||
          (txn.poNumber && txn.poNumber.toLowerCase().includes(query)) ||
          (txn.wbNumber && txn.wbNumber.toLowerCase().includes(query)) ||
          (txn.grnNumber && txn.grnNumber.toLowerCase().includes(query)) ||
          (txn.invoiceNumber && txn.invoiceNumber.toLowerCase().includes(query)) ||
          txn.documents.some(doc => doc.name.toLowerCase().includes(query));
      }
      
      const matchesPO = selectedPO === "all" || txn.poNumber === selectedPO;
      const matchesType = selectedType === "all" || txn.documents.some(d => d.type === selectedType);

      // 2. DATE FILTERS
      let matchesDate = true;
      if (selectedDateRange !== "all" && txn.date) {
        const docDate = new Date(txn.date).getTime();
        const now = new Date("2024-04-16").getTime();
        const diffInDays = (now - docDate) / (1000 * 3600 * 24);
        
        if (selectedDateRange === "7d") matchesDate = diffInDays <= 7;
        else if (selectedDateRange === "30d") matchesDate = diffInDays <= 30;
        else if (selectedDateRange === "90d") matchesDate = diffInDays <= 90;
      }

      return matchesSearch && matchesPO && matchesType && matchesDate;
    });
  }, [searchQuery, selectedPO, selectedType, selectedDateRange]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPO("all");
    setSelectedType("all");
    setSelectedDateRange("all");
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 fill-none stroke-current stroke-2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Setup & Configuration</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Document Repository</h1>
          <p className="text-slate-500 font-medium">Configure and manage layouts for your business transactions.</p>
        </div>
        <div className="flex items-center">
          <button className="enterprise-button-primary px-8 gap-3 shadow-md shadow-slate-200">
            <Plus className="w-5 h-5 stroke-[3px]" />
            <span>Create New Record</span>
          </button>
        </div>
      </div>


      {/* 2. Filters Section (Inside Card) */}
      <div className="enterprise-card border-[#e5e7eb] shadow-sm bg-white">
        <FilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPO={selectedPO}
          setSelectedPO={setSelectedPO}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          resetFilters={resetFilters}
          samplePOs={samplePOs}
          documentTypes={documentTypes}
          placeholder="Search by PO, WB, GRN, Invoice, Vendor..."
        />
      </div>

      {/* 3. Stats & Extra Actions Row */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{filteredTransactions.length} Transactions Found</span>
          </div>
          
          {(selectedPO !== "all" || selectedType !== "all" || selectedDateRange !== "all" || searchQuery) && (
            <div className="flex gap-2 items-center">
              <span className="w-1 h-3 bg-gray-300 rounded-full"></span>
              <button 
                onClick={resetFilters} 
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button className="enterprise-button-secondary px-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Export CSV</span>
          </button>
          <button className="enterprise-button-secondary px-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">View History</span>
          </button>
        </div>
      </div>


      {/* 4. Table Section (Inside Card) */}
      <div className="enterprise-card p-0 overflow-hidden border border-[#e5e7eb] shadow-md">
        <DocumentTable 
          transactions={filteredTransactions}
          onView={setSelectedTransaction}
        />
      </div>

      {/* Document Viewer Workspace */}
      <DocumentViewer 
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}





