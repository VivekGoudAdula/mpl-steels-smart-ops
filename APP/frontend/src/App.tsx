
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  Bot
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
import SettingsModule from "./components/SettingsModule";
import LandingPage from "./components/LandingPage";
import Auth, { UserRole } from "./components/Auth";
import { Toaster } from "@/components/ui/sonner";

type Module = "dashboard" | "procurement" | "weighbridge" | "grn" | "invoice" | "documents" | "comparison" | "automation" | "ai-assistant" | "smart-assistant" | "vendors" | "settings";
type View = "landing" | "login" | "signup" | "app";

interface UserData {
  name: string;
  email: string;
  role: UserRole;
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<UserData | null>(null);
  const [activeModule, setActiveModule] = useState<Module>("dashboard");

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    setView("app");
    setActiveModule("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <AnalyticsDashboard />;
      case "procurement": return <ProcurementModule />;
      case "weighbridge": return <WeighbridgeModule />;
      case "grn": return <GRNModule />;
      case "invoice": return <InvoiceModule />;
      case "documents": return <DocumentManagement />;
      case "comparison": return <DocumentComparison />;
      case "automation": return <ProcessAutomation />;
      case "ai-assistant": return <AIDocumentAssistant />;
      case "smart-assistant": return <SmartAssistant />;
      case "vendors": return <VendorsModule />;
      case "settings": return <SettingsModule user={user} />;
      default: return null;
    }
  };

  if (view === "landing") {
    return <LandingPage onGetStarted={() => setView("signup")} onLogin={() => setView("login")} />;
  }

  if (view === "login" || view === "signup") {
    return <Auth initialMode={view} onAuthSuccess={handleAuthSuccess} onBack={() => setView("landing")} />;
  }

  const isAllowed = (module: Module) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    const permissions: Record<UserRole, Module[]> = {
      admin: [],
      operations: ["dashboard", "procurement", "weighbridge", "grn", "invoice", "documents", "comparison", "automation", "ai-assistant", "smart-assistant", "vendors"],
      finance: ["dashboard", "invoice", "documents", "comparison", "automation", "ai-assistant"]
    };
    return permissions[user.role].includes(module);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900 industrial-grid">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 bg-white h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex items-center gap-3 mb-10 shrink-0">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block leading-none">MPL Steels</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1 block">Industrial Intelligence</span>
            </div>
          </div>
          
          <nav className="space-y-1.5 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
            {isAllowed("dashboard") && <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeModule === "dashboard"} onClick={() => setActiveModule("dashboard")} />}
            {isAllowed("procurement") && <NavItem icon={<ShoppingCart size={20} />} label="Procurement" active={activeModule === "procurement"} onClick={() => setActiveModule("procurement")} />}
            {isAllowed("weighbridge") && <NavItem icon={<Scale size={20} />} label="Weighbridge" active={activeModule === "weighbridge"} onClick={() => setActiveModule("weighbridge")} />}
            {isAllowed("grn") && <NavItem icon={<ClipboardCheck size={20} />} label="GRN" active={activeModule === "grn"} onClick={() => setActiveModule("grn")} />}
            {isAllowed("invoice") && <NavItem icon={<ReceiptText size={20} />} label="Invoices" active={activeModule === "invoice"} onClick={() => setActiveModule("invoice")} />}
            {isAllowed("documents") && <NavItem icon={<Files size={20} />} label="Documents" active={activeModule === "documents"} onClick={() => setActiveModule("documents")} />}
          </nav>

          <div className="mt-auto pt-10 pb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">System</p>
            {isAllowed("comparison") && <NavItem icon={<ArrowRightLeft size={20} />} label="Comparison" active={activeModule === "comparison"} onClick={() => setActiveModule("comparison")} />}
            {isAllowed("automation") && <NavItem icon={<Cpu size={20} />} label="Automation" active={activeModule === "automation"} onClick={() => setActiveModule("automation")} />}
            {isAllowed("ai-assistant") && <NavItem icon={<Sparkles size={20} />} label="AI Assistant" active={activeModule === "ai-assistant"} onClick={() => setActiveModule("ai-assistant")} />}
            {isAllowed("smart-assistant") && <NavItem icon={<Bot size={20} />} label="Smart Agent" active={activeModule === "smart-assistant"} onClick={() => setActiveModule("smart-assistant")} />}
            {isAllowed("vendors") && <NavItem icon={<Users size={20} />} label="Vendors" active={activeModule === "vendors"} onClick={() => setActiveModule("vendors")} />}
            <NavItem icon={<Settings size={20} />} label="Settings" active={activeModule === "settings"} onClick={() => setActiveModule("settings")} />
          </div>
        </div>
        
        <div className="p-8 border-t border-slate-100 bg-white">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl transition-all text-xs font-black uppercase tracking-widest w-full border border-slate-200 hover:border-red-100 shadow-sm active:scale-95 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 sticky top-0 glass z-50 border-b border-slate-200/50">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" size={16} />
            <input 
              type="text" 
              placeholder="Search across transactions, documents, or vendors..." 
              className="w-full h-12 pl-12 pr-4 py-2.5 bg-slate-100/50 border border-slate-200/20 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl text-sm font-medium transition-all outline-none placeholder:text-slate-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
              <span className="text-[10px] font-bold text-slate-400">Ctrl</span>
              <span className="text-[10px] font-bold text-slate-400">K</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="h-12 w-12 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative border border-slate-100 shadow-sm active:scale-95">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            
            <div className="h-10 w-px bg-slate-200 mx-1"></div>
            
            <div className="flex items-center gap-3 p-1 pr-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group h-12">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-[1.05]">
                {user?.name.charAt(0) || "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-none">{user?.name || "User"}</span>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 opacity-70">
                  {user?.role || "Operations"} Access
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-10 bg-[#FBFBFC]">
          <div className="max-w-7xl mx-auto">
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 w-full text-left relative group ${
        active 
          ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </span>
      {label}
      {active && (
        <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></span>
      )}
    </button>
  );
}
