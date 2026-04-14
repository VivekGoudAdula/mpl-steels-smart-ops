
import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  User,
  Eye,
  Edit2,
  UserX,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  status: "active" | "inactive";
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: "V001",
    name: "Tata Steel",
    contactPerson: "Rajesh Kumar",
    email: "rajesh.k@tatasteel.com",
    phone: "+91 98765 43210",
    address: "Jamshedpur, Jharkhand",
    rating: 4.8,
    status: "active",
  },
  {
    id: "V002",
    name: "JSW Steel",
    contactPerson: "Amit Shah",
    email: "amit.s@jsw.in",
    phone: "+91 98765 43211",
    address: "Bellary, Karnataka",
    rating: 4.5,
    status: "active",
  },
  {
    id: "V003",
    name: "SAIL",
    contactPerson: "Sanjay Gupta",
    email: "sanjay.g@sail.co.in",
    phone: "+91 98765 43212",
    address: "Bhilai, Chhattisgarh",
    rating: 4.2,
    status: "inactive",
  },
];

export default function VendorsModule() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newVendor, setNewVendor] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const vendor: Vendor = {
      id: "V" + Math.floor(1000 + Math.random() * 9000),
      ...newVendor,
      rating: 0,
      status: "active",
    };

    setVendors([vendor, ...vendors]);
    setIsAddModalOpen(false);
    setNewVendor({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    });
    toast.success("Vendor added successfully");
  };

  const toggleStatus = (id: string) => {
    setVendors(vendors.map(v => 
      v.id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v
    ));
    toast.info("Vendor status updated");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            size={12} 
            className={star <= Math.round(rating) ? "fill-slate-900 text-slate-900" : "text-slate-200"} 
          />
        ))}
        <span className="ml-2 text-xs font-black text-slate-900 text-data">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-slate-900 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Supply Chain</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Vendor Directory</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">Manage supplier information, performance metrics, and compliance status.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-6 h-11 font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register New Vendor
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search by name, ID or contact..." 
            className="pl-12 bg-slate-50/50 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl text-sm transition-all h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Suppliers:</span>
          <span className="text-sm font-black text-slate-900 text-data">{vendors.length}</span>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vendor Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Primary Contact</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Communication</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Performance</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredVendors.map((vendor) => (
                  <motion.tr 
                    key={vendor.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-slate-100">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-tight">{vendor.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest mt-0.5">{vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User size={14} className="text-slate-400" />
                        <span className="text-sm font-bold">{vendor.contactPerson}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Mail size={12} className="text-slate-300" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Phone size={12} className="text-slate-300" />
                          <span className="text-data">{vendor.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {renderStars(vendor.rating)}
                    </td>
                    <td className="px-8 py-5">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2",
                          vendor.status === "active" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        )}
                      >
                        {vendor.status === "active" ? (
                          <CheckCircle2 size={10} className="mr-1.5" />
                        ) : (
                          <AlertCircle size={10} className="mr-1.5" />
                        )}
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200">
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleStatus(vendor.id)}
                          className={cn(
                            "h-9 w-9 rounded-xl border border-transparent transition-all",
                            vendor.status === "active" 
                              ? "text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100" 
                              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                          )}
                        >
                          <UserX size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredVendors.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No vendors found</h3>
              <p className="text-slate-500">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Register Supplier</DialogTitle>
              <DialogDescription className="text-slate-400 font-medium">
                Onboard a new vendor to the MPL Steels supply chain network.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Entity Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Tata Steel Ltd" 
                  className="rounded-xl border-slate-200 focus:ring-slate-900 h-11"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Representative</Label>
                <Input 
                  id="contact" 
                  placeholder="e.g. Rajesh Kumar" 
                  className="rounded-xl border-slate-200 focus:ring-slate-900 h-11"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="rajesh.k@tatasteel.com" 
                    className="rounded-xl border-slate-200 focus:ring-slate-900 h-11"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210" 
                    className="rounded-xl border-slate-200 focus:ring-slate-900 h-11"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Headquarters</Label>
                <Input 
                  id="address" 
                  placeholder="e.g. Jamshedpur, Jharkhand" 
                  className="rounded-xl border-slate-200 focus:ring-slate-900 h-11"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-0 flex gap-3">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl font-bold text-slate-500">Discard</Button>
            <Button onClick={handleAddVendor} className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 h-11 font-bold shadow-lg shadow-slate-200">Confirm Registration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
