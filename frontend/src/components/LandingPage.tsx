
import React from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  Files, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Users,
  ChevronRight,
  Bot,
  Cpu,
  ArrowRightLeft,
  LayoutDashboard,
  Search,
  Filter,
  Lock,
  ArrowUpRight,
  Menu,
  X,
  Plus,
  ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white overflow-x-hidden">
      {/* Navbar - Minimal & Floating */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full shadow-sm">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-sm tracking-tight uppercase">MPL Steels</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="#features">Capabilities</NavLink>
              <NavLink href="#solutions">Solutions</NavLink>
              <NavLink href="#workflow">Workflow</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onLogin} className="hidden sm:flex text-xs font-bold uppercase tracking-widest hover:bg-black/5 rounded-full px-5">
              Login
            </Button>
            <Button onClick={onGetStarted} className="bg-black hover:bg-black/80 text-white rounded-full px-6 h-9 text-xs font-bold uppercase tracking-widest transition-all">
              Get Started
            </Button>
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-[#FBFBF9] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8">
              <a href="#features" className="text-4xl font-heading italic" onClick={() => setIsMenuOpen(false)}>Capabilities</a>
              <a href="#solutions" className="text-4xl font-heading italic" onClick={() => setIsMenuOpen(false)}>Solutions</a>
              <a href="#workflow" className="text-4xl font-heading italic" onClick={() => setIsMenuOpen(false)}>Workflow</a>
              <a href="#contact" className="text-4xl font-heading italic" onClick={() => setIsMenuOpen(false)}>Contact</a>
              <div className="pt-8 flex flex-col gap-4">
                <Button variant="outline" onClick={onLogin} className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest">Login</Button>
                <Button onClick={onGetStarted} className="w-full h-14 bg-black text-white rounded-2xl font-bold uppercase tracking-widest">Get Started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Editorial Style */}
      <section className="relative pt-48 pb-24 lg:pt-64 lg:pb-40 px-6 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-end">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-black/20"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">Industrial Intelligence v2.0</span>
                </div>
                <h1 className="text-7xl lg:text-[9rem] font-heading italic leading-[0.85] tracking-[-0.04em] text-black">
                  Steel <br />
                  <span className="text-black/20 not-italic font-sans font-black uppercase tracking-tighter">Operations</span>
                </h1>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-12 items-start">
                <p className="text-lg text-black/60 font-medium leading-relaxed">
                  A technical OS for the modern steel enterprise. Automate document lifecycles and orchestrate complex procurement workflows with precision.
                </p>
                <div className="flex flex-col gap-4">
                  <Button onClick={onGetStarted} size="lg" className="bg-black hover:bg-black/80 text-white h-14 px-8 rounded-full text-sm font-bold uppercase tracking-widest group w-full sm:w-auto">
                    Initialize Platform
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                  <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest text-center sm:text-left">
                    Available for Enterprise Deployment
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block relative"
            >
              <div className="aspect-square bg-white border border-black/5 rounded-3xl p-8 shadow-2xl shadow-black/5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">System Status</p>
                    <p className="text-xl font-heading italic">Operational</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center">
                    <Plus size={20} className="text-black/20" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="h-[1px] w-full bg-black/5"></div>
                  <div className="flex items-end justify-between">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-black/10"></div>)}
                      </div>
                      <p className="text-4xl font-sans font-black tracking-tighter">99.8%</p>
                      <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">Accuracy Rate</p>
                    </div>
                    <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center text-white">
                      <Cpu size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Rail - Minimal */}
      <section className="py-8 border-b border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-12">
          <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest whitespace-nowrap">Trusted Partners</span>
          <div className="flex-1 flex justify-between items-center opacity-20 grayscale">
            <span className="font-heading italic text-xl">SteelCo</span>
            <span className="font-heading italic text-xl">IronForge</span>
            <span className="font-heading italic text-xl">Metallic</span>
            <span className="font-heading italic text-xl">Alloy</span>
            <span className="font-heading italic text-xl">Forge</span>
          </div>
        </div>
      </section>

      {/* Capabilities - Visible Grid Style */}
      <section id="features" className="py-24 lg:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.4fr_1fr] gap-20">
            <div className="space-y-8 sticky top-32 h-fit">
              <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">01 / Capabilities</p>
              <h2 className="text-5xl font-heading italic leading-tight">
                Precision <br />
                Engineering for <br />
                Steel Logistics
              </h2>
              <p className="text-black/60 font-medium leading-relaxed">
                We've built a suite of tools specifically designed to handle the high-stakes, high-volume nature of steel manufacturing.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 border-t border-l border-black/5">
              <GridFeature 
                icon={<Files size={20} />}
                title="Document Hub"
                desc="A unified repository for POs, WB slips, and Invoices with OCR-powered search."
              />
              <GridFeature 
                icon={<Bot size={20} />}
                title="AI Copilot"
                desc="Natural language interface to query operational data and generate reports."
              />
              <GridFeature 
                icon={<Cpu size={20} />}
                title="RPA Engine"
                desc="Automated data extraction and validation workflows with human-in-the-loop."
              />
              <GridFeature 
                icon={<LayoutDashboard size={20} />}
                title="Analytics"
                desc="Real-time visibility into procurement costs and vendor performance metrics."
              />
              <GridFeature 
                icon={<Users size={20} />}
                title="Vendors"
                desc="Comprehensive supplier profiles with performance scoring and history."
              />
              <GridFeature 
                icon={<ArrowRightLeft size={20} />}
                title="3-Way Match"
                desc="Automated reconciliation between PO, GRN, and Invoice to ensure accuracy."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow - Technical Instrument Style */}
      <section id="workflow" className="py-24 lg:py-40 px-6 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="grid lg:grid-cols-2 gap-20 items-end">
            <div className="space-y-8">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">02 / Workflow</p>
              <h2 className="text-6xl font-heading italic leading-tight">
                The Lifecycle of <br />
                a Transaction
              </h2>
            </div>
            <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
              From the initial purchase order to the final invoice payment, every step is tracked, validated, and optimized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            <WorkflowItem number="01" title="Procurement" desc="PO generation and vendor selection." />
            <WorkflowItem number="02" title="Logistics" desc="Weighbridge entry and material verification." />
            <WorkflowItem number="03" title="Validation" desc="GRN creation and quality inspection." />
            <WorkflowItem number="04" title="Settlement" desc="Invoice matching and payment processing." />
          </div>
        </div>
      </section>

      {/* Solutions - Large Typographic Sections */}
      <section id="solutions" className="py-24 lg:py-40 px-6 space-y-48">
        <SolutionSection 
          number="03"
          title="Document Orchestration"
          desc="Stop hunting through folders. Our platform centralizes every document in a high-performance hub, making data accessible in milliseconds."
          image={<DocumentInstrument />}
        />
        <SolutionSection 
          number="04"
          title="Intelligent Assistance"
          desc="Ask your data anything. 'What was our average steel cost in Q3?' or 'Show me all pending invoices from Tata Steel.' Instant answers, no SQL required."
          image={<AIInstrument />}
          reversed
        />
      </section>

      {/* CTA - Bold & Minimal */}
      <section className="py-24 lg:py-48 px-6 border-t border-black/5">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <h2 className="text-6xl lg:text-8xl font-heading italic tracking-tight">
            Ready to <br />Initialize?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} size="lg" className="bg-black text-white hover:bg-black/80 h-16 px-12 rounded-full text-sm font-bold uppercase tracking-widest shadow-2xl">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-12 rounded-full text-sm font-bold uppercase tracking-widest border-black/10 hover:bg-black/5">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Clean & Systematic */}
      <footer className="py-24 border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="font-bold text-sm tracking-tight uppercase">MPL Steels</span>
              </div>
              <p className="text-black/40 text-xs font-medium leading-relaxed max-w-xs">
                The technical operating system for the global steel industry. Built for precision, scale, and intelligence.
              </p>
            </div>
            <FooterColumn title="Product" links={["Capabilities", "Solutions", "Workflow", "Pricing"]} />
            <FooterColumn title="Company" links={["About", "Careers", "Contact", "News"]} />
            <FooterColumn title="Legal" links={["Privacy", "Terms", "Security", "Compliance"]} />
            <div className="space-y-6">
              <h4 className="text-[10px] font-mono text-black/40 uppercase tracking-widest">Connect</h4>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                  <Plus size={14} />
                </div>
                <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                  <Plus size={14} />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-24 mt-24 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">© 2026 MPL Steels Ltd. All rights reserved.</p>
            <div className="flex gap-8 text-[10px] font-mono text-black/40 uppercase tracking-widest">
              <a href="#" className="hover:text-black transition-colors">System Status: Operational</a>
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
      className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
    >
      {children}
    </a>
  );
}

