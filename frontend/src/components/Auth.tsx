
import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ChevronLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  X,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";
export type UserRole = "admin" | "operations" | "finance";

interface AuthProps {
  initialMode?: AuthMode;
  onAuthSuccess: (user: { name: string; email: string; role: UserRole }) => void;
  onBack: () => void;
}

export default function Auth({ initialMode = "login", onAuthSuccess, onBack }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operations" as UserRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "signup") {
      if (!formData.fullName) {
        setError("Full name is required.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        name: formData.fullName || "User",
        email: formData.email,
        role: formData.role
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex flex-col">
      {/* Minimal Header */}
      <nav className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onBack}>
            <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-sm tracking-tight uppercase">MPL Steels</span>
          </div>
          <button 
            onClick={onBack}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={14} />
            Return Home
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center px-6 pb-24">
        <div className="w-full max-w-md space-y-12">
          {/* Typographic Header */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-black/20"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                {mode === "login" ? "Access Portal" : "Workspace Setup"}
              </span>
              <span className="w-8 h-[1px] bg-black/20"></span>
            </div>
            <h1 className="text-6xl font-heading italic leading-none tracking-tight">
              {mode === "login" ? "Welcome" : "Initialize"} <br />
              <span className="text-black/20 not-italic font-sans font-black uppercase tracking-tighter">
                {mode === "login" ? "Back" : "Account"}
              </span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-2xl shadow-black/5"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div 
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8"
                  >
                    <div className="space-y-3">
                      <Label className="text-[10px] font-mono text-black/40 uppercase tracking-widest ml-1">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={18} />
                        <Input 
                          placeholder="John Doe"
                          className="pl-12 h-14 bg-black/[0.02] border-black/5 rounded-2xl focus:bg-white focus:border-black/10 transition-all text-sm font-medium"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-mono text-black/40 uppercase tracking-widest ml-1">Workspace Role</Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={(val: UserRole) => setFormData({...formData, role: val})}
                      >
                        <SelectTrigger className="h-14 bg-black/[0.02] border-black/5 rounded-2xl focus:bg-white focus:border-black/10 transition-all px-5 text-sm font-medium">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-black/5 shadow-2xl">
                          <SelectItem value="admin" className="text-sm font-medium py-3">Admin</SelectItem>
                          <SelectItem value="operations" className="text-sm font-medium py-3">Operations</SelectItem>
                          <SelectItem value="finance" className="text-sm font-medium py-3">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <Label className="text-[10px] font-mono text-black/40 uppercase tracking-widest ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={18} />
                  <Input 
                    type="email"
                    placeholder="name@company.com"
                    className="pl-12 h-14 bg-black/[0.02] border-black/5 rounded-2xl focus:bg-white focus:border-black/10 transition-all text-sm font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-mono text-black/40 uppercase tracking-widest ml-1">Password</Label>
                  {mode === "login" && (
                    <button type="button" className="text-[10px] font-bold text-black/40 hover:text-black transition-colors uppercase tracking-widest">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={18} />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-14 bg-black/[0.02] border-black/5 rounded-2xl focus:bg-white focus:border-black/10 transition-all text-sm font-medium"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <Label className="text-[10px] font-mono text-black/40 uppercase tracking-widest ml-1">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={18} />
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 h-14 bg-black/[0.02] border-black/5 rounded-2xl focus:bg-white focus:border-black/10 transition-all text-sm font-medium"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}

              {error && (
                <div className="p-4 rounded-2xl bg-black text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <X size={14} className="text-white/40" />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 bg-black hover:bg-black/80 text-white font-bold rounded-full text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-black/10"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{mode === "login" ? "Initialize Session" : "Create Workspace"}</span>
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-black/5 text-center">
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                {mode === "login" ? "New to the platform?" : "Already have access?"}
                <button 
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="ml-2 text-black hover:underline underline-offset-4 decoration-black/20 transition-all"
                >
                  {mode === "login" ? "Create Account" : "Sign In"}
                </button>
              </p>
            </div>
          </motion.div>

          {/* System Footer */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8 opacity-20 grayscale">
              <ShieldCheck size={20} />
              <Lock size={20} />
              <Cpu size={20} />
            </div>
            <p className="text-[10px] font-mono text-black/20 uppercase tracking-[0.3em]">
              Encrypted Industrial Gateway v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
