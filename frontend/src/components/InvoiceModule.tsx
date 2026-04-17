
import React, { useState, useMemo, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { DocumentTable } from "./shared/DocumentTable";
import { FilterBar } from "./shared/FilterBar";
import DocumentViewer from "./DocumentViewer";
import InvoiceForm from "./forms/InvoiceForm";
import { toast } from "sonner";

export default function InvoiceModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPO, setSelectedPO] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      }));
      setTransactions(mapped);
    } catch (error) {
      toast.error("Failed to fetch transactions");
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

      // 2. DATE FILTERS
      let matchesDate = true;
      if (selectedDateRange !== "all" && txn.date) {
        // ... (can add date filter logic if needed)
      }

      return matchesSearch && matchesPO && matchesDate;
    });
  }, [transactions, searchQuery, selectedPO, selectedDateRange]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPO("all");
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
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Financial Operations</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Accounts Payable</h1>
          <p className="text-slate-500 font-medium">Manage supplier invoices and track payment status across the supply chain.</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger className="enterprise-button-primary px-8 gap-3 shadow-md shadow-slate-200 flex items-center">
            <Plus className="w-5 h-5 stroke-[3px]" />
            <span>Process New Invoice</span>
          </DialogTrigger>

          <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-[95vw] h-[92vh] max-h-[92vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
            <div className="bg-white w-full h-full min-h-full flex flex-col">
              <InvoiceForm 
                isModal 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={() => {
                  setIsCreateModalOpen(false);
                  fetchTransactions();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>


      <div className="enterprise-card border-[#e5e7eb] shadow-sm p-4 rounded-xl bg-white mb-6">
        <FilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPO={selectedPO}
          setSelectedPO={setSelectedPO}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          resetFilters={resetFilters}
          samplePOs={Array.from(new Set(transactions.map(t => t.poNumber))).filter(p => p !== "-").map(p => ({ id: p }))}
          placeholder="Search invoice number or PO..."
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-slate-300 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Financial Database...</p>
        </div>
      ) : (
        <DocumentTable 
          transactions={filteredTransactions}
          onView={setSelectedTransaction}
          title="Invoice Transactions"
        />
      )}

      <DocumentViewer 
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

