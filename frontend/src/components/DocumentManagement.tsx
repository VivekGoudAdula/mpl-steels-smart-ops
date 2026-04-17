
import React, { useState, useMemo, useEffect } from "react";
import { documentTypes } from "@/lib/mockData";
import { FilterBar } from "./shared/FilterBar";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { fetchPOs, fetchWB, fetchGRN, fetchInvoices } from "../services/erpApi";

export default function DocumentManagement({ userRole }: { userRole?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllTransactions = async () => {
    setIsLoading(true);
    try {
      const [pos, wbs, grns, invoices] = await Promise.all([
        fetchPOs(),
        fetchWB(),
        fetchGRN(),
        fetchInvoices(),
      ]);

      const txnMap = new Map<string, any>();

      const upsert = (items: any[]) => {
        items.forEach((t) => {
          const key = t.txn_id || (t.po_number ? `TXN-${t.po_number}` : `TXN-UNLINKED`);
          if (!txnMap.has(key)) {
            txnMap.set(key, {
              id: key,
              txnId: key,
              poNumber: t.po_number || "-",
              wbNumber: t.wb_number || "-",
              grnNumber: t.grn_number || "-",
              invoiceNumber: t.invoice_number || "-",
              date: t.date ? new Date(t.date).toLocaleDateString() : "-",
              rawDate: t.date,
              documents: t.documents ? [...t.documents] : [],
            });
          } else {
            const existing = txnMap.get(key);
            if (t.po_number && existing.poNumber === "-") existing.poNumber = t.po_number;
            if (t.wb_number && existing.wbNumber === "-") existing.wbNumber = t.wb_number;
            if (t.grn_number && existing.grnNumber === "-") existing.grnNumber = t.grn_number;
            if (t.invoice_number && existing.invoiceNumber === "-") existing.invoiceNumber = t.invoice_number;
            
            const existingUrls = new Set(existing.documents.map((d: any) => d.url));
            (t.documents || []).forEach((doc: any) => {
              if (!existingUrls.has(doc.url)) {
                existing.documents.push(doc);
                existingUrls.add(doc.url);
              }
            });
          }
        });
      };

      upsert(pos);
      upsert(wbs);
      upsert(grns);
      upsert(invoices);

      setTransactions(Array.from(txnMap.values()));
    } catch (error) {
      toast.error("Failed to fetch consolidated ERP records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch =
          (txn.txnId && txn.txnId.toLowerCase().includes(query)) ||
          (txn.poNumber && txn.poNumber.toLowerCase().includes(query)) ||
          (txn.wbNumber && txn.wbNumber.toLowerCase().includes(query)) ||
          (txn.grnNumber && txn.grnNumber.toLowerCase().includes(query)) ||
          (txn.invoiceNumber && txn.invoiceNumber.toLowerCase().includes(query)) ||
          txn.documents.some((doc: any) => doc.name?.toLowerCase().includes(query));
      }

      const matchesType =
        selectedType === "all" ||
        txn.documents.some((d: any) => d.type === selectedType);

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

      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchQuery, selectedType, startDate, endDate]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 fill-none stroke-current stroke-2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">All Modules</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Document Repository</h1>
          <p className="text-slate-500 font-medium">
            Consolidated view of all PO, WB, GRN, and Invoice transactions with their documents.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="enterprise-card border-[#e5e7eb] shadow-sm bg-white p-4">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          resetFilters={resetFilters}
          documentTypes={documentTypes}
          placeholder="Search by PO, WB, GRN, Invoice..."
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
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  {filteredTransactions.length} Transactions Found
                </span>
              </div>
              {(selectedType !== "all" || startDate || endDate || searchQuery) && (
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
              onSuccess={fetchAllTransactions}
            />
          </div>
        </>
      )}

      {/* Document Viewer — no defaultType here so user can pick classification */}
      <DocumentViewer
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        userRole={userRole}
      />
    </div>
  );
}
