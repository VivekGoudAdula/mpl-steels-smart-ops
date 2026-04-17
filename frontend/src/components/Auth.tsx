import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Loader2,
  Files,
  Cpu,
  ArrowRightLeft
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type UserRole = "super_admin" | "editor" | "viewer" | "admin" | "operations" | "finance";

interface AuthProps {
  onAuthSuccess: (user: { id?: string; name: string; email: string; role: UserRole; company_id?: string; status?: string }) => void;
  onBack: () => void;
}

export default function Auth({ onAuthSuccess, onBack }: AuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        onAuthSuccess(data.user);
      } else {
        const errData = await res.json();
        setError(errData.detail || "Authentication failed");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#0f172a]">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex flex-col w-[40%] bg-[#0f172a] text-white p-16 justify-between sticky top-0 h-screen overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white translate-y-12"></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white translate-y-24"></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white translate-y-36"></div>
          <div className="absolute top-0 left-0 w-[1px] h-full bg-white translate-x-12"></div>
          <div className="absolute top-0 left-0 w-[1px] h-full bg-white translate-x-24"></div>
        </div>

        <div className="space-y-12 relative z-10">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={onBack}>
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none text-white">MPL STEELS</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">SMART OPS</span>
            </div>
          </div>

          <div className="space-y-6 pt-12">
            <h1 className="text-5xl font-bold tracking-tighter leading-[0.9] text-white">
              Industrial <br /> Intelligence <br /> Terminal.
            </h1>
            <p className="text-slate-400 text-lg max-w-sm font-medium">
              Enterprise-grade document orchestration and supply chain tracking for modern steel manufacturing.
            </p>
          </div>

          <div className="space-y-8 pt-12">
            <FeatureBullet 
              icon={<Files size={20} className="text-blue-500" />} 
              text="Centralized document orchestration" 
            />
            <FeatureBullet 
              icon={<ArrowRightLeft size={20} className="text-blue-500" />} 
              text="Three-way matching automation" 
            />
            <FeatureBullet 
              icon={<Cpu size={20} className="text-blue-500" />} 
              text="Predictive operational insights" 
            />
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-t border-slate-800 pt-8 mt-auto relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" />
            Terminal Secure
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          <span>v2.4.0</span>
        </div>
      </div>


      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 font-medium">
              Enter your credentials to access the platform
            </p>
          </div>

          <div className="enterprise-card p-10 border-slate-200 shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f172a] transition-colors" size={18} />
                  <input 
                    type="email"
                    placeholder="name@company.com"
                    className="enterprise-input !pl-12"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                  <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f172a] transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="enterprise-input !pl-12 pr-12"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f172a] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-[#0f172a]" />
                <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer">Remember me</label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  {error}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="enterprise-button-primary w-full shadow-lg shadow-slate-900/10"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight size={18} className="opacity-60" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">
            © 2026 MPL STEELS • SECURE INDUSTRIAL PLATFORM
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureBullet({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
        {icon}
      </div>
      <span className="font-semibold text-blue-100/80">{text}</span>
    </div>
  );
}

