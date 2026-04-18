import React, { useState, useEffect } from "react";
import { Building2, LogOut, Search, Plus, Users, UserCog, Mail, Briefcase, ArrowLeft, Loader2, CheckCircle, Shield, MoreVertical, CheckCircle2, Activity, FileText, Settings, LayoutDashboard, Zap } from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

interface Company {
  id: string;
  name: string;
  created_at?: string;
  total_users?: number;
  active_users?: number;
  total_documents?: number;
  total_transactions?: number;
  last_activity?: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  emp_id?: string;
  job_title?: string;
  role: string;
  status: string;
}

interface Overview {
  total_companies: number;
  total_users: number;
  total_documents: number;
  total_transactions: number;
  recent_system_activity: any[];
}

interface CompanyDetails {
  users: User[];
  total_documents: number;
  documents_by_type: Record<string, number>;
  total_transactions: number;
  recent_activity: any[];
}

export default function SuperAdminApp({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [view, setView] = useState<"dashboard" | "companies" | "company-details" | "security">("dashboard");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const [newCompany, setNewCompany] = useState({ name: "" });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    emp_id: "",
    job_title: "",
    role: "editor"
  });

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/overview`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setOverview(await res.json());
    } catch (err) {
      toast.error("Failed to load overview");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setCompanies(await res.json());
    } catch (err) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyDetails = async (companyId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies/${companyId}/details`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setCompanyDetails(await res.json());
    } catch (err) {
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (view === "dashboard") fetchOverview();
    if (view === "companies") fetchCompanies();
    if (view === "company-details" && selectedCompany) fetchCompanyDetails(selectedCompany.id);
    if (view === "security") setLoading(false);
  }, [view, selectedCompany]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(newCompany)
      });
      if (res.ok) {
        toast.success("Company created successfully");
        setShowCompanyModal(false);
        setNewCompany({ name: "" });
        if (view === "companies") fetchCompanies();
      } else {
        toast.error("Failed to create company");
      }
    } catch (err) {
      toast.error("Error creating company");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ ...newUser, company_id: selectedCompany.id })
      });
      if (res.ok) {
        toast.success("User created successfully");
        setShowUserModal(false);
        setNewUser({ name: "", email: "", password: "", emp_id: "", job_title: "", role: "editor" });
        fetchCompanyDetails(selectedCompany.id);
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to create user");
      }
    } catch (err) {
      toast.error("Error creating user");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`User marked as ${newStatus}`);
        if (selectedCompany) fetchCompanyDetails(selectedCompany.id);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-[#0f172a] h-screen sticky top-0 z-20 flex flex-col">
        <div className="p-6 pb-4 flex-1">
          <div className="flex items-center gap-3 mb-10 shrink-0 px-2">
            <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/40">
              S
            </div>
            <div>
              <span className="font-bold text-white tracking-tight block leading-none">SUPER ADMIN</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">CONTROL PANEL</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => { setView("dashboard"); setSelectedCompany(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all w-full text-left ${view === "dashboard" ? "bg-white/10 text-white shadow-sm" : "hover:bg-white/5 hover:text-white text-slate-400"}`}
            >
              <LayoutDashboard size={18} /> Overview
              {view === "dashboard" && <div className="absolute left-0 w-1 h-5 bg-blue-400 rounded-r-full"></div>}
            </button>
            <button
              onClick={() => { setView("companies"); setSelectedCompany(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all w-full text-left ${view === "companies" || view === "company-details" ? "bg-white/10 text-white shadow-sm" : "hover:bg-white/5 hover:text-white text-slate-400"}`}
            >
              <Building2 size={18} /> Companies
              {(view === "companies" || view === "company-details") && <div className="absolute left-0 w-1 h-5 bg-blue-400 rounded-r-full"></div>}
            </button>
            <button
              onClick={() => { setView("security"); setSelectedCompany(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all w-full text-left ${view === "security" ? "bg-white/10 text-white shadow-sm" : "hover:bg-white/5 hover:text-white text-slate-400"}`}
            >
              <Shield size={18} /> Security Scope
              {view === "security" && <div className="absolute left-0 w-1 h-5 bg-blue-400 rounded-r-full"></div>}
            </button>
          </nav>
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 h-10 rounded-md transition-all text-[10px] font-black uppercase tracking-widest w-full active:scale-95 group border border-transparent hover:border-slate-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        <header className="h-14 flex items-center justify-between px-8 sticky top-0 bg-white z-50 border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            {view === "company-details" && (
              <button
                onClick={() => { setView("companies"); setSelectedCompany(null); }}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Companies
              </button>
            )}
            <h1 className="text-lg font-bold text-slate-800">
              {view === "dashboard" ? "System Overview" :
                view === "companies" ? "Company Management" :
                  view === "security" ? "Security Logic" :
                    `${selectedCompany?.name} - Details & Monitoring`}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-md h-9">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-wide">SysAdmin</span>
                <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tight mt-1">Master Account</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pb-20">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <>
              {/* Dashboard Overview */}
              {view === "dashboard" && overview && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="enterprise-card border-l-4 border-l-blue-600">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Companies</p>
                          <p className="text-3xl font-black text-slate-900 leading-none mt-1">{overview.total_companies}</p>
                        </div>
                      </div>
                    </div>
                    <div className="enterprise-card border-l-4 border-l-purple-600">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Users size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Users</p>
                          <p className="text-3xl font-black text-slate-900 leading-none mt-1">{overview.total_users}</p>
                        </div>
                      </div>
                    </div>
                    <div className="enterprise-card border-l-4 border-l-emerald-600">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Documents</p>
                          <p className="text-3xl font-black text-slate-900 leading-none mt-1">{overview.total_documents}</p>
                        </div>
                      </div>
                    </div>
                    <div className="enterprise-card border-l-4 border-l-orange-600">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          <Activity size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Transactions</p>
                          <p className="text-3xl font-black text-slate-900 leading-none mt-1">{overview.total_transactions}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Recent Global Activity - Left 2/3 */}
                    <div className="lg:col-span-2">
                      <div className="enterprise-card p-0 overflow-hidden h-full">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Activity size={16} className="text-blue-600" />
                            Recent Global Activity
                          </h3>
                        </div>
                        <div className="p-1">
                          <ul className="divide-y divide-slate-100">
                            {overview.recent_system_activity && overview.recent_system_activity.length > 0 ? (
                              overview.recent_system_activity.map(activity => (
                                <li key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                                  <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-sm shadow-blue-500/20" />
                                    <div>
                                      <p className="text-xs font-medium text-slate-800 leading-tight">
                                        <span className="font-bold text-blue-600">{activity.entity_type}</span>: {activity.action.replace(/_/g, ' ')}
                                      </p>
                                      <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest">{new Date(activity.created_at).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <div className="px-5 py-8 text-center">
                                <p className="text-xs text-slate-400">No recent global logs.</p>
                              </div>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* System Health / Top Tenants - Right 1/3 */}
                    <div className="space-y-8">
                      <div className="enterprise-card p-5">
                         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <Shield size={16} className="text-emerald-600" />
                            System Health
                          </h3>
                          <div className="space-y-6">
                            {[
                              { label: "API Gateway", status: "Operational", color: "bg-emerald-500" },
                              { label: "Storage Engine", status: "Good", color: "bg-emerald-500" },
                              { label: "Auth Server", status: "Operational", color: "bg-emerald-500" },
                              { label: "AI Co-pilot", status: "Standby", color: "bg-blue-400" },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">{item.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.status}</span>
                                  <div className={`w-2 h-2 rounded-full ${item.color} shadow-sm shadow-emerald-500/20`} />
                                </div>
                              </div>
                            ))}
                          </div>
                      </div>

                      <div className="enterprise-card p-5 bg-blue-600 border-none text-white shadow-xl shadow-blue-900/20">
                         <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                            <Zap size={16} className="text-blue-200" />
                            System Load
                          </h3>
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-100/60">
                                <span>CPU Usage</span>
                                <span>12%</span>
                             </div>
                             <div className="w-full bg-blue-900/50 rounded-full h-1.5">
                                <div className="bg-blue-200 h-1.5 rounded-full" style={{ width: '12%' }}></div>
                             </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Companies View */}
              {view === "companies" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">Monitor and manage tenant companies.</p>
                    <button
                      onClick={() => setShowCompanyModal(true)}
                      className="h-10 px-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg flex items-center gap-2 text-sm font-semibold border border-slate-900 transition-all active:scale-95 shadow-sm"
                    >
                      <Plus size={16} /> Create Company
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-slate-800">Company Name</th>
                          <th className="px-6 py-4 font-semibold text-slate-800">Users (Active)</th>
                          <th className="px-6 py-4 font-semibold text-slate-800">Documents</th>
                          <th className="px-6 py-4 font-semibold text-slate-800">Transactions</th>
                          <th className="px-6 py-4 font-semibold text-slate-800">Last Activity</th>
                          <th className="px-6 py-4 font-semibold text-slate-800 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {companies.map(company => (
                          <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                  {company.name.charAt(0)}
                                </div>
                                {company.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-700">{company.total_users || 0}</span>
                              <span className="text-slate-400 text-xs ml-1">({company.active_users || 0} act)</span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{company.total_documents || 0}</td>
                            <td className="px-6 py-4 text-slate-600">{company.total_transactions || 0}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                              {company.last_activity ? new Date(company.last_activity).toLocaleDateString() : "Never"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => { setSelectedCompany(company); setView("company-details"); setLoading(true); }}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-medium rounded-md text-xs transition-colors shadow-sm"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                        {companies.length === 0 && (
                          <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No companies found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Company Details View */}
              {view === "company-details" && companyDetails && (
                <div className="space-y-8 animate-in fade-in duration-500 delay-100">
                  {/* Company Insights Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="enterprise-card py-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Users</p>
                      <p className="text-2xl font-black text-slate-900">{companyDetails.users.length}</p>
                    </div>
                    <div className="enterprise-card py-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Users</p>
                      <p className="text-2xl font-black text-emerald-600">{companyDetails.users.filter(u => u.status === 'active').length}</p>
                    </div>
                    <div className="enterprise-card py-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Documents</p>
                      <p className="text-2xl font-black text-slate-900">{companyDetails.total_documents}</p>
                    </div>
                    <div className="enterprise-card py-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Transactions</p>
                      <p className="text-2xl font-black text-slate-900">{companyDetails.total_transactions}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Users */}
                    <div className="xl:col-span-2 space-y-6">
                      <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
                        <div>
                          <h2 className="text-base font-bold text-slate-900">User Roster</h2>
                          <p className="text-xs text-slate-500 font-medium">Manage accounts for {selectedCompany?.name}</p>
                        </div>
                        <button
                          onClick={() => setShowUserModal(true)}
                          className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-xs font-semibold shadow-sm transition-all shadow-blue-600/20 active:scale-95"
                        >
                          <UserCog size={14} /> Add User
                        </button>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-4 font-semibold text-slate-800">User Identity</th>
                              <th className="px-6 py-4 font-semibold text-slate-800">Emp ID / Role</th>
                              <th className="px-6 py-4 font-semibold text-slate-800">Status</th>
                              <th className="px-6 py-4 font-semibold text-slate-800 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {companyDetails.users.map(u => (
                              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                                    <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5"><Mail size={10} />{u.email}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1 items-start">
                                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded w-fit border border-slate-200">{u.emp_id || 'N/A'}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-100"><Shield size={10} />{u.role}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center w-fit gap-1.5 ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    {u.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleToggleStatus(u.id, u.status)}
                                    className={`px-3 py-1 bg-white border font-bold rounded text-[10px] uppercase tracking-wider transition-colors shadow-sm ${u.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}
                                  >
                                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {companyDetails.users.length === 0 && (
                              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No users found</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right Column: Doc Stats & Activity */}
                    <div className="space-y-6">
                      {/* Document Insights */}
                      <div className="enterprise-card p-0 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" />
                            Document Intelligence
                          </h3>
                        </div>
                        <div className="p-5">
                          <div className="space-y-4">
                            {Object.entries(companyDetails.documents_by_type).map(([docType, count]) => (
                              <div key={docType} className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-end text-xs font-bold text-slate-700">
                                  <span>{docType}</span>
                                  <span className="text-slate-500">{count} records</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${Math.max(2, (count / (companyDetails.total_documents || 1)) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                            {Object.keys(companyDetails.documents_by_type).length === 0 && (
                              <p className="text-xs text-slate-400 italic">No document data available.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="enterprise-card p-0 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Activity size={16} className="text-emerald-600" />
                            Recent Activity
                          </h3>
                        </div>
                        <div className="p-1">
                          <ul className="divide-y divide-slate-100">
                            {companyDetails.recent_activity.length > 0 ? (
                              companyDetails.recent_activity.map(activity => (
                                <li key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                                  <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium text-slate-800 leading-tight">
                                        <span className="font-bold text-blue-600">{activity.entity_type}</span>: {activity.action.replace(/_/g, ' ')}
                                      </p>
                                      <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest">{new Date(activity.created_at).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <div className="px-5 py-8 text-center">
                                <p className="text-xs text-slate-400">No recent operational logs.</p>
                              </div>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Scope View */}
              {view === "security" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        role: "Admin",
                        description: "Full system administrative access",
                        permissions: ["Full access to all modules", "User management", "System configuration", "Financial approvals"],
                        color: "bg-purple-100 text-purple-700 border-purple-200"
                      },
                      {
                        role: "Operations",
                        description: "Day-to-day manufacturing operations",
                        permissions: ["Purchase Orders", "Weighbridge Entry", "GRN Management", "Vendor Management", "Document Comparison"],
                        color: "bg-blue-100 text-blue-700 border-blue-200"
                      },
                      {
                        role: "Finance",
                        description: "Financial tracking and auditing",
                        permissions: ["Invoice Management", "Financial Dashboard", "Audit Logs", "Payment Approvals"],
                        color: "bg-green-100 text-green-700 border-green-200"
                      }
                    ].map((role) => (
                      <div key={role.role} className="bg-white rounded-xl overflow-hidden flex flex-col hover:border-blue-400/50 transition-all border border-slate-200 shadow-sm relative group">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded border ${role.color}`}>
                              {role.role}
                            </div>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">{role.role} Authority</h3>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{role.description}</p>
                        </div>
                        <div className="p-8 flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Functional Scope</p>
                          <ul className="space-y-3">
                            {role.permissions.map((perm) => (
                              <li key={perm} className="flex items-start gap-2.5 text-xs font-bold text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0" />
                                <span>{perm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50/30 border border-blue-200/50 p-8 flex items-start sm:items-center gap-6 rounded-2xl relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="w-12 h-12 rounded bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                      <Shield className="w-6 h-6 stroke-[2.5px]" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-wide">Security Protocol Alpha</p>
                      <p className="text-xs text-slate-600 mt-1 font-medium max-w-2xl">To request modifications to your operational scope or authority levels, please submit a formal authorization request via the Terminal Central support desk.</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Create Company Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Building2 size={18} className="text-blue-500" /> New Company</h3>
              <button onClick={() => setShowCompanyModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Company Name</label>
                <input
                  type="text" required
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                  value={newCompany.name} onChange={e => setNewCompany({ name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCompanyModal(false)} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors">Create Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showUserModal && selectedCompany && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><UserCog size={18} className="text-blue-500" /> New User for {selectedCompany.name}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                  <input type="text" required className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                  <input type="email" required className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
                  <input type="password" required className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Emp ID</label>
                  <input type="text" className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" value={newUser.emp_id} onChange={e => setNewUser({ ...newUser, emp_id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Job Title</label>
                  <input type="text" className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" value={newUser.job_title} onChange={e => setNewUser({ ...newUser, job_title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Role</label>
                  <select className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="editor">Editor (Full Access)</option>
                    <option value="viewer">Viewer (Read-Only)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors shadow-blue-600/20">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}
