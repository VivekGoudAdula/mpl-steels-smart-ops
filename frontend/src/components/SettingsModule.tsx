
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Basic Settings</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Account Control</h1>
          <p className="text-slate-500 font-medium">Manage professional profile information.</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Profile */}
        <div>
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
                        className="enterprise-input !pl-11"
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
                        className="enterprise-input !pl-11"
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
                        className="enterprise-input !pl-11 bg-slate-50 text-slate-400 cursor-not-allowed border-dashed"
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
        </div>
      </div>
    </div>
  );
}
