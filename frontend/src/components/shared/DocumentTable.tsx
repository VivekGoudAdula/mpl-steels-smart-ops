import React, { useState } from "react";
import { 
  FileText, 
  Eye, 
  Trash2,
  History,
  AlertTriangle,
  Scale,
  Package,
  FileSpreadsheet,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Transaction, documentTypes } from "@/lib/mockData";
import { toast } from "sonner";

interface DocumentTableProps {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
  onUpload?: (transaction: Transaction) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ 
  transactions, 
  onView,
  onUpload
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteTxn, setPendingDeleteTxn] = useState<string | null>(null);

  const getDocTypeColor = (type: string) => {
    const config = documentTypes.find(t => t.id === type);
    return config?.color || "bg-slate-100 text-slate-700";
  };

  const initiateDelete = (txnId: string) => {
    setPendingDeleteTxn(txnId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteTxn) {
      toast.error(`Transaction ${pendingDeleteTxn} permanently deleted`);
      setDeleteConfirmOpen(false);
      setPendingDeleteTxn(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="professional-table-header pl-6"># Txn ID</TableHead>
            <TableHead className="professional-table-header">PO Number</TableHead>
            <TableHead className="professional-table-header">WB Number</TableHead>
            <TableHead className="professional-table-header">GRN Number</TableHead>
            <TableHead className="professional-table-header">Invoice Number</TableHead>
            <TableHead className="professional-table-header">Documents</TableHead>
            <TableHead className="professional-table-header">Latest activity</TableHead>
            <TableHead className="professional-table-header text-right pr-6">Management</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-20 text-gray-400 italic">
                No transactions found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((txn, index) => (
              <TableRow key={txn.txnId} className="hover:bg-slate-50/50 transition-colors border-slate-100 h-20 group">
                <TableCell className="pl-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{txn.txnId}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5 tracking-tighter uppercase">ID Index: {index + 1}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-600">
                  {txn.poNumber}
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-600 font-mono">
                  {txn.wbNumber}
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-600 font-mono">
                  {txn.grnNumber}
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-600 font-mono">
                  {txn.invoiceNumber}
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => onView(txn)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 text-slate-600 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all active:scale-95"
                  >
                    <div className="flex -space-x-2">
                      {txn.documents.slice(0, 3).map((doc) => (
                        <div key={doc.id} className={cn(
                          "w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center text-[8px] font-black shadow-sm",
                          getDocTypeColor(doc.type)
                        )}>
                          {doc.type.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider ml-1">
                      {txn.documents.length} Files
                    </span>
                  </button>
                </TableCell>
                <TableCell className="text-slate-400 text-[11px] font-bold uppercase tracking-widest font-mono">{txn.date}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end items-center gap-1.5 transition-all">
                    <button 
                      title="View Docs"
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all h-9 w-9 flex items-center justify-center outline-none"
                      onClick={() => onView(txn)}
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      title="Add Doc"
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all h-9 w-9 flex items-center justify-center outline-none"
                      onClick={() => onUpload?.(txn)}
                    >
                      <Plus className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      title="Archive"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all h-9 w-9 flex items-center justify-center outline-none"
                      onClick={() => initiateDelete(txn.txnId)}
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border-none shadow-2xl">
          <DialogHeader className="items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
              <AlertTriangle size={28} />
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Archive Transaction?</DialogTitle>
            <p className="text-sm text-slate-500 mt-2 font-medium px-4">
              You are about to archive transaction <b className="text-slate-900">{pendingDeleteTxn}</b>. This will hide all linked files from the primary repository.
            </p>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="rounded-2xl font-bold text-[10px] h-12 px-8 uppercase tracking-widest border-slate-200">Cancel</Button>
            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700 rounded-2xl font-bold text-[10px] h-12 px-10 uppercase tracking-widest shadow-xl shadow-red-200">Archive Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
