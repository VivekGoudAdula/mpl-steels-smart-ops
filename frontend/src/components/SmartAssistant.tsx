
import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Zap, 
  Trash2, 
  ChevronRight,
  Clock,
  Check,
  Mic,
  History,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  Activity,
  Package,
  FileCheck,
  CreditCard,
  PlusCircle,
  ShoppingCart,
  Scale,
  ClipboardCheck,
  ReceiptText,
  ShieldAlert,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

type AgentType = "PO" | "WB" | "GRN" | "Invoice" | "Incident" | "Orchestrator";

interface Agent {
  id: AgentType;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const AGENTS: Agent[] = [
  { id: "PO", name: "PO Agent", icon: <ShoppingCart size={16} />, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", description: "Procurement & Purchase Orders" },
  { id: "WB", name: "WB Agent", icon: <Scale size={16} />, color: "text-orange-400 bg-orange-400/10 border-orange-400/20", description: "Logistics & Weighbridge" },
  { id: "GRN", name: "GRN Agent", icon: <ClipboardCheck size={16} />, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", description: "Material Validation" },
  { id: "Invoice", name: "Invoice Agent", icon: <ReceiptText size={16} />, color: "text-blue-400 bg-blue-400/10 border-blue-400/20", description: "Billing & Finance" },
  { id: "Incident", name: "Incident Agent", icon: <ShieldAlert size={16} />, color: "text-red-400 bg-red-400/10 border-red-400/20", description: "Safety & Operational Issues" },
];

interface ActionResponse {
  type: "list" | "status-card" | "success" | "info" | "alert" | "data-card";
  title?: string;
  items?: { label: string; value: string; status?: "completed" | "pending" | "issue" }[];
  data?: any;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  agentId?: AgentType;
  content: string;
  timestamp: string;
  actionResponse?: ActionResponse;
}

const COMMAND_SUGGESTIONS = [
  "Track PO123",
  "Show WB details",
  "Check GRN status",
  "List unpaid invoices",
  "Create incident"
];

const MOCK_ACTIONS: Record<string, { agent: AgentType; response: Message["actionResponse"]; content: string }> = {
  "track po123": {
    agent: "PO",
    content: "I've retrieved the status for PO123. It is currently in the approval phase.",
    response: {
      type: "status-card",
      title: "PO123 Tracking",
      data: {
        id: "PO123",
        status: "In Progress",
        steps: [
          { name: "Created", status: "completed" },
          { name: "Approval", status: "pending" },
          { name: "Issued", status: "pending" }
        ]
      }
    }
  },
  "show wb details": {
    agent: "WB",
    content: "Here are the details for the latest Weighbridge entry.",
    response: {
      type: "data-card",
      title: "WB001 Details",
      items: [
        { label: "Vehicle", value: "MH-12-AB-1234" },
        { label: "Net Weight", value: "12.5 Tons", status: "completed" },
        { label: "Entry Time", value: "10:30 AM" }
      ]
    }
  },
  "check grn status": {
    agent: "GRN",
    content: "GRN045 has been successfully verified by the quality team.",
    response: {
      type: "success",
      title: "GRN Verified",
      data: {
        message: "Material validation complete for GRN045.",
        id: "GRN045"
      }
    }
  },
  "list unpaid invoices": {
    agent: "Invoice",
    content: "I found 2 pending invoices that require your attention.",
    response: {
      type: "list",
      title: "Pending Invoices",
      items: [
        { label: "INV778", value: "Pending", status: "pending" },
        { label: "INV779", value: "Paid", status: "completed" }
      ]
    }
  },
  "create incident": {
    agent: "Incident",
    content: "Operational incident has been logged in the system.",
    response: {
      type: "alert",
      title: "Incident Created",
      data: {
        message: "Incident ID INC001 has been assigned to the safety officer.",
        id: "INC001"
      }
    }
  }
};

export default function SmartAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      agentId: "Orchestrator",
      content: "Multi-agent system online. I can route your requests to specialized agents for PO, Weighbridge, GRN, Invoices, or Incidents. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType | "Auto">("Auto");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI processing & routing
    setTimeout(() => {
      const query = text.toLowerCase().trim();
      let routedAgent: AgentType = "Orchestrator";
      let action = null;
      let responseContent = "I'm orchestrating your request across specialized agents.";

      // Simple routing logic
      if (query.includes("po")) routedAgent = "PO";
      else if (query.includes("wb") || query.includes("weighbridge")) routedAgent = "WB";
      else if (query.includes("grn")) routedAgent = "GRN";
      else if (query.includes("invoice")) routedAgent = "Invoice";
      else if (query.includes("incident")) routedAgent = "Incident";

      // Match mock actions
      for (const key in MOCK_ACTIONS) {
        if (query.includes(key)) {
          const mock = MOCK_ACTIONS[key];
          routedAgent = mock.agent;
          action = mock.response;
          responseContent = mock.content;
          break;
        }
      }

      if (!action && routedAgent === "Orchestrator") {
        responseContent = "I couldn't identify a specific agent for this task. Please use one of the suggested commands or select an agent manually.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        agentId: routedAgent,
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionResponse: action || undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentInfo = (id?: AgentType) => {
    if (id === "Orchestrator") return { name: "Orchestrator", icon: <Cpu size={16} />, color: "text-slate-900 bg-slate-50 border-slate-100" };
    const agent = AGENTS.find(a => a.id === id);
    if (agent) {
      // Adjust colors for light theme
      return {
        ...agent,
        color: agent.color.replace("text-emerald-400", "text-emerald-600").replace("text-orange-400", "text-orange-600").replace("text-yellow-400", "text-yellow-600").replace("text-blue-400", "text-blue-600").replace("text-red-400", "text-red-600")
      };
    }
    return AGENTS[0];
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "pending": return "text-amber-600 bg-amber-50 border-amber-100";
      case "issue": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8F9FA] text-slate-900 font-sans">
      {/* Header */}
      <div className="px-10 py-8 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex justify-between items-center shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-20">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Smart Agent</h1>
              <Badge variant="secondary" className="bg-slate-100 text-slate-900 border-none text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Orchestrator v4.0</Badge>
            </div>
            <p className="text-slate-400 text-xs font-medium mt-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Autonomous multi-agent operations node active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Node:</span>
            <Select value={selectedAgent} onValueChange={(v: any) => setSelectedAgent(v)}>
              <SelectTrigger className="h-7 border-none bg-transparent shadow-none focus:ring-0 text-xs font-black text-slate-900 p-0 w-32 uppercase tracking-wider">
                <SelectValue placeholder="Auto Route" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl">
                <SelectItem value="Auto" className="font-bold">Auto Route</SelectItem>
                {AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id} className="font-bold">{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="h-10 bg-slate-200" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMessages([messages[0]])} 
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Purge History
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Bonus Text */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-sm">
            Neural Orchestration Active
          </Badge>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const agent = msg.role === "assistant" ? getAgentInfo(msg.agentId) : null;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-5 max-w-[80%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    msg.role === "assistant" ? "bg-white border border-slate-100 text-slate-900" : "bg-slate-900 text-white"
                  )}>
                    {msg.role === "assistant" ? agent?.icon : <User size={20} />}
                  </div>
                  
                  <div className="space-y-3">
                    {msg.role === "assistant" && (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                        Node: <span className="text-slate-900">{agent?.name}</span>
                      </p>
                    )}
                    
                    <div className={cn(
                      "p-6 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed border transition-all",
                      msg.role === "assistant" 
                        ? "bg-white border-slate-100 text-slate-600 rounded-tl-none" 
                        : "bg-slate-900 border-slate-800 text-white rounded-tr-none shadow-xl shadow-slate-200"
                    )}>
                      <p>{msg.content}</p>
                      
                      {msg.actionResponse && (
                        <div className="mt-6 space-y-4">
                          {msg.actionResponse.type === "list" && (
                            <div className="space-y-3">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{msg.actionResponse.title}</p>
                              {msg.actionResponse.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                                  <span className="font-mono text-xs font-black text-slate-900">{item.label}</span>
                                  <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2", getStatusColor(item.status))}>
                                    {item.value}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}

                          {msg.actionResponse.type === "data-card" && (
                            <div className="space-y-3">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{msg.actionResponse.title}</p>
                              <div className="grid grid-cols-2 gap-3">
                                {msg.actionResponse.items?.map((item, i) => (
                                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{item.label}</p>
                                    <p className="text-sm font-black text-slate-900 mt-1.5 tracking-tight">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {msg.actionResponse.type === "status-card" && (
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-6">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{msg.actionResponse.data.id}</span>
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-amber-200 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                  {msg.actionResponse.data.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                {msg.actionResponse.data.steps.map((step: any, i: number) => (
                                  <React.Fragment key={i}>
                                    <div className="flex flex-col items-center gap-2 flex-1">
                                      <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all",
                                        step.status === "completed" ? "bg-emerald-500 border-emerald-100 text-white shadow-lg shadow-emerald-50" : "bg-white border-slate-200 text-slate-300"
                                      )}>
                                        {step.status === "completed" ? <Check size={14} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                                      </div>
                                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{step.name}</span>
                                    </div>
                                    {i < msg.actionResponse.data.steps.length - 1 && (
                                      <div className="h-0.5 bg-slate-200 flex-1 mb-5 rounded-full" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {(msg.actionResponse.type === "success" || msg.actionResponse.type === "alert") && (
                            <div className={cn(
                              "border-2 rounded-3xl p-6 flex items-start gap-5",
                              msg.actionResponse.type === "success" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                            )}>
                              <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                msg.actionResponse.type === "success" ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-red-500 text-white shadow-red-100"
                              )}>
                                {msg.actionResponse.type === "success" ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
                              </div>
                              <div>
                                <p className={cn("text-sm font-black uppercase tracking-widest", msg.actionResponse.type === "success" ? "text-emerald-700" : "text-red-700")}>{msg.actionResponse.title}</p>
                                <p className="text-sm font-medium text-slate-600 mt-1 leading-relaxed">{msg.actionResponse.data.message}</p>
                                <p className="text-[10px] font-mono font-bold text-slate-400 mt-3 uppercase tracking-widest">Ref: {msg.actionResponse.data.id}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between opacity-30">
                        <span className="text-[10px] font-bold">{msg.timestamp}</span>
                        {msg.role === "user" && <Check size={12} />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-5 mr-auto"
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-lg text-slate-900">
                <Cpu size={20} className="animate-spin-slow" />
              </div>
              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] rounded-tl-none shadow-sm flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-10 pt-0 shrink-0 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Suggestions */}
            <div className="flex flex-wrap gap-3 justify-center">
              {COMMAND_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-5 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-slate-100"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-slate-900 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-5 transition duration-700"></div>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-[2rem] p-3 shadow-2xl shadow-slate-200/50 focus-within:border-slate-900 transition-all">
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-900 rounded-2xl w-12 h-12">
                  <Mic size={24} />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Command the orchestrator..."
                  className="border-none focus-visible:ring-0 text-base font-medium bg-transparent text-slate-900 placeholder:text-slate-300 px-4"
                />
                <Button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="rounded-2xl w-14 h-14 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all hover:scale-[1.05] disabled:opacity-20"
                >
                  <Send size={22} />
                </Button>
              </div>
            </div>
            <div className="flex justify-center gap-8 text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><Activity size={12} /> Neural Link: Stable</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={12} /> Multi-Agent Mesh: Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
