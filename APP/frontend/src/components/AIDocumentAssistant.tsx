
import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2, 
  Copy, 
  ExternalLink, 
  FileText, 
  MessageSquare,
  ChevronRight,
  Clock,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  relatedDoc?: {
    name: string;
    type: string;
    ref: string;
  };
}

const SUGGESTIONS = [
  "What is the total PO value?",
  "What are the payment terms for PO123?",
  "Show GRN quantity for last shipment",
  "Which invoice is pending?"
];

const MOCK_RESPONSES: Record<string, { content: string; doc?: Message["relatedDoc"] }> = {
  "what is the total po value?": {
    content: "The total value across all active Purchase Orders is **₹4,50,000**. This includes the latest orders for Steel Coils and Industrial Plates.",
    doc: { name: "PO Summary Report", type: "PO", ref: "PO-2024-ALL" }
  },
  "what are the payment terms for po123?": {
    content: "The payment terms for **PO123** are set to **Net 30 days** from the date of invoice receipt. This was negotiated with Vendor: Tata Steel Ltd.",
    doc: { name: "Purchase Order PO123", type: "PO", ref: "PO123" }
  },
  "show grn quantity for last shipment": {
    content: "The last recorded shipment (WB-88291) has a **GRN received quantity of 12 tons**. All 12 tons passed the initial quality inspection.",
    doc: { name: "GRN-99281", type: "GRN", ref: "GRN-99281" }
  },
  "which invoice is pending?": {
    content: "There is currently **one pending invoice** (INV/2024/042) from JSW Steels for ₹1,25,000. It is due in 5 days.",
    doc: { name: "Invoice INV/2024/042", type: "Invoice", ref: "INV/2024/042" }
  },
  "default": {
    content: "I'm sorry, I don't have specific data for that query in my current mock database. Try asking about PO values, payment terms, or recent GRNs.",
  }
};

export default function AIDocumentAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Document Assistant. I can help you find information across your POs, Weighbridge entries, GRNs, and Invoices. What would you like to know today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate AI thinking and typing
    setTimeout(() => {
      const query = text.toLowerCase().trim();
      const response = MOCK_RESPONSES[query] || MOCK_RESPONSES["default"];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedDoc: response.doc
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Chat cleared. How else can I help you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Response copied to clipboard");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8F9FA] text-slate-900 font-sans">
      {/* Header */}
      <div className="px-10 py-8 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex justify-between items-center shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-20">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Document Assistant</h1>
              <Badge variant="secondary" className="bg-slate-100 text-slate-900 border-none text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">AI Core v2.4</Badge>
            </div>
            <p className="text-slate-400 text-xs font-medium mt-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Neural semantic search active across operational data
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} className="text-slate-400 hover:text-red-600 rounded-xl font-bold text-xs">
          <Trash2 className="w-4 h-4 mr-2" />
          Purge Session
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-5 max-w-[80%]",
                    msg.role === "assistant" ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    msg.role === "assistant" ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-slate-900"
                  )}>
                    {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  
                  <div className="space-y-3">
                    <div className={cn(
                      "p-6 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed border transition-all",
                      msg.role === "assistant" 
                        ? "bg-white border-slate-100 text-slate-600 rounded-tl-none" 
                        : "bg-slate-900 border-slate-800 text-white rounded-tr-none shadow-xl shadow-slate-200"
                    )}>
                      <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>') }} />
                      
                      {msg.role === "assistant" && (
                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                            <Clock size={12} />
                            {msg.timestamp}
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-300 hover:text-slate-900 rounded-lg"
                              onClick={() => copyToClipboard(msg.content)}
                            >
                              <Copy size={14} />
                            </Button>
                            {msg.relatedDoc && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-300 hover:text-slate-900 rounded-lg"
                                title="View related document"
                              >
                                <ExternalLink size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {msg.role === "user" && (
                        <div className="mt-4 flex justify-end">
                          <span className="text-[10px] font-bold opacity-30 flex items-center gap-2">
                            {msg.timestamp}
                            <Check size={12} />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Related Document Context Card */}
                    {msg.relatedDoc && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between group cursor-pointer hover:border-slate-900 hover:shadow-xl hover:shadow-slate-100 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <FileText size={20} className="group-hover:text-white transition-all" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Context Artifact</p>
                            <p className="text-sm font-black text-slate-900 mt-1">{msg.relatedDoc.name}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-5 mr-auto"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg text-white">
                  <Bot size={20} />
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
              {messages.length < 3 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-5 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-slate-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative group">
                <div className="absolute -inset-1 bg-slate-900 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-5 transition duration-700"></div>
                <div className="relative flex items-center bg-white border border-slate-200 rounded-[2rem] p-3 shadow-2xl shadow-slate-200/50 focus-within:border-slate-900 transition-all">
                  <div className="pl-4 text-slate-300">
                    <MessageSquare size={24} />
                  </div>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder="Inquire about PO, GRN, or financial artifacts..."
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
              <p className="text-[9px] text-center text-slate-300 uppercase tracking-[0.3em] font-black">
                Neural Core v2.4 • Industrial Grade Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="hidden xl:flex w-96 border-l border-slate-200 bg-white flex-col p-10 space-y-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
            Active Context Node
          </h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-5 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
              <div className="flex items-center justify-between">
                <Badge className="bg-slate-900 text-white border-none text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">PO-123</Badge>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Active</span>
              </div>
              <p className="text-lg font-black text-slate-900 tracking-tight">Tata Steel Ltd</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Material</span>
                  <span className="text-xs font-black text-slate-900">Steel Coils</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valuation</span>
                  <span className="text-xs font-black text-slate-900 text-data">₹2,45,000</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-5 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">GRN-992</Badge>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified</span>
              </div>
              <p className="text-lg font-black text-slate-900 tracking-tight">JSW Steels</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                  <span className="text-xs font-black text-slate-900 text-data">12.5 Tons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Quality Pass</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Inquiries</h3>
            <div className="space-y-4">
              {["PO status for Tata Steel", "Pending invoices", "GRN quality reports"].map(q => (
                <div key={q} className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-3 group transition-all">
                  <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
