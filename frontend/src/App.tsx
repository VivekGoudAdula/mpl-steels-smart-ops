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
  BarChart3, 
  LogOut,
  Bell,
  Search,
  User,
  Scale,
  ClipboardCheck,
  ReceiptText,
  Files,
  Sparkles,
  Zap,
  ArrowRightLeft,
  Cpu,
  Bot
} from "lucide-react";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import WeighbridgeEntry from "./components/WeighbridgeEntry";
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
    // Set default module to dashboard for all roles
    setActiveModule("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <AnalyticsDashboard />;
      case "procurement":
        return <PurchaseOrderForm />;
      case "weighbridge":
        return <WeighbridgeEntry />;
      case "grn":
        return <GRNModule />;
      case "invoice":
        return <InvoiceModule />;
      case "documents":
        return <DocumentManagement />;
      case "comparison":
        return <DocumentComparison />;
      case "automation":
        return <ProcessAutomation />;
      case "ai-assistant":
        return <AIDocumentAssistant />;
      case "smart-assistant":
        return <SmartAssistant />;
      case "vendors":
        return <VendorsModule />;
      case "settings":
        return <SettingsModule user={user} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400">
            <LayoutDashboard size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-medium">Module under development</h2>
            <p className="text-sm">Please select a module from the sidebar.</p>
          </div>
        );
    }
  };

  if (view === "landing") {
    return <LandingPage onGetStarted={() => setView("signup")} onLogin={() => setView("login")} />;
  }

  if (view === "login" || view === "signup") {
    return (
      <Auth 
        initialMode={view} 
        onAuthSuccess={handleAuthSuccess} 
        onBack={() => setView("landing")} 
      />
    );
  }

  // App View
  const isAllowed = (module: Module) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    
    const permissions: Record<UserRole, Module[]> = {
      admin: [], // Handled above
      operations: ["dashboard", "procurement", "weighbridge", "grn", "invoice", "documents", "comparison", "automation", "ai-assistant", "smart-assistant", "vendors"],
      finance: ["dashboard", "invoice", "documents", "comparison", "automation", "ai-assistant"]
    };

    return permissions[user.role].includes(module);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900 industrial-grid">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 bg-white h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight block leading-none">MPL Steels</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1 block">Industrial Intelligence</span>
            </div>
          </div>
          
          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
            {isAllowed("dashboard") && (
              <NavItem 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={activeModule === "dashboard"} 
                onClick={() => setActiveModule("dashboard")}
              />
            )}
            {isAllowed("procurement") && (
              <NavItem 
                icon={<ShoppingCart size={20} />} 
                label="Procurement" 
                active={activeModule === "procurement"} 
                onClick={() => setActiveModule("procurement")}
              />
            )}
            {isAllowed("weighbridge") && (
              <NavItem 
                icon={<Scale size={20} />} 
                label="Weighbridge" 
                active={activeModule === "weighbridge"} 
                onClick={() => setActiveModule("weighbridge")}
              />
            )}
            {isAllowed("grn") && (
              <NavItem 
                icon={<ClipboardCheck size={20} />} 
                label="GRN" 
                active={activeModule === "grn"} 
                onClick={() => setActiveModule("grn")}
              />
            )}
            {isAllowed("invoice") && (
              <NavItem 
                icon={<ReceiptText size={20} />} 
                label="Invoices" 
                active={activeModule === "invoice"} 
                onClick={() => setActiveModule("invoice")}
              />
            )}
            {isAllowed("documents") && (
              <NavItem 
                icon={<Files size={20} />} 
                label="Documents" 
                active={activeModule === "documents"} 
                onClick={() => setActiveModule("documents")}
              />
            )}
            {isAllowed("comparison") && (
              <NavItem 
                icon={<ArrowRightLeft size={20} />} 
                label="Comparison" 
                active={activeModule === "comparison"} 
                onClick={() => setActiveModule("comparison")}
              />
            )}
            {isAllowed("automation") && (
              <NavItem 
                icon={<Cpu size={20} />} 
                label="Automation" 
                active={activeModule === "automation"} 
                onClick={() => setActiveModule("automation")}
              />
            )}
            {isAllowed("ai-assistant") && (
              <NavItem 
                icon={<Sparkles size={20} />} 
                label="AI Assistant" 
                active={activeModule === "ai-assistant"} 
                onClick={() => setActiveModule("ai-assistant")}
              />
            )}
            {isAllowed("smart-assistant") && (
              <NavItem 
                icon={<Bot size={20} />} 
                label="Smart Agent" 
                active={activeModule === "smart-assistant"} 
                onClick={() => setActiveModule("smart-assistant")}
              />
            )}
            {isAllowed("vendors") && (
              <NavItem 
                icon={<Users size={20} />} 
                label="Vendors" 
                active={activeModule === "vendors"} 
                onClick={() => setActiveModule("vendors")}
              />
            )}
            <NavItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={activeModule === "settings"} 
              onClick={() => setActiveModule("settings")}
            />
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden text-white font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate capitalize font-medium tracking-wide">{user?.role} Access</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 py-2.5 rounded-xl transition-all text-xs font-bold w-full border border-transparent hover:border-red-100"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 sticky top-0 glass z-10 border-b border-slate-200/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Quick search (Ctrl + K)" 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border border-transparent focus:border-slate-200 focus:bg-white rounded-2xl text-sm transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider">System Online</span>
            </div>
            
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative border border-slate-100">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200"></div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Platform</span>
              <span className="text-xs font-bold text-slate-900">v2.4.0-stable</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-10">
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

