import React, { useState, useEffect } from "react";
import { Users, UserPlus, FileEdit, CheckCircle2, XCircle, Search, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  emp_id?: string;
  job_title?: string;
  role: string;
  status: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Create user form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    emp_id: "",
    job_title: "",
    role: "operations",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (err) {
      toast.error("Error communicating with server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success("User created successfully");
        setShowCreateForm(false);
        setFormData({ name: "", email: "", password: "", emp_id: "", job_title: "", role: "operations" });
        fetchUsers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.detail || "Failed to create user");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"}`);
        fetchUsers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.detail || "Failed to update status");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <Shield className="w-4 h-4 text-slate-400 stroke-[2.5px]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Administration</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Access Control</h1>
          <p className="text-slate-500 font-medium">Manage enterprise users and authorization scopes.</p>
        </div>
        {!showCreateForm && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="enterprise-button-primary px-8 gap-2 group"
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Provision User</span>
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="enterprise-card p-8 border-blue-200 shadow-lg shadow-blue-900/5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              New User Provisioning
            </h2>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="enterprise-label">Full Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="enterprise-input" placeholder="Enter Full Name" />
            </div>
            <div className="space-y-3">
              <label className="enterprise-label">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="enterprise-input" placeholder="mail@example.com" />
            </div>
            <div className="space-y-3">
              <label className="enterprise-label">Temporary Password</label>
              <input required minLength={8} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="enterprise-input" placeholder="Min 8 characters" />
            </div>
            <div className="space-y-3">
              <label className="enterprise-label">Employee ID (Optional)</label>
              <input value={formData.emp_id} onChange={e => setFormData({...formData, emp_id: e.target.value})} className="enterprise-input" placeholder="EMP-####" />
            </div>
            <div className="space-y-3">
              <label className="enterprise-label">Job Title</label>
              <input value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} className="enterprise-input" placeholder="e.g. Floor Manager" />
            </div>
            <div className="space-y-3">
              <label className="enterprise-label">System Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="enterprise-input">
                <option value="admin">Administrator</option>
                <option value="operations">Operations</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <button disabled={isSubmitting} type="submit" className="enterprise-button-primary px-10 gap-2">
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Authorize & Create</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User Table */}
      <div className="enterprise-card p-0 overflow-hidden border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Enterprise Directory
          </h2>
          <button onClick={fetchUsers} className="text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0f172a] text-white">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Identity</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Emp ID / Title</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Access Role</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-3 text-blue-600" />
                    Fetching directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-xs font-medium text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{user.emp_id || "—"}</div>
                      <div className="text-xs font-medium text-slate-500">{user.job_title || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                        user.role === "admin" ? "bg-purple-100 text-purple-700 border border-purple-200" :
                        user.role === "finance" ? "bg-green-100 text-green-700 border border-green-200" :
                        "bg-blue-100 text-blue-700 border border-blue-200"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5 w-fit",
                        user.status === "active" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", user.status === "active" ? "bg-emerald-500" : "bg-red-500")}></div>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm hover:border-blue-300">
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className={cn(
                            "p-2 text-slate-400 transition-colors bg-white border border-slate-200 rounded shadow-sm",
                            user.status === "active" ? "hover:text-red-600 hover:border-red-300 hover:bg-red-50" : "hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
                          )}
                          title={user.status === "active" ? "Deactivate User" : "Activate User"}
                        >
                          {user.status === "active" ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
