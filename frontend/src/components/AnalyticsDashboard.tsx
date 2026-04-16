
import React, { useState } from "react";
import { 
  ShoppingCart, 
  ClipboardCheck, 
  ReceiptText, 
  Clock,
  Download,
  TrendingUp,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { sampleTransactions } from "@/lib/mockData";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";
import { cn } from "@/lib/utils";

// Mock KPIs
const kpiData = [
  { label: "Total POs", value: "124", trend: "+12%", isUp: true, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
  { label: "Pending GRNs", value: "18", trend: "+5%", isUp: true, icon: ClipboardCheck, color: "text-emerald-600 bg-emerald-50" },
  { label: "Total Invoices", value: "82", trend: "-3%", isUp: false, icon: ReceiptText, color: "text-purple-600 bg-purple-50" },
  { label: "Active Transactions", value: "45", trend: "+15%", isUp: true, icon: Zap, color: "text-amber-600 bg-amber-50" },
];

export default function AnalyticsDashboard() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

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
            Overview & Insights
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time status of procurement metrics and transaction logs.</p>
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
        {kpiData.map((kpi, i) => (
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
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{kpi.value}</h3>
              <div className={cn(
                "flex items-center text-[11px] font-bold px-2 py-1 rounded-md",
                kpi.isUp ? "text-green-700 bg-green-50" : "text-amber-700 bg-amber-50"
              )}>
                {kpi.isUp ? <TrendingUp size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Table Section (Inside Card) */}
      <div className="flex items-center justify-between mt-8 mb-2">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Activity Log</h2>
        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
          View All
        </button>
      </div>
      <div className="enterprise-card p-0 overflow-hidden border border-[#e5e7eb] shadow-md">
        <DocumentTable 
          transactions={sampleTransactions} 
          onView={setSelectedTransaction}
        />
      </div>

      <DocumentViewer 
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

