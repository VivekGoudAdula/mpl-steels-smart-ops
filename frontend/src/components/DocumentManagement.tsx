import React, { useState, useMemo, useEffect } from "react";
import api from "@/lib/api";
import { documentTypes } from "@/lib/mockData";
import { FilterBar } from "./shared/FilterBar";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

export default function DocumentManagement({ userRole }: { userRole?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPO, setSelectedPO] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/transactions");
      const mapped = res.data.map((t: any) => ({
        id: t._id,
        txnId: t.txn_id,
        poNumber: t.po?.po_number || "-",
        wbNumber: t.wb?.wb_number || "-",
        grnNumber: t.grn?.grn_number || "-",
        invoiceNumber: t.invoice?.invoice_number || "-",
        date: new Date(t.created_at).toLocaleDateString(),
        documents: t.documents || [],
        vendorName: t.po?.vendor_id || "Supplier" // Assuming vendor_id is vendor name for now or fetch elsewhere
      }));
      setTransactions(mapped);
    } catch (error) {
      toast.error("Failed to fetch records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
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
          txn.documents.some((doc: any) => doc.name.toLowerCase().includes(query));
      }
      
      const matchesPO = selectedPO === "all" || txn.poNumber === selectedPO;
      const matchesType = selectedType === "all" || txn.documents.some((d: any) => d.type === selectedType);

      return matchesSearch && matchesPO && matchesType;
    });
  }, [transactions, searchQuery, selectedPO, selectedType]);

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
          {userRole !== "viewer" && (
            <button className="enterprise-button-primary px-8 gap-3 shadow-md shadow-slate-200">
              <Plus className="w-5 h-5 stroke-[3px]" />
              <span>Create New Record</span>
            </button>
          )}
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
          samplePOs={Array.from(new Set(transactions.map(t => t.poNumber))).filter(p => p !== "-").map(p => ({ id: p }))}
          documentTypes={documentTypes}
          placeholder="Search by PO, WB, GRN, Invoice, Vendor..."
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-slate-300 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Secure Repository...</p>
        </div>
      ) : (
        <>
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
            </div>
          </div>

          <div className="enterprise-card p-0 overflow-hidden border border-[#e5e7eb] shadow-md">
            <DocumentTable 
              transactions={filteredTransactions}
              onView={setSelectedTransaction}
              onSuccess={fetchTransactions}
            />
          </div>
        </>
      )}

      {/* Document Viewer Workspace */}
      <DocumentViewer 
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        userRole={userRole}
      />
    </div>
  );
}





