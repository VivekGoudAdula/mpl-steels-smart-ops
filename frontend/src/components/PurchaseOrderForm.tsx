
import React, { useState } from "react";
import { Save, X, FileText, Package, CreditCard, Paperclip, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./po-form/GeneralTab";
import { ItemsTab } from "./po-form/ItemsTab";
import { PaymentTab } from "./po-form/PaymentTab";
import { DocumentsTab } from "./po-form/DocumentsTab";
import { toast } from "sonner";

export default function PurchaseOrderForm() {
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

  const handleSave = () => {
    // Basic validation
    if (!formData.vendorId || items.length === 0) {
      toast.error("Please fill in required fields (Vendor and at least one Item)");
      return;
    }

    const fullData = {
      ...formData,
      items,
      files: files.map(f => f.name),
      totalAmount: items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    };

    console.log("Saving Purchase Order:", fullData);
    toast.success("Purchase Order created successfully!");
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard changes?")) {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Purchase Order</h1>
          <p className="text-slate-500 mt-1">Manage procurement and vendor orders for MPL Steels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} className="bg-white">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Save className="w-4 h-4 mr-2" />
            Save Purchase Order
          </Button>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100/50 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
            <FileText className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="items" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
            <Package className="w-4 h-4 mr-2" />
            Items
          </TabsTrigger>
          <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
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
