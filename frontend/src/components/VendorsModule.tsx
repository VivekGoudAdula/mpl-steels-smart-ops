
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
            className={star <= Math.round(rating) ? "fill-[#002147] text-[#002147]" : "text-gray-200"} 
          />
        ))}
        <span className="ml-2 text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 fill-none stroke-current stroke-2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Supply Chain Network</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Vendor Directory</h1>
          <p className="text-slate-500 font-medium">Manage supplier information, performance metrics, and compliance status.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="enterprise-button-primary px-8 gap-3 shadow-md shadow-slate-200"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          <span>Register New Vendor</span>
        </button>
      </div>



      {/* Filters & Search */}
      <div className="enterprise-card py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search by name, ID or contact..." 
            className="enterprise-input w-full !pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Suppliers:</span>
          <span className="text-sm font-bold text-gray-900">{vendors.length}</span>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="enterprise-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Vendor Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Primary Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Communication</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Performance</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filteredVendors.map((vendor) => (
                  <motion.tr 
                    key={vendor.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50/80 transition-all group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#002147] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 tracking-tight text-sm">{vendor.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest mt-0.5">{vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={14} className="text-gray-400" />
                        <span className="text-sm font-semibold">{vendor.contactPerson}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Mail size={12} className="text-gray-400" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Phone size={12} className="text-gray-400" />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex items-center h-full">
                      <div className="mt-2.5">
                        {renderStars(vendor.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider border",
                          vendor.status === "active" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-gray-50 text-gray-500 border-gray-200"
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-all">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200">
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200">
                          <Edit2 size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleStatus(vendor.id)}
                          className={cn(
                            "h-8 w-8 rounded-lg border border-transparent transition-all",
                            vendor.status === "active" 
                              ? "text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100" 
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50 hover:border-green-100"
                          )}
                        >
                          <UserX size={14} />
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 text-gray-300 mb-4 border border-gray-100">
                <Search size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No vendors found</h3>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-white p-6 border-b border-gray-100">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold tracking-tight text-gray-900">Register Supplier</DialogTitle>
              <DialogDescription className="text-xs text-gray-500 font-medium">
                Onboard a new vendor to the MPL Steels supply chain network.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4 bg-gray-50">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-gray-600 uppercase">Legal Entity Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Tata Steel Ltd" 
                  className="enterprise-input w-full"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact" className="text-xs font-bold text-gray-600 uppercase">Authorized Representative</Label>
                <Input 
                  id="contact" 
                  placeholder="e.g. Rajesh Kumar" 
                  className="enterprise-input w-full"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-gray-600 uppercase">Business Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="rajesh.k@tatasteel.com" 
                    className="enterprise-input w-full"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-gray-600 uppercase">Contact Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210" 
                    className="enterprise-input w-full"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-bold text-gray-600 uppercase">Operational Headquarters</Label>
                <Input 
                  id="address" 
                  placeholder="e.g. Jamshedpur, Jharkhand" 
                  className="enterprise-input w-full"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-gray-50 flex gap-3 border-t border-gray-100">
            <button 
              onClick={() => setIsAddModalOpen(false)} 
              className="enterprise-button-secondary px-6"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Discard</span>
            </button>
            <button 
              onClick={handleAddVendor} 
              className="enterprise-button-primary px-8"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-white">Confirm Registration</span>
            </button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </div>
  );
}
