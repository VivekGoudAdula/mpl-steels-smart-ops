/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Scale,
  ClipboardCheck,
  ReceiptText,
  Files,
  Sparkles,
  ArrowRightLeft,
  Cpu,
  Bot,
  Shield
} from "lucide-react";

import ProcurementModule from "./components/ProcurementModule";
import WeighbridgeModule from "./components/WeighbridgeModule";
import GRNModule from "./components/GRNModule";
import InvoiceModule from "./components/InvoiceModule";
import DocumentManagement from "./components/DocumentManagement";
import AIDocumentAssistant from "./components/AIDocumentAssistant";
import SmartAssistant from "./components/SmartAssistant";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import DocumentComparison from "./components/DocumentComparison";
import ProcessAutomation from "./components/ProcessAutomation";
import VendorsModule from "./components/VendorsModule";
import UserManagement from "./components/UserManagement";
import SettingsModule from "./components/SettingsModule";
import LandingPage from "./components/LandingPage";
import Auth, { UserRole } from "./components/Auth";
import SuperAdminApp from "./components/SuperAdminApp";
import { Toaster } from "@/components/ui/sonner";

type Module = "dashboard" | "procurement" | "weighbridge" | "grn" | "invoice" | "documents" | "comparison" | "automation" | "ai-assistant" | "smart-assistant" | "vendors" | "settings" | "user-management";
type View = "landing" | "login" | "app";

