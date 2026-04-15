
export const vendors = [
  { id: "v1", name: "Global Steel Corp" },
  { id: "v2", name: "Iron & Alloy Industries" },
  { id: "v3", name: "Precision Metals Ltd" },
  { id: "v4", name: "Apex Mining Solutions" },
  { id: "v5", name: "Titanium Tech Systems" },
];

export const purchaseTypes = [
  { id: "raw", name: "Raw Material" },
  { id: "machinery", name: "Machinery & Equipment" },
  { id: "consumables", name: "Consumables" },
  { id: "services", name: "Maintenance Services" },
];

export const billingTypes = [
  { id: "standard", name: "Standard Billing" },
  { id: "milestone", name: "Milestone Based" },
  { id: "advance", name: "Advance Payment" },
];

export const transportTypes = [
  { id: "road", name: "Road Transport" },
  { id: "rail", name: "Rail Freight" },
  { id: "sea", name: "Sea Freight" },
  { id: "air", name: "Air Cargo" },
];

export const samplePOs = [
  { 
    id: "PO123", 
    vendorName: "Tata Steel", 
    materialType: "Hot Rolled Coils",
    quantity: 50,
    unit: "Tons"
  },
  { 
    id: "PO124", 
    vendorName: "JSW Steel", 
    materialType: "Iron Ore Pellets",
    quantity: 100,
    unit: "Tons"
  },
  { 
    id: "PO125", 
    vendorName: "Global Steel Corp", 
    materialType: "Steel Billets",
    quantity: 30,
    unit: "Tons"
  }
];

export const sampleWBEntries = [
  {
    id: "WB-88231",
    poId: "PO123",
    vehicleNumber: "MH-12-GT-4455",
    netWeight: 48.5,
    unit: "Tons",
    entryDate: "2024-04-10"
  },
  {
    id: "WB-88232",
    poId: "PO123",
    vehicleNumber: "MH-12-GT-4456",
    netWeight: 49.2,
    unit: "Tons",
    entryDate: "2024-04-11"
  },
  {
    id: "WB-99102",
    poId: "PO124",
    vehicleNumber: "KA-01-MJ-9901",
    netWeight: 98.8,
    unit: "Tons",
    entryDate: "2024-04-12"
  }
];

export const sampleGRNEntries = [
  {
    id: "GRN-1001",
    poId: "PO123",
    wbId: "WB-88231",
    acceptedQty: 48.0,
    materialType: "Hot Rolled Coils",
    vendorName: "Tata Steel",
    poValue: 2400000 // 50T * 48000
  },
  {
    id: "GRN-1002",
    poId: "PO124",
    wbId: "WB-99102",
    acceptedQty: 98.5,
    materialType: "Iron Ore Pellets",
    vendorName: "JSW Steel",
    poValue: 1200000 // 100T * 12000
  }
];

export const documentTypes = [
  { id: "PO", name: "Purchase Order", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "WB", name: "Weighbridge Slip", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "GRN", name: "Goods Receipt Note", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "Invoice", name: "Supplier Invoice", color: "bg-purple-100 text-purple-700 border-purple-200" },
];

export const sampleDocuments = [
  {
    transactionId: "TXN001",
    poNumber: "PO123",
    wbNumber: "WB-88231",
    grnNumber: "GRN-1001",
    invoiceNumber: "INV-2024-001",
    documentType: "PO",
    fileName: "PO_123_TataSteel.pdf",
    date: "2024-04-01"
  },
  {
    transactionId: "TXN002",
    poNumber: "PO123",
    wbNumber: "WB-88231",
    grnNumber: "GRN-1001",
    invoiceNumber: "INV-2024-001",
    documentType: "WB",
    fileName: "WB_88231_Entry.pdf",
    date: "2024-04-10"
  },
  {
    transactionId: "TXN003",
    poNumber: "PO123",
    wbNumber: "WB-88231",
    grnNumber: "GRN-1001",
    invoiceNumber: "INV-2024-001",
    documentType: "GRN",
    fileName: "GRN_1001_Verified.pdf",
    date: "2024-04-11"
  },
  {
    transactionId: "TXN004",
    poNumber: "PO123",
    wbNumber: "WB-88231",
    grnNumber: "GRN-1001",
    invoiceNumber: "INV-2024-001",
    documentType: "Invoice",
    fileName: "INV_2024_001_Tata.pdf",
    date: "2024-04-15"
  },
  {
    transactionId: "TXN005",
    poNumber: "PO124",
    wbNumber: "WB-99102",
    grnNumber: "GRN-1002",
    invoiceNumber: "INV-2024-002",
    documentType: "PO",
    fileName: "PO_124_JSW.pdf",
    date: "2024-04-05"
  },
  {
    transactionId: "TXN006",
    poNumber: "PO124",
    wbNumber: "WB-99102",
    grnNumber: "GRN-1002",
    invoiceNumber: "INV-2024-002",
    documentType: "WB",
    fileName: "WB_99102_JSW.pdf",
    date: "2024-04-12"
  },
  {
    transactionId: "TXN007",
    poNumber: "PO124",
    wbNumber: "WB-99102",
    grnNumber: "GRN-1002",
    invoiceNumber: "INV-2024-002",
    documentType: "GRN",
    fileName: "GRN_1002_JSW.pdf",
    date: "2024-04-13"
  },
  {
    transactionId: "TXN008",
    poNumber: "PO125",
    wbNumber: "-",
    grnNumber: "-",
    invoiceNumber: "-",
    documentType: "PO",
    fileName: "PO_125_GlobalSteel.pdf",
    date: "2024-04-08"
  }
];