function GridFeature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 border-r border-b border-black/5 hover:bg-black/[0.02] transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-heading italic mb-4">{title}</h3>
      <p className="text-sm text-black/50 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function WorkflowItem({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="p-12 space-y-8 hover:bg-white/5 transition-colors">
      <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{number}</p>
      <div className="space-y-4">
        <h3 className="text-2xl font-heading italic">{title}</h3>
        <p className="text-sm text-white/40 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SolutionSection({ number, title, desc, image, reversed }: { number: string, title: string, desc: string, image: React.ReactNode, reversed?: boolean }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className={cn("grid lg:grid-cols-2 gap-32 items-center", reversed && "lg:flex-row-reverse")}>
        <div className={cn("space-y-10", reversed && "lg:order-2")}>
          <div className="space-y-6">
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest">{number} / Solution</p>
            <h2 className="text-6xl font-heading italic leading-tight">{title}</h2>
          </div>
          <p className="text-xl text-black/60 font-medium leading-relaxed max-w-lg">
            {desc}
          </p>
          <Button variant="ghost" className="p-0 h-auto font-bold uppercase tracking-widest text-[10px] hover:bg-transparent group">
            Explore Documentation <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
          </Button>
        </div>
        <div className={cn("relative", reversed && "lg:order-1")}>
          {image}
        </div>
      </div>
    </div>
  );
}

