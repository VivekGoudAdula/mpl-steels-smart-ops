
import React from "react";
import { 
  ArrowRight, 
  Files, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Users,
  Cpu,
  ArrowRightLeft,
  LayoutDashboard,
  Search,
  CheckCircle2,
  Sparkles,
  Bot,
  Layers,
  FileText,
  Workflow
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0f172a] selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <span className="font-bold text-base tracking-tighter uppercase text-slate-900">MPL STEELS</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="#features">Capabilities</NavLink>
              <NavLink href="#solutions">Solutions</NavLink>
              <NavLink href="#preview">Terminal Preview</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin} 
              className="text-xs font-black uppercase tracking-widest text-[#0f172a] hover:bg-slate-50 px-4 h-[40px] rounded-lg transition-all"
            >
              Access
            </button>
            <button 
              onClick={onGetStarted} 
              className="enterprise-button-primary h-[40px] px-6 text-xs shadow-lg shadow-blue-900/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>


      <main className="pt-16">
        {/* Section 1: Hero */}
        <section className="relative py-24 lg:py-32 overflow-hidden border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Enterprise Operations Platform</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
                  Manage Procurement & Documents in One Unified Platform
                </h1>
                
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                  Track POs, Weighbridge entries, GRNs, and Invoices with full visibility and control. Built for the modern steel enterprise.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={onGetStarted} 
                    className="enterprise-button-primary"
                  >
                    Get Started <ArrowRight className="ml-2 w-5 h-5 opacity-60" />
                  </button>
                  <button 
                    onClick={onLogin} 
                    className="enterprise-button-secondary"
                  >
                    Live Demo
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-[2rem] blur-3xl -z-10"></div>
                <DashboardMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Features (Grid) */}
        <section id="features" className="py-24 bg-slate-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Technical Capabilities</h2>
              <p className="text-lg text-slate-500 font-medium font-sans">
                A technical OS designed to orchestrate complex industrial supply chains with surgical precision.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              <FeatureCard 
                icon={<Files className="text-blue-600" size={24} />}
                title="Document Management"
                desc="Centralized hub for all procurement documents with advanced OCR and classification."
              />
              <FeatureCard 
                icon={<ArrowRightLeft className="text-blue-600" size={24} />}
                title="Transaction Linking"
                desc="Full traceability from PO → Weighbridge → GRN → Invoice with automated 3-way matching."
              />
              <FeatureCard 
                icon={<Bot className="text-blue-600" size={24} />}
                title="AI Document Q&A"
                desc="Query your operational data using natural language for instant insights and reporting."
              />
              <FeatureCard 
                icon={<Workflow className="text-blue-600" size={24} />}
                title="Process Automation"
                desc="Automated validation workflows reduce manual entry and eliminate discrepancies."
              />
            </div>
          </div>
        </section>

        {/* Section 3: Product Preview */}
        <section id="preview" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold tracking-tight">Dashboard Overview</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Get a high-level view of your entire operation. Monitor active purchase orders, real-time weighbridge traffic, and pending invoice settlements in a single, high-density interface.
                </p>
                <ul className="space-y-4 pt-4">
                  <PreviewItem text="Real-time KPI tracking for procurement spending" />
                  <PreviewItem text="Live weighbridge status and truck turnaround times" />
                  <PreviewItem text="Intelligent alerts for document discrepancies" />
                </ul>
              </div>
              <div className="enterprise-card p-2 border-slate-200 shadow-2xl overflow-hidden group">
                 <div className="rounded-lg overflow-hidden border border-slate-100">
                    <DashboardMockup zoom />
                 </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="lg:order-2 space-y-6">
                <h3 className="text-3xl font-bold tracking-tight">Advanced Document Workspace</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Analyze and compare documents side-by-side. Our intelligent workspace highlights potential issues before they become costly errors.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-2xl text-slate-900">100%</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Trail</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-2xl text-slate-900">&lt; 2s</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Search Speed</div>
                  </div>
                </div>
              </div>
              <div className="lg:order-1 enterprise-card p-2 border-slate-200 shadow-2xl overflow-hidden">
                 <div className="rounded-lg overflow-hidden border border-slate-100">
                    <DocumentWorkspaceMockup />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section className="py-24 lg:py-40 bg-[#0f172a] text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white"></div>
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Start managing your operations smarter
            </h2>
            <p className="text-xl text-blue-100/60 max-w-2xl mx-auto font-medium">
              Join leading steel manufacturers who trust MPL Steels to power their procurement and logistics workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={onGetStarted} 
                className="h-[56px] px-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xl shadow-blue-900/40"
              >
                Request Access
              </button>
              <button 
                className="h-[56px] px-10 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold backdrop-blur-sm border border-white/10 transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0f172a] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="font-bold text-base tracking-tight uppercase">MPL Steels</span>
              </div>
              <p className="text-slate-500 font-medium max-w-xs text-sm leading-relaxed">
                The smart document and operations platform for the steel industry. Precision-engineered for growth.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-widest text-slate-400 mb-6">Platform</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Procurement</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Logistics</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-widest text-slate-400 mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-widest text-slate-400 mb-6">Connect</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-all">
                  <Users size={18} className="text-slate-400" />
                </div>
                <div className="w-10 h-10 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-all">
                  <BarChart3 size={18} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-20 mt-20 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 MPL Steels Ltd. All rights reserved.</p>
            <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Enterprise Grade</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-sm font-bold text-slate-500 hover:text-[#0f172a] transition-colors"
    >
      {children}
    </a>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="enterprise-card border-gray-200/60 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group p-8 bg-white">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function PreviewItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm font-semibold text-slate-600">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
        <CheckCircle2 size={12} className="text-blue-600" />
      </div>
      {text}
    </li>
  );
}

