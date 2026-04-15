
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
      color: "bg-emerald-100 text-emerald-700 border-emerald-200"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-8 bg-slate-900 rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">System Configuration</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">Manage your professional profile, security permissions, and operational preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full md:w-auto grid grid-cols-3 md:flex border border-slate-200/50">
          <TabsTrigger value="profile" className="rounded-xl px-8 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50 transition-all">
            <User className="w-3.5 h-3.5 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-xl px-8 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50 transition-all">
            <Shield className="w-3.5 h-3.5 mr-2" />
            Access
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-xl px-8 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50 transition-all">
            <SettingsIcon className="w-3.5 h-3.5 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold text-slate-900">Personal Identity</CardTitle>
              <CardDescription className="text-sm font-medium text-slate-400">Update your professional credentials and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-32 h-32 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-slate-200 relative overflow-hidden">
                    {profileData.name.charAt(0)}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <SettingsIcon className="w-8 h-8 animate-spin-slow" />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Change Avatar</Button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Legal Name</Label>
                    <div className="relative">
                      <Input 
                        id="name" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="bg-slate-50/50 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl h-12 pl-12 font-bold text-slate-900 transition-all"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enterprise Email</Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        type="email"
                        value={profileData.email} 
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="bg-slate-50/50 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl h-12 pl-12 font-bold text-slate-900 transition-all"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned System Role</Label>
                    <div className="relative">
                      <Input 
                        value={user?.role || "User"} 
                        readOnly 
                        className="bg-slate-100 border-transparent rounded-2xl h-12 pl-12 capitalize font-black text-slate-400 tracking-tight"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 italic">Role permissions are managed by the IT department</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 border-t border-slate-50 mt-4 flex justify-end">
              <Button onClick={handleUpdateProfile} className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]">
                <Save className="w-4 h-4 mr-2" />
                Commit Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Roles & Access Tab */}
        <TabsContent value="roles" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rolesData.map((role) => (
              <Card key={role.role} className="border border-slate-100 shadow-sm flex flex-col rounded-3xl overflow-hidden bg-white group hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2", role.color)}>
                      {role.role}
                    </Badge>
                    {user?.role.toLowerCase() === role.role.toLowerCase() && (
                      <Badge className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Active</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">{role.role} Authority</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 mt-1">{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 flex-1">
                  <div className="space-y-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scope of Access</p>
                    <ul className="space-y-3">
                      {role.permissions.map((perm) => (
                        <li key={perm} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                          <span>{perm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border border-blue-100 shadow-sm bg-blue-50/30 rounded-3xl overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Access Control Policy</p>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">Role-based access control (RBAC) is enforced at the system level. To modify your operational scope or request elevated privileges, please submit a formal request through the IT service portal.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold text-slate-900">System Preferences</CardTitle>
              <CardDescription className="text-sm font-medium text-slate-400">Tailor the platform interface to your operational requirements.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
                    {preferences.darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 tracking-tight">Visual Theme</p>
                    <p className="text-xs font-medium text-slate-400">Toggle between high-contrast light and dark modes</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.darkMode} 
                  onCheckedChange={(val) => setPreferences({ ...preferences, darkMode: val })} 
                  className="data-[state=checked]:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 tracking-tight">Operational Alerts</p>
                    <p className="text-xs font-medium text-slate-400">Receive real-time push notifications for critical events</p>
                  </div>
                </div>
                <Switch 
                  checked={preferences.notifications} 
                  onCheckedChange={(val) => setPreferences({ ...preferences, notifications: val })} 
                  className="data-[state=checked]:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 border border-slate-100">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 tracking-tight">Localization</p>
                    <p className="text-xs font-medium text-slate-400">Select the primary language for the system interface</p>
                  </div>
                </div>
                <Select value={preferences.language} onValueChange={(val) => setPreferences({ ...preferences, language: val })}>
                  <SelectTrigger className="w-[200px] bg-white rounded-2xl h-11 border-slate-200 font-bold text-slate-900">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200">
                    <SelectItem value="en" className="font-bold">English (US)</SelectItem>
                    <SelectItem value="hi" className="font-bold">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="te" className="font-bold">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="ta" className="font-bold">Tamil (தமிழ்)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 border-t border-slate-50 mt-4 flex justify-end">
              <Button onClick={handleSavePreferences} className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]">
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