function DocumentInstrument() {
  return (
    <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-black/5"></div>)}
        </div>
        <div className="h-6 w-24 bg-black/5 rounded-full"></div>
      </div>
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center justify-between p-4 border border-black/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                <Files size={14} className="text-black/40" />
              </div>
              <div className="h-2 w-24 bg-black/10 rounded"></div>
            </div>
            <div className="h-2 w-12 bg-black/5 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIInstrument() {
  return (
    <div className="bg-black p-10 rounded-[2.5rem] shadow-2xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
          <Bot size={20} className="text-black" />
        </div>
        <div className="h-2 w-32 bg-white/10 rounded-full"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full bg-white/5 rounded-lg"></div>
        <div className="h-4 w-2/3 bg-white/5 rounded-lg"></div>
        <div className="h-4 w-1/2 bg-white/5 rounded-lg"></div>
      </div>
      <div className="pt-8 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          <div className="w-12 h-1 bg-white/10 rounded-full"></div>
          <div className="w-12 h-1 bg-white/10 rounded-full"></div>
        </div>
        <Plus size={20} className="text-white/20" />
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-mono text-black/40 uppercase tracking-widest">{title}</h4>
      <ul className="space-y-4 text-xs font-bold text-black/60">
        {links.map(link => (
          <li key={link}><a href="#" className="hover:text-black transition-colors">{link}</a></li>
        ))}
      </ul>
    </div>
  );
}
