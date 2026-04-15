
import React from "react";
import { 
  FileText, 
  Eye, 
  Download, 
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { documentTypes } from "@/lib/mockData";

interface Document {
  transactionId: string;
  poNumber: string;
  wbNumber: string;
  grnNumber: string;
  invoiceNumber: string;
  documentType: string;
  fileName: string;
  date: string;
}

interface DocumentTableProps {
  documents: Document[];
  onView: (doc: Document) => void;
  title?: string;
  count?: number;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ 
  documents, 
  onView, 
  title = "Document Repository",
  count
}) => {
  const getDocTypeBadge = (type: string) => {
    const config = documentTypes.find(t => t.id === type);
    return (
      <Badge variant="outline" className={cn("font-medium", config?.color)}>
        {config?.name || type}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {count !== undefined ? count : documents.length} { (count !== undefined ? count : documents.length) === 1 ? 'entry' : 'entries' }
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-bold text-slate-700 py-4">TXN ID</TableHead>
              <TableHead className="font-bold text-slate-700">PO #</TableHead>
              <TableHead className="font-bold text-slate-700">WB #</TableHead>
              <TableHead className="font-bold text-slate-700">GRN #</TableHead>
              <TableHead className="font-bold text-slate-700">Invoice #</TableHead>
              <TableHead className="font-bold text-slate-700">Type</TableHead>
              <TableHead className="font-bold text-slate-700">File Name</TableHead>
              <TableHead className="font-bold text-slate-700">Date</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-20 text-slate-400 italic">
                  No documents found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.transactionId} className="hover:bg-slate-50/80 transition-colors group border-slate-100 h-16">
                  <TableCell className="font-mono text-[11px] text-slate-400 font-bold group-hover:text-slate-900 transition-colors">
                    {doc.transactionId}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{doc.poNumber}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{doc.wbNumber}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{doc.grnNumber}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{doc.invoiceNumber}</TableCell>
                  <TableCell>{getDocTypeBadge(doc.documentType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[150px]">
                      <FileText className="w-4 h-4 text-slate-300 shrink-0" />
                      <span className="truncate text-xs text-slate-600 font-medium">{doc.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs font-bold">{doc.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-lg"
                        onClick={() => onView(doc)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