function DashboardMockup({ zoom }: { zoom?: boolean }) {
  return (
    <div className={cn("bg-[#f8fafc] w-full aspect-[1.4] border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-700", zoom && "group-hover:scale-105")}>
      <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
        </div>
        <div className="ml-4 h-5 w-32 bg-slate-100 rounded"></div>
      </div>
      <div className="flex-1 flex overflow-hidden font-sans">
        <div className="w-12 md:w-48 bg-[#0f172a] h-full hidden md:flex flex-col p-4 gap-4">
          <div className="h-6 w-3/4 bg-white/10 rounded"></div>
          <div className="space-y-2 pt-4">
               {[1,2,3,4,5].map(i => <div key={i} className="h-5 w-full bg-white/5 rounded"></div>)}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6 overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="h-8 w-40 bg-slate-200 rounded"></div>
            <div className="h-8 w-24 bg-blue-600/10 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <div className="h-4 w-40 bg-slate-200 rounded mb-6"></div>
             <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2.5 w-1/3 bg-slate-200 rounded"></div>
                      <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-slate-100 rounded"></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentWorkspaceMockup() {
  return (
    <div className="bg-[#f8fafc] w-full aspect-[1.4] border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
      <div className="h-10 bg-[#0f172a] flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center">
            <FileText size={12} className="text-white/60" />
          </div>
          <div className="h-3 w-24 bg-white/20 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-5 bg-white/10 rounded"></div>
          <div className="h-5 w-5 bg-white/10 rounded"></div>
        </div>
      </div>
      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm overflow-hidden">
           <div className="flex justify-between">
             <div className="h-4 w-32 bg-slate-200 rounded"></div>
             <div className="h-4 w-20 bg-blue-100 rounded"></div>
           </div>
           <div className="space-y-4">
              {[1,2,3,4,5,6,7].map(i => <div key={i} className={cn("h-3 bg-slate-100 rounded", i%3===0 ? "w-3/4" : "w-full")}></div>)}
           </div>
           <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="h-3 w-1/4 bg-slate-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-slate-50 border border-slate-100 rounded-lg"></div>
                  <div className="h-10 bg-slate-50 border border-slate-100 rounded-lg"></div>
              </div>
           </div>
        </div>
        <div className="w-1/3 space-y-4">
           <div className="h-32 bg-[#0f172a] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-blue-400" />
                <div className="h-2.5 w-20 bg-white/20 rounded"></div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded"></div>
              <div className="h-2 w-3/4 bg-white/10 rounded"></div>
              <div className="pt-4 h-8 w-full bg-blue-600 rounded-lg"></div>
           </div>
           <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
              <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
              <div className="space-y-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
                    <div className="h-2 w-12 bg-slate-100 rounded"></div>
                    <div className="h-2 w-16 bg-slate-800 rounded"></div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