interface UserData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  company_id?: string;
  company_name?: string;
  status?: string;
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<UserData | null>(null);
  const [activeModule, setActiveModule] = useState<Module>("dashboard");

  useEffect(() => {
    // Check if we have a token on load and validate it if needed (not implemented here for simplicity)
  }, []);

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    setView("app");
    setActiveModule("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setView("landing");
  };

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <AnalyticsDashboard user={user as any} />;
      case "procurement": return <ProcurementModule />;
      case "weighbridge": return <WeighbridgeModule />;
      case "grn": return <GRNModule />;
      case "invoice": return <InvoiceModule />;
      case "documents": return <DocumentManagement userRole={user?.role} />;
      case "comparison": return <DocumentComparison />;
      case "automation": return <ProcessAutomation />;
      case "ai-assistant": return <AIDocumentAssistant />;
      case "smart-assistant": return <SmartAssistant />;
      case "vendors": return <VendorsModule />;
      case "settings": return <SettingsModule user={user as any} />;
      case "user-management": return <UserManagement />;
      default: return null;
    }
  };

  if (view === "landing") {
    return <LandingPage onGetStarted={() => setView("login")} onLogin={() => setView("login")} />;
  }

  if (view === "login") {
    return <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setView("landing")} />;
  }

  if (user?.role === "super_admin") {
    return <SuperAdminApp user={user} onLogout={handleLogout} />;
  }

  const isAllowed = (module: Module) => {
    if (!user) return false;
    
    // Viewer vs Editor rules:
    // Actually both editor and viewer can probably see all these UI modules,
    // but the editor can "write" whereas viewer can "read".
    // We will let both see the modules.
    if (user.role === "editor" || user.role === "viewer") {
      if (module === "user-management") return false;
      return true;
    }

    // Legacy support fallback
    if (user.role === "admin") return true;
    const permissions: Record<string, Module[]> = {
      admin: [],
      operations: ["dashboard", "procurement", "weighbridge", "grn", "invoice", "documents", "comparison", "automation", "ai-assistant", "smart-assistant", "vendors", "settings"],
      finance: ["dashboard", "invoice", "documents", "comparison", "automation", "ai-assistant", "settings"]
    };
    return (permissions[user.role] || []).includes(module);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-[#0f172a] h-screen sticky top-0 z-20">
        <div className="p-6 pb-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex items-center gap-3 mb-10 shrink-0 px-2">
            <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/40">
              M
            </div>
            <div>
              <span className="font-bold text-white tracking-tight block leading-none">MPL STEELS</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">SMART OPS</span>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-3">Main Navigation</p>
            {isAllowed("dashboard") && <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeModule === "dashboard"} onClick={() => setActiveModule("dashboard")} />}
            {isAllowed("procurement") && <NavItem icon={<ShoppingCart size={18} />} label="Purchase Orders" active={activeModule === "procurement"} onClick={() => setActiveModule("procurement")} />}
            {isAllowed("weighbridge") && <NavItem icon={<Scale size={18} />} label="Weighbridge" active={activeModule === "weighbridge"} onClick={() => setActiveModule("weighbridge")} />}
            {isAllowed("grn") && <NavItem icon={<ClipboardCheck size={18} />} label="Goods Receipt Notes" active={activeModule === "grn"} onClick={() => setActiveModule("grn")} />}
            {isAllowed("invoice") && <NavItem icon={<ReceiptText size={18} />} label="Invoices" active={activeModule === "invoice"} onClick={() => setActiveModule("invoice")} />}
            {isAllowed("documents") && <NavItem icon={<Files size={18} />} label="Documents" active={activeModule === "documents"} onClick={() => setActiveModule("documents")} />}
          </nav>

          <div className="mt-8 pb-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-3">Intelligence</p>
            {isAllowed("comparison") && <NavItem icon={<ArrowRightLeft size={18} />} label="Comparison" active={activeModule === "comparison"} onClick={() => setActiveModule("comparison")} />}
            {isAllowed("automation") && <NavItem icon={<Cpu size={18} />} label="Automation" active={activeModule === "automation"} onClick={() => setActiveModule("automation")} />}
            {isAllowed("ai-assistant") && <NavItem icon={<Sparkles size={18} />} label="Co-Pilot" active={activeModule === "ai-assistant"} onClick={() => setActiveModule("ai-assistant")} />}
            {isAllowed("vendors") && <NavItem icon={<Users size={18} />} label="Vendors" active={activeModule === "vendors"} onClick={() => setActiveModule("vendors")} />}
            <div className="h-px bg-slate-800/50 my-4 mx-3" />
            {isAllowed("user-management") && <NavItem icon={<Shield size={18} />} label="Access Control" active={activeModule === "user-management"} onClick={() => setActiveModule("user-management")} />}
            {isAllowed("settings") && <NavItem icon={<Settings size={18} />} label="Basic Settings" active={activeModule === "settings"} onClick={() => setActiveModule("settings")} />}
          </div>
        </div>
        
        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 h-10 rounded-md transition-all text-[10px] font-black uppercase tracking-widest w-full active:scale-95 group border border-transparent hover:border-slate-700"
          >
            <LogOut size={16} />
            Termination
          </button>
        </div>
      </aside>


      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative bg-[#f8fafc]">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-8 sticky top-0 bg-white z-50 border-b border-slate-200 shadow-sm">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by keyword, transaction ID or record name..." 
              className="w-full h-9 !pl-11 pr-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-md text-xs transition-all outline-none font-medium placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all border border-slate-200">
              <Bell size={16} />
            </button>
            <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all border border-slate-200">
              <Files size={16} />
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            
            <div className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-md transition-all cursor-pointer h-9 group">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-wide">{user?.name}</span>
                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-tight mt-1">
                  {user?.role} - Active
                </span>
              </div>
              <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 text-xs font-black shadow-sm group-hover:border-blue-400/50 transition-colors">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <button onClick={handleLogout} className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all ml-1">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {renderModule()}
          </div>
        </div>
      </main>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all w-full text-left relative group ${
        active 
          ? "bg-white/10 text-white shadow-sm" 
          : "text-blue-200/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={`text-inherit ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
        {icon}
      </span>
      {label}
      {active && (
        <div className="absolute left-0 w-1 h-5 bg-blue-400 rounded-r-full"></div>
      )}
    </button>
  );
}

