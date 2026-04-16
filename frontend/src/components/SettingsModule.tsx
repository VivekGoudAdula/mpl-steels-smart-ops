
import React, { useState } from "react";
import {
  User,
  Shield,
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Globe,
  CheckCircle2,
  Lock,
  Mail,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SettingsModuleProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function SettingsModule({ user }: SettingsModuleProps) {
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    language: "en",
  });

  const handleUpdateProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved!");
  };

  const rolesData = [
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
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 fill-none stroke-current stroke-2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Configuration</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Account Control</h1>
          <p className="text-slate-500 font-medium">Manage professional profile, access permissions, and preferences.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl w-full md:w-auto inline-flex border border-slate-200 shadow-sm h-12">
          <TabsTrigger value="profile" className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-400 transition-all">
            <User className="w-3.5 h-3.5 mr-2" />
            Profile Identity
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-400 transition-all">
            <Shield className="w-3.5 h-3.5 mr-2" />
            Security Scope
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-lg px-6 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 text-slate-400 transition-all">
            <SettingsIcon className="w-3.5 h-3.5 mr-2" />
            System Logic
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="enterprise-card p-0 overflow-hidden border-slate-200">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Personal Identity</h2>
              <p className="text-sm text-slate-500 font-medium">Update your professional credentials.</p>
            </div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-28 h-28 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 text-3xl font-black shadow-sm">
                    {profileData.name.charAt(0)}
                  </div>
                  <button className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 tracking-widest">
                    Replace Token
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="space-y-3">
                    <label className="enterprise-label">Full Legal Name</label>
                    <div className="relative group">
                      <input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="enterprise-input pl-11"
                        placeholder="Authorized Identity"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="enterprise-label">Enterprise Email</label>
                    <div className="relative group">
                      <input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="enterprise-input pl-11"
                        placeholder="identity@enterprise.com"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="enterprise-label">System Role Access</label>
                    <div className="relative">
                      <input
                        value={user?.role || "User"}
                        readOnly
                        className="enterprise-input pl-11 bg-slate-50 text-slate-400 cursor-not-allowed border-dashed"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Managed via Terminal Central.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleUpdateProfile}
                className="enterprise-button-primary px-10 gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Identity</span>
              </button>
            </div>
          </div>
        </TabsContent>


        {/* Roles & Access Tab */}
        <TabsContent value="roles" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rolesData.map((role) => (
              <div key={role.role} className="enterprise-card p-0 overflow-hidden flex flex-col hover:border-blue-400/50 transition-all group shadow-sm">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded border", role.color)}>
                      {role.role}
                    </div>
                    {user?.role.toLowerCase() === role.role.toLowerCase() && (
                      <div className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">Active</div>
                    )}
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

          <div className="enterprise-card bg-blue-50/30 border-blue-200/50 p-8 flex items-start sm:items-center gap-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="w-12 h-12 rounded bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
              <Shield className="w-6 h-6 stroke-[2.5px]" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-black text-slate-900 uppercase tracking-wide">Security Protocol Alpha</p>
              <p className="text-xs text-slate-600 mt-1 font-medium max-w-2xl">To request modifications to your operational scope or authority levels, please submit a formal authorization request via the Terminal Central support desk.</p>
            </div>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="enterprise-card p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">System Preferences</h2>
              <p className="text-sm text-slate-500 font-medium">Configure your local workspace environment.</p>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between p-6 rounded border border-slate-200 bg-white hover:border-blue-400/30 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                    {preferences.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Visual Identity</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Toggle between high-contrast light and deep terminal modes</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(val) => setPreferences({ ...preferences, darkMode: val })}
                  className="data-[state=checked]:bg-blue-600 border-slate-200"
                />
              </div>

              <div className="flex items-center justify-between p-6 rounded border border-slate-200 bg-white hover:border-blue-400/30 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">System Interrupts</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Receive real-time operational alerts for urgent transactions</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications}
                  onCheckedChange={(val) => setPreferences({ ...preferences, notifications: val })}
                  className="data-[state=checked]:bg-blue-600 border-slate-200"
                />
              </div>

              <div className="flex items-center justify-between p-6 rounded border border-slate-200 bg-white hover:border-blue-400/30 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Language Localization</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Set internationalization parameters for the Terminal interface</p>
                  </div>
                </div>
                <Select value={preferences.language} onValueChange={(val) => setPreferences({ ...preferences, language: val })}>
                  <SelectTrigger className="w-[200px] bg-slate-50 rounded h-10 border-slate-200 text-xs font-black uppercase tracking-widest">
                    <SelectValue placeholder="System Default" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="en" className="text-xs font-bold uppercase py-3">English (US)</SelectItem>
                    <SelectItem value="hi" className="text-xs font-bold uppercase py-3">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="te" className="text-xs font-bold uppercase py-3">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="ta" className="text-xs font-bold uppercase py-3">Tamil (தமிழ்)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSavePreferences}
                className="enterprise-button-primary px-10"
              >
                Apply Terminal Logic
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
