
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
    if (id === "Orchestrator") return { name: "Orchestrator", icon: <Cpu size={16} />, color: "text-gray-900 bg-gray-100 border-gray-200" };
    const agent = AGENTS.find(a => a.id === id);
    if (agent) {
      // Adjust colors for light theme
      return {
        ...agent,
        color: agent.color.replace("text-emerald-400", "text-green-600").replace("text-orange-400", "text-orange-600").replace("text-yellow-400", "text-yellow-600").replace("text-blue-400", "text-blue-600").replace("text-red-400", "text-red-600")
      };
    }
    return AGENTS[0];
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 border-green-100";
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-100";
      case "issue": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#002147] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">Smart Agent Node</h1>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-none text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">v4.0</Badge>
            </div>
            <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Orchestrator Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Route:</span>
            <Select value={selectedAgent} onValueChange={(v: any) => setSelectedAgent(v)}>
              <SelectTrigger className="h-6 border-none bg-transparent shadow-none focus:ring-0 text-xs font-semibold text-gray-900 p-0 w-28 uppercase">
                <SelectValue placeholder="Auto Route" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900 rounded-xl">
                <SelectItem value="Auto" className="font-semibold text-xs">Auto Route</SelectItem>
                {AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id} className="font-semibold text-xs">{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="h-6 bg-gray-200" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMessages([messages[0]])} 
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-semibold text-xs h-8 px-2"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const agent = msg.role === "assistant" ? getAgentInfo(msg.agentId) : null;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === "assistant" ? "bg-white border border-gray-200 text-gray-700" : "bg-[#002147] text-white"
                  )}>
                    {msg.role === "assistant" ? agent?.icon : <User size={16} />}
                  </div>
                  
                  <div className="space-y-1.5 min-w-[200px]">
                    {msg.role === "assistant" && (
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                        {agent?.name}
                      </p>
                    )}
                    
                    <div className={cn(
                      "p-4 rounded-xl text-sm font-medium leading-relaxed border shadow-sm",
                      msg.role === "assistant" 
                        ? "bg-white border-gray-200 text-gray-700 rounded-tl-none" 
                        : "bg-[#002147] border-[#002147] text-white rounded-tr-none"
                    )}>
                      <p>{msg.content}</p>
                      
                      {msg.actionResponse && (
                        <div className="mt-4 space-y-3">
                          {msg.actionResponse.type === "list" && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{msg.actionResponse.title}</p>
                              {msg.actionResponse.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                                  <span className="font-mono text-xs font-semibold text-gray-800">{item.label}</span>
                                  <Badge className={cn("text-[9px] font-bold uppercase px-2 py-0.5 rounded border", getStatusColor(item.status))}>
                                    {item.value}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}

                          {msg.actionResponse.type === "data-card" && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{msg.actionResponse.title}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {msg.actionResponse.items?.map((item, i) => (
                                  <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.label}</p>
                                    <p className="text-xs font-semibold text-gray-900 mt-1">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {msg.actionResponse.type === "status-card" && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-900 uppercase">{msg.actionResponse.data.id}</span>
                                <Badge variant="outline" className="text-[9px] font-bold uppercase border-yellow-200 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">
                                  {msg.actionResponse.data.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                {msg.actionResponse.data.steps.map((step: any, i: number) => (
                                  <React.Fragment key={i}>
                                    <div className="flex flex-col items-center gap-1.5 flex-1">
                                      <div className={cn(
                                        "w-6 h-6 rounded-md flex items-center justify-center border transition-all",
                                        step.status === "completed" ? "bg-green-500 border-green-600 text-white" : "bg-white border-gray-300 text-gray-300"
                                      )}>
                                        {step.status === "completed" ? <Check size={12} /> : <div className="w-1 h-1 bg-current rounded-full" />}
                                      </div>
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{step.name}</span>
                                    </div>
                                    {i < msg.actionResponse.data.steps.length - 1 && (
                                      <div className="h-px bg-gray-300 flex-1 mb-4" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {(msg.actionResponse.type === "success" || msg.actionResponse.type === "alert") && (
                            <div className={cn(
                              "border rounded-xl p-4 flex items-start gap-4",
                              msg.actionResponse.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                            )}>
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white",
                                msg.actionResponse.type === "success" ? "bg-green-600" : "bg-red-600"
                              )}>
                                {msg.actionResponse.type === "success" ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                              </div>
                              <div>
                                <p className={cn("text-xs font-bold uppercase tracking-wider", msg.actionResponse.type === "success" ? "text-green-800" : "text-red-800")}>{msg.actionResponse.title}</p>
                                <p className="text-xs font-medium text-gray-700 mt-1 leading-relaxed">{msg.actionResponse.data.message}</p>
                                <p className="text-[10px] font-mono font-semibold text-gray-500 mt-2 uppercase">Ref: {msg.actionResponse.data.id}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between opacity-50">
                        <span className="text-[9px] font-semibold">{msg.timestamp}</span>
                        {msg.role === "user" && <Check size={10} />}
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
              className="flex gap-3 mr-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm text-gray-700">
                <Cpu size={16} className="animate-spin-slow" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl rounded-tl-none shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-0 shrink-0 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {COMMAND_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:border-[#002147] hover:text-[#002147] transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="relative flex items-center bg-white border border-gray-300 rounded-xl p-1.5 shadow-sm focus-within:border-[#002147] focus-within:ring-1 focus-within:ring-[#002147] transition-all h-[56px]">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 rounded-lg w-10 h-10 ml-1">
                  <Mic size={18} />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Ask the orchestrator..."
                  className="border-none focus-visible:ring-0 text-sm font-medium bg-transparent text-gray-900 placeholder:text-gray-400 px-3 h-full outline-none"
                />
                <Button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="rounded-lg w-10 h-10 bg-[#002147] hover:bg-[#002147]/90 text-white mr-1 transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
            <div className="flex justify-center gap-6 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Activity size={10} /> Node: Active</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={10} /> Mesh: Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
