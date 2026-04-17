export interface ERPTransaction {
  txn_id: string;
  po_number: string;
  wb_number: string;
  grn_number: string;
  invoice_number: string;
  date: string;
  status: string;
  documents?: any[]; // optional, kept for frontend compatibility
}

// Generate a dummy txn_id grouping by PO number if needed
const generateTxnId = (poNumber: string) => `TXN-${poNumber}`;

const mockData: ERPTransaction[] = [
  {
    txn_id: generateTxnId("PO-001"),
    po_number: "PO-001",
    wb_number: "WB-1001",
    grn_number: "GRN-2001",
    invoice_number: "INV-3001",
    date: new Date().toISOString(),
    status: "Completed",
    documents: [],
  },
  {
    txn_id: generateTxnId("PO-002"),
    po_number: "PO-002",
    wb_number: "WB-1002",
    grn_number: "GRN-2002",
    invoice_number: "INV-3002",
    date: new Date(Date.now() - 86400000).toISOString(),
    status: "Pending",
    documents: [],
  },
  {
    txn_id: generateTxnId("PO-003"),
    po_number: "PO-003",
    wb_number: "-",
    grn_number: "-",
    invoice_number: "-",
    date: new Date(Date.now() - 172800000).toISOString(),
    status: "PO Created",
    documents: [],
  },
  {
    txn_id: generateTxnId("PO-004"),
    po_number: "PO-004",
    wb_number: "WB-1004",
    grn_number: "-",
    invoice_number: "-",
    date: new Date(Date.now() - 259200000).toISOString(),
    status: "Weighed",
    documents: [],
  },
  {
    txn_id: generateTxnId("PO-005"),
    po_number: "PO-005",
    wb_number: "WB-1005",
    grn_number: "GRN-2005",
    invoice_number: "-",
    date: new Date(Date.now() - 345600000).toISOString(),
    status: "GRN Received",
    documents: [],
  }
];

export const fetchPOs = async (): Promise<ERPTransaction[]> => {
  // PO tab shows all records that have at least a PO number
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.filter(d => d.po_number && d.po_number !== "-"));
    }, 800);
  });
};

export const fetchWB = async (): Promise<ERPTransaction[]> => {
  // WB tab ONLY shows records that have reached the Weighbridge stage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.filter(d => d.wb_number && d.wb_number !== "-"));
    }, 800);
  });
};

export const fetchGRN = async (): Promise<ERPTransaction[]> => {
  // GRN tab ONLY shows records that have reached the GRN stage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.filter(d => d.grn_number && d.grn_number !== "-"));
    }, 800);
  });
};

export const fetchInvoices = async (): Promise<ERPTransaction[]> => {
  // Invoice tab ONLY shows records that have reached the Invoice stage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.filter(d => d.invoice_number && d.invoice_number !== "-"));
    }, 800);
  });
};
