
import React, { useState, useMemo, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { DocumentTable } from "./shared/DocumentTable";
import { FilterBar } from "./shared/FilterBar";
import DocumentViewer from "./DocumentViewer";
import { toast } from "sonner";
import { fetchInvoices } from "../services/erpApi";

export default function InvoiceModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInvoices();
      const mapped = data.map((t: any) => {
        const generatedTxnId = t.txn_id || (t.po_number ? `TXN-${t.po_number}` : `TXN-UNLINKED`);
        return {
          id: generatedTxnId,
          txnId: generatedTxnId,
          poNumber: t.po_number || "-",
          wbNumber: t.wb_number || "-",
          grnNumber: t.grn_number || "-",
          invoiceNumber: t.invoice_number || "-",
          date: new Date(t.date).toLocaleDateString(),
          rawDate: t.date,
          documents: t.documents || [],
        };
      });
      setTransactions(mapped);
    } catch (error) {
      toast.error("Failed to fetch Invoice transactions from ERP");
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
      
      // 2. DATE FILTERS
      let matchesDate = true;
      if (txn.rawDate) {
        const docDate = new Date(txn.rawDate).setHours(0, 0, 0, 0);
        if (startDate) {
          const start = new Date(startDate).setHours(0, 0, 0, 0);
          if (docDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate).setHours(0, 0, 0, 0);
          if (docDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [transactions, searchQuery, startDate, endDate]);

  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
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
          <p className="text-slate-500 font-medium">Manage supplier invoices and track payment status across the supply chain from ERP.</p>
        </div>
      </div>
      <div className="enterprise-card border-[#e5e7eb] shadow-sm p-4 rounded-xl bg-white mb-6">
        <FilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          resetFilters={resetFilters}
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
          variant="INV"
        />
      )}

      <DocumentViewer 
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        defaultType="INV"
      />
    </div>
  );
}
