
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
      <div className="px-8 py-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[#002147] flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">Document Assistant</h1>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">AI Core v2.4</Badge>
            </div>
            <p className="text-gray-500 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Neural semantic search active across operational data
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-500 hover:text-red-600 rounded text-xs font-bold enterprise-button bg-white border border-gray-200 hover:bg-gray-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Purge Session
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative bg-white">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === "assistant" ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded flex items-center justify-center shrink-0 mt-1",
                    msg.role === "assistant" ? "bg-[#002147] text-white" : "bg-gray-100 border border-gray-200 text-gray-700"
                  )}>
                    {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={cn(
                      "p-4 rounded shadow-sm text-sm font-medium leading-relaxed border transition-all",
                      msg.role === "assistant" 
                        ? "bg-gray-50 border-gray-200 text-gray-700" 
                        : "bg-[#002147] border-[#001733] text-white"
                    )}>
                      <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-current">$1</strong>') }} />
                      
                      {msg.role === "assistant" && (
                        <div className="mt-4 pt-3 border-t border-gray-200/50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5">
                            <Clock size={10} />
                            {msg.timestamp}
                          </span>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-400 hover:text-gray-900 rounded"
                              onClick={() => copyToClipboard(msg.content)}
                            >
                              <Copy size={12} />
                            </Button>
                            {msg.relatedDoc && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-gray-400 hover:text-gray-900 rounded"
                                title="View related document"
                              >
                                <ExternalLink size={12} />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {msg.role === "user" && (
                        <div className="mt-2 flex justify-end">
                          <span className="text-[10px] font-bold opacity-50 flex items-center gap-1.5 text-white">
                            {msg.timestamp}
                            <Check size={10} />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Related Document Context Card */}
                    {msg.relatedDoc && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between group cursor-pointer hover:border-[#002147] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2 rounded border border-blue-100 group-hover:bg-[#002147] group-hover:text-white transition-colors">
                            <FileText size={16} className="text-blue-600 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Context Reference</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">{msg.relatedDoc.name}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-[#002147]" />
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
                className="flex gap-4 mr-auto"
              >
                <div className="w-8 h-8 rounded bg-[#002147] flex items-center justify-center shrink-0 text-white mt-1">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 pt-2 bg-white border-t border-gray-100 shrink-0">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Suggestions */}
              {messages.length < 3 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:border-[#002147] hover:text-[#002147] transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative flex items-center bg-white border border-gray-300 rounded p-1 shadow-sm focus-within:border-[#002147] focus-within:ring-1 focus-within:ring-[#002147]/20 transition-all">
                <div className="pl-3 pr-2 text-gray-400">
                  <MessageSquare size={18} />
                </div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Inquire about PO, GRN, or financial artifacts..."
                  className="border-none focus-visible:ring-0 text-sm font-medium bg-transparent text-gray-900 placeholder:text-gray-400 h-10 w-full"
                />
                <Button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="rounded w-10 h-10 bg-[#002147] hover:bg-[#001733] text-white shrink-0 ml-1 disabled:opacity-50"
                  size="icon"
                >
                  <Send size={16} />
                </Button>
              </div>
              <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest font-bold">
                Neural Core v2.4 • Industrial Grade Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="hidden xl:flex w-80 border-l border-gray-200 bg-gray-50 flex-col p-6 space-y-6">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#002147]"></div>
            Active Context Node
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white rounded border border-gray-200 space-y-4 group hover:border-[#002147] transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <Badge className="bg-[#002147] text-white border-none text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">PO-123</Badge>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Active</span>
              </div>
              <p className="text-base font-bold text-gray-900">Tata Steel Ltd</p>
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Material</span>
                  <span className="text-xs font-bold text-gray-900">Steel Coils</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valuation</span>
                  <span className="text-xs font-bold text-gray-900">₹2,45,000</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded border border-gray-200 space-y-4 group hover:border-[#002147] transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-600 text-white border-none text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">GRN-992</Badge>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Verified</span>
              </div>
              <p className="text-base font-bold text-gray-900">JSW Steels</p>
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quantity</span>
                  <span className="text-xs font-bold text-gray-900">12.5 Tons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Quality Pass</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent Inquiries</h3>
            <div className="space-y-3">
              {["PO status for Tata Steel", "Pending invoices", "GRN quality reports"].map(q => (
                <div key={q} className="text-xs font-bold text-gray-700 hover:text-[#002147] cursor-pointer flex items-center gap-2 group transition-colors">
                  <ChevronRight size={12} className="text-gray-400 group-hover:text-[#002147]" />
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
