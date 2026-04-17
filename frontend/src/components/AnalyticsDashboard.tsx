import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  ReceiptText, 
  Clock,
  Download,
  Zap,
  Loader2,
  Files
} from "lucide-react";
import { toast } from "sonner";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";
import { cn } from "@/lib/utils";
import { fetchPOs, fetchWB, fetchGRN, fetchInvoices } from "../services/erpApi";

export default function AnalyticsDashboard({ user }: { user?: any }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total_transactions: 0,
    total_pos: 0,
    total_invoices: 0,
    total_documents: 0
  });

  /**
   * Fetch all ERP data and calculate consolidated KPIs and recent activity log.
   */
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [pos, wbs, grns, invoices] = await Promise.all([
        fetchPOs(),
        fetchWB(),
        fetchGRN(),
        fetchInvoices(),
      ]);

      // Merge into a txn map for activity log
      const txnMap = new Map<string, any>();
      const processItems = (items: any[]) => {
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
              documents: t.documents || [],
            });
          } else {
            const existing = txnMap.get(key);
            if (t.po_number && existing.poNumber === "-") existing.poNumber = t.po_number;
            if (t.wb_number && existing.wbNumber === "-") existing.wbNumber = t.wb_number;
            if (t.grn_number && existing.grnNumber === "-") existing.grnNumber = t.grn_number;
            if (t.invoice_number && existing.invoiceNumber === "-") existing.invoiceNumber = t.invoice_number;
            // Document merging
            const existingUrls = new Set(existing.documents.map((d: any) => d.url));
            (t.documents || []).forEach((doc: any) => {
              if (!existingUrls.has(doc.url)) existing.documents.push(doc);
            });
          }
        });
      };

      processItems(pos);
      processItems(wbs);
      processItems(grns);
      processItems(invoices);

      const allMerged = Array.from(txnMap.values());
      
      // Update KPIs
      setKpis({
        total_transactions: allMerged.length,
        total_pos: pos.length,
        total_invoices: invoices.length,
        total_documents: allMerged.reduce((acc, curr) => acc + (curr.documents?.length || 0), 0)
      });

      // Show top 5 recent
      setTransactions(allMerged.slice(0, 5));
    } catch (error) {
      toast.error("ERP data synchronization failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpiCards = [
    { label: "Total Transactions", value: kpis.total_transactions, icon: Zap, color: "text-amber-600 bg-amber-50" },
    { label: "Purchase Orders", value: kpis.total_pos, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
    { label: "Tax Invoices", value: kpis.total_invoices, icon: ReceiptText, color: "text-purple-600 bg-purple-50" },
    { label: "Total Artifacts", value: kpis.total_documents, icon: Files, color: "text-emerald-600 bg-emerald-50" },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Executive report downloaded successfully");
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-300"></span>
            {user?.company_name || 'Overview & Insights'}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time status of ERP-integrated procurement metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="enterprise-button-secondary h-12 flex items-center gap-2 group"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <div className="bg-slate-100 p-1.5 rounded-lg group-hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4 text-slate-900" />
              </div>
            )}
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 2. Structured KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="enterprise-card bg-white p-6 flex flex-col justify-between hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", kpi.color.replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-'))}>
                  <kpi.icon size={18} className="stroke-[2.5]" />
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{kpi.label}</p>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-slate-200" />
                ) : (
                  kpi.value
                )}
              </h3>
              <div className="flex items-center text-[10px] font-bold px-2 py-1 rounded-md text-slate-500 bg-slate-50 uppercase tracking-widest">
                ERP Sync
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Table Section */}
      <div className="flex items-center justify-between mt-8 mb-2">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Activity (Lighthouse ERP)</h2>
      </div>

      {isLoading ? (
        <div className="enterprise-card py-20 flex flex-col items-center justify-center gap-4 bg-white/50 border-dashed">
          <Loader2 className="w-8 h-8 animate-spin text-blue-200" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Indexing ERP Records...</p>
        </div>
      ) : (
        <div className="enterprise-card p-0 overflow-hidden border border-[#e5e7eb] shadow-md">
          <DocumentTable 
            transactions={transactions} 
            onView={setSelectedTransaction}
          />
        </div>
      )}

      <DocumentViewer 
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
