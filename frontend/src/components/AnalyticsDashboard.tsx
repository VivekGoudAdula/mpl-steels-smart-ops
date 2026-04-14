
import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  ClipboardCheck, 
  ReceiptText, 
  IndianRupee, 
  Clock,
  Download,
  Filter,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MoreHorizontal,
  FileText,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock Data
const kpiData = [
  { label: "Total POs", value: "124", trend: "+12%", isUp: true, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
  { label: "Total GRNs", value: "98", trend: "+8%", isUp: true, icon: ClipboardCheck, color: "text-emerald-600 bg-emerald-50" },
  { label: "Total Invoices", value: "82", trend: "-3%", isUp: false, icon: ReceiptText, color: "text-purple-600 bg-purple-50" },
  { label: "Total Revenue", value: "₹45.2L", trend: "+15%", isUp: true, icon: IndianRupee, color: "text-amber-600 bg-amber-50" },
  { label: "Pending Payments", value: "₹12.8L", trend: "+5%", isUp: false, icon: Clock, color: "text-red-600 bg-red-50" },
];

const revenueCostData = [
  { month: "Jan", revenue: 4000, cost: 2400 },
  { month: "Feb", revenue: 3000, cost: 1398 },
  { month: "Mar", revenue: 2000, cost: 9800 },
  { month: "Apr", revenue: 2780, cost: 3908 },
  { month: "May", revenue: 1890, cost: 4800 },
  { month: "Jun", revenue: 2390, cost: 3800 },
  { month: "Jul", revenue: 3490, cost: 4300 },
];

const procurementData = [
  { type: "Steel Coils", qty: 400, cost: 240000 },
  { type: "Iron Plates", qty: 300, cost: 139800 },
  { type: "Alloy Bars", qty: 200, cost: 98000 },
  { type: "Scrap Metal", qty: 278, cost: 39080 },
  { type: "Chemicals", qty: 189, cost: 48000 },
];

const operationalStatusData = [
  { name: "Pending POs", value: 45, color: "#3b82f6" },
  { name: "Completed GRNs", value: 30, color: "#10b981" },
  { name: "Pending Invoices", value: 25, color: "#f59e0b" },
];

const recentActivity = [
  { id: "PO-1234", type: "PO", vendor: "Tata Steel Ltd", amount: "₹2,45,000", status: "Approved", date: "2024-03-15" },
  { id: "GRN-9921", type: "GRN", vendor: "JSW Steels", amount: "12.5 Tons", status: "Verified", date: "2024-03-14" },
  { id: "INV-0421", type: "Invoice", vendor: "Essar Steel", amount: "₹1,25,000", status: "Pending", date: "2024-03-13" },
  { id: "PO-1235", type: "PO", vendor: "Steel Authority", amount: "₹4,10,000", status: "Draft", date: "2024-03-12" },
];

const aiInsights = [
  { 
    title: "Procurement Cost Alert", 
    description: "Procurement cost increased by 12% this month primarily due to rising alloy prices.",
    impact: "High",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
    action: "Review Vendor Contracts"
  },
  { 
    title: "Operational Bottleneck", 
    description: "Delayed GRNs are affecting the invoice cycle, causing a 4-day lag in payment processing.",
    impact: "Medium",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    action: "Optimize GRN Workflow"
  },
  { 
    title: "Optimization Opportunity", 
    description: "Optimizing vendor selection for Steel Coils can increase revenue by 15–20% next quarter.",
    impact: "Positive",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    action: "View Vendor Analytics"
  }
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Executive report downloaded successfully", {
        description: "MPL_Steels_Dashboard_Report.pdf is ready."
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-slate-900 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Overview</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-md leading-relaxed">Real-time intelligence across procurement, logistics, and financial operations for MPL Steels.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400 mr-3" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="border-none shadow-none p-0 h-auto focus:ring-0 text-sm font-bold text-slate-700">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            className="bg-slate-900 text-white hover:bg-slate-800 border-none rounded-2xl px-6 h-11 font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Generating..." : "Export Report"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <kpi.icon size={64} />
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl shadow-inner", kpi.color)}>
                  <kpi.icon size={24} />
                </div>
                <div className={cn(
                  "flex items-center text-[10px] font-bold px-2 py-1 rounded-full border",
                  kpi.isUp ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-600 bg-red-50 border-red-100"
                )}>
                  {kpi.isUp ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                  {kpi.trend}
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 text-data">{kpi.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue vs Cost Chart */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Financial Performance</CardTitle>
              <p className="text-xs text-slate-400 mt-1 font-medium">Revenue vs Procurement Cost Trend</p>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50">
              <MoreHorizontal size={20} className="text-slate-400" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 pt-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueCostData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="top" align="right" height={40} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Gross Revenue"
                    stroke="#0F172A" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    name="Procurement Cost"
                    stroke="#EF4444" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="p-8 pb-4 relative z-10">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              AI Intelligence
            </CardTitle>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active Monitoring</p>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-5 relative z-10">
            {aiInsights.map((insight, i) => (
              <div key={i} className={cn("p-5 rounded-2xl border transition-all hover:bg-white/5 cursor-pointer group", insight.color)}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold tracking-tight">{insight.title}</h4>
                  <Badge variant="outline" className="text-[9px] font-black uppercase border-current px-2 py-0.5 rounded-full">{insight.impact}</Badge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{insight.description}</p>
                <div className="flex items-center text-[10px] font-black uppercase tracking-wider text-blue-400 group-hover:text-blue-300 transition-colors">
                  {insight.action}
                  <ArrowUpRight size={12} className="ml-1.5" />
                </div>
              </div>
            ))}
            <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none mt-4 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20">
              Launch Intelligence Hub
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Procurement Analysis */}
        <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-bold text-slate-900">Material Procurement</CardTitle>
            <p className="text-xs text-slate-400 mt-1 font-medium">Quantity Analysis by Material Category</p>
          </CardHeader>
          <CardContent className="p-8 pt-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={procurementData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="4 4" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="type" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                  />
                  <Bar 
                    dataKey="qty" 
                    name="Quantity (Tons)"
                    fill="#0F172A" 
                    radius={[0, 8, 8, 0]} 
                    barSize={24}
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Operational Status */}
        <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-bold text-slate-900">Operational Health</CardTitle>
            <p className="text-xs text-slate-400 mt-1 font-medium">Workflow Status Distribution</p>
          </CardHeader>
          <CardContent className="p-8 pt-6 flex flex-col md:flex-row items-center gap-12">
            <div className="h-[240px] w-[240px] shrink-0 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">100%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitored</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={operationalStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={10}
                    dataKey="value"
                    animationDuration={2000}
                  >
                    {operationalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-6 w-full">
              {operationalStatusData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 text-data">{item.value}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-slate-50">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Live Transaction Feed</CardTitle>
            <p className="text-xs text-slate-400 mt-1 font-medium">Real-time updates from all operational modules</p>
          </div>
          <Button variant="outline" className="text-slate-900 font-bold text-xs rounded-xl border-slate-200 hover:bg-slate-50 px-6">
            View Audit Log
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reference ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Volume / Value</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentActivity.map((activity, i) => (
                  <tr key={i} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                    <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">{activity.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          activity.type === "PO" ? "bg-blue-50 text-blue-600" : 
                          activity.type === "GRN" ? "bg-emerald-50 text-emerald-600" : 
                          "bg-purple-50 text-purple-600"
                        )}>
                          {activity.type === "PO" ? <ShoppingCart size={14} /> : 
                           activity.type === "GRN" ? <ClipboardCheck size={14} /> : 
                           <ReceiptText size={14} />}
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700">{activity.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-900">{activity.vendor}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900 text-data">{activity.amount}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-400">{activity.date}</td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2",
                        activity.status === "Approved" || activity.status === "Verified" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"
                      )}>
                        {activity.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
