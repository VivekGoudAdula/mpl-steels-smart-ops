
import React, { useState } from "react";
import { Save, X, FileText, Package, CreditCard, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "../po-form/GeneralTab";
import { ItemsTab } from "../po-form/ItemsTab";
import { PaymentTab } from "../po-form/PaymentTab";
import { DocumentsTab } from "../po-form/DocumentsTab";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface PurchaseOrderFormProps {
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function PurchaseOrderForm({ isModal, onClose, onSuccess }: PurchaseOrderFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    poNumber: "PO-" + Math.floor(1000 + Math.random() * 9000),
    poDate: new Date(),
    vendorId: "",
    purchaseType: "",
    contractRef: "",
    billingType: "",
    contactPerson: "",
    contactEmail: "",
    consignee: "",
    billingAddress: "",
    shippingAddress: "",
    transportType: "",
    fromLocation: "",
    toLocation: "",
    paymentMode: "",
    paymentDays: 0,
  });

  const [items, setItems] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.vendorId || items.length === 0) {
      toast.error("Please fill in required fields (Vendor and at least one Item)");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        po_number: formData.poNumber,
        vendor_id: formData.vendorId,
        material: items[0].name,
        quantity: items[0].quantity,
        rate: items[0].rate,
      };

      await api.post("/transactions", payload);
      toast.success("Purchase Order created successfully!");
      
      if (onSuccess) onSuccess();
      else if (onClose) onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to create Purchase Order. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("bg-white", isModal ? "p-8" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8")}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isModal ? "New Purchase Order" : "Create Purchase Order"}
          </h1>
          <p className="text-slate-500 mt-1">Manage procurement and vendor orders for MPL Steels</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="enterprise-button-secondary px-6 flex items-center gap-2 group"
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="enterprise-button-primary px-8 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Save Purchase Order</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 p-1 rounded-xl h-[48px]">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-wider h-full">
            <FileText className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="items" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-wider h-full">
            <Package className="w-4 h-4 mr-2" />
            Items
          </TabsTrigger>
          <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-wider h-full">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-wider h-full">
            <Paperclip className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>
        <TabsContent value="items">
          <ItemsTab items={items} setItems={setItems} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsTab files={files} setFiles={setFiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
