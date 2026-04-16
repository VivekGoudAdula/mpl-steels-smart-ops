
import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { sampleTransactions, samplePOs } from "@/lib/mockData";
import { DocumentTable } from "./shared/DocumentTable";
import { FilterBar } from "./shared/FilterBar";
import DocumentViewer from "./DocumentViewer";
import GRNForm from "./forms/GRNForm";

export default function GRNModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPO, setSelectedPO] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

      return matchesSearch && matchesPO && matchesDate;
    });
  }, [searchQuery, selectedPO, selectedDateRange]);

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
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Management</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Goods Receipt Notes</h1>
          <p className="text-slate-500 font-medium">Verify materials received against purchase orders and weighbridge data.</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <button className="enterprise-button-primary px-8 gap-3 shadow-md shadow-slate-200">
              <Plus className="w-5 h-5 stroke-[3px]" />
              <span>Verify New GRN</span>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
            <div className="bg-white">
              <GRNForm isModal onClose={() => setIsCreateModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>


      {/* Standardized Filter Bar */}
      <div className="enterprise-card border-[#e5e7eb] shadow-sm p-4 rounded-xl bg-white mb-6">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPO={selectedPO}
          setSelectedPO={setSelectedPO}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          resetFilters={resetFilters}
          samplePOs={samplePOs}
          placeholder="Search GRN number or PO..."
        />
      </div>

      {/* Transaction Table */}
      <DocumentTable
        transactions={filteredTransactions}
        onView={setSelectedTransaction}
        title="GRN Transactions"
      />

      <DocumentViewer
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

