
import React, { useState } from "react";
import { 
  ShoppingCart, 
  ClipboardCheck, 
  ReceiptText, 
  Clock,
  Download,
  TrendingUp,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { sampleDocuments } from "@/lib/mockData";
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
  const [viewerDoc, setViewerDoc] = useState<any>(null);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Executive report downloaded successfully");
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Operational Insights</h1>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Real-time synchronization active for MPL Steels Smart Ops
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="h-12 px-6 rounded-xl bg-white border-slate-200 font-bold hover:bg-slate-50 transition-all group"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />}
            Export Analytics
          </Button>
        </div>
      </div>

      {/* Optimized KPI Cards (Reduced Height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-2-5xl overflow-hidden bg-white/80 backdrop-blur-sm group cursor-pointer">
            <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500", kpi.color)}>
                  <kpi.icon size={20} className="stroke-[2.5]" />
                </div>
                <div className={cn(
                  "flex items-center text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider",
                  kpi.isUp ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                )}>
                  {kpi.isUp ? <TrendingUp size={12} className="mr-1.5" /> : <Clock size={12} className="mr-1.5" />}
                  {kpi.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
                  <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity (Table Style) */}
      <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-8 h-px bg-slate-200"></span>
            Recent Transaction Log
          </h2>
          <Button variant="ghost" className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 rounded-lg">View All History</Button>
        </div>
        <DocumentTable 
          documents={sampleDocuments.slice(0, 10)} 
          onView={setViewerDoc}
          title="Consolidated Multi-Module Activity"
          count={10}
        />
      </div>

      <DocumentViewer 
        document={viewerDoc}
        isOpen={!!viewerDoc}
        onClose={() => setViewerDoc(null)}
      />
    </div>
  );
}
