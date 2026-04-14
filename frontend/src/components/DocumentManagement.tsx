
import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Download, 
  RefreshCcw, 
  File, 
  ExternalLink,
  ChevronRight,
  History,
  X,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { sampleDocuments, documentTypes, samplePOs } from "@/lib/mockData";
import { cn } from "@/lib/utils";

import DocumentViewer from "./DocumentViewer";

export default function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPO, setSelectedPO] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewerDoc, setViewerDoc] = useState<any>(null);

  const filteredDocs = useMemo(() => {
    return sampleDocuments.filter((doc) => {
      const matchesSearch = 
        doc.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPO = selectedPO === "all" || doc.poNumber === selectedPO;
      const matchesType = selectedType === "all" || doc.documentType === selectedType;

      return matchesSearch && matchesPO && matchesType;
    });
  }, [searchQuery, selectedPO, selectedType]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPO("all");
    setSelectedType("all");
  };

  const getDocTypeBadge = (type: string) => {
    const config = documentTypes.find(t => t.id === type);
    return (
      <Badge variant="outline" className={cn("font-medium", config?.color)}>
        {config?.name || type}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Management</h1>
        <p className="text-slate-500 mt-1">Centralized access to all transaction documents across the procurement lifecycle</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2.5">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-widest ml-1">Search Documents</Label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
              <Input 
                placeholder="Search by PO, GRN, Invoice, keyword..." 
                className="h-14 pl-12 pr-12 bg-white border-slate-200 rounded-2xl shadow-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-64 space-y-2.5">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-widest ml-1">PO Number</Label>
            <Select value={selectedPO} onValueChange={setSelectedPO}>
              <SelectTrigger className="h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-blue-500/20 focus:border-blue-500 px-5 text-base w-full">
                <SelectValue placeholder="All POs" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-slate-100 p-1">
                <SelectItem value="all" className="rounded-lg py-3 px-4 focus:bg-blue-50 focus:text-blue-700">
                  <div className="flex items-center gap-2">
                    {selectedPO === "all" && <Check className="w-4 h-4" />}
                    <span>All POs</span>
                  </div>
                </SelectItem>
                {samplePOs.map(po => (
                  <SelectItem key={po.id} value={po.id} className="rounded-lg py-3 px-4 focus:bg-blue-50 focus:text-blue-700">
                    <div className="flex items-center gap-2">
                      {selectedPO === po.id && <Check className="w-4 h-4" />}
                      <span>{po.id}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full lg:w-64 space-y-2.5">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-widest ml-1">Document Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-blue-500/20 focus:border-blue-500 px-5 text-base w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-slate-100 p-1">
                <SelectItem value="all" className="rounded-lg py-3 px-4 focus:bg-blue-50 focus:text-blue-700">
                  <div className="flex items-center gap-2">
                    {selectedType === "all" && <Check className="w-4 h-4" />}
                    <span>All Types</span>
                  </div>
                </SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type.id} value={type.id} className="rounded-lg py-3 px-4 focus:bg-blue-50 focus:text-blue-700">
                    <div className="flex items-center gap-2">
                      {selectedType === type.id && <Check className="w-4 h-4" />}
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            onClick={resetFilters} 
            className="h-14 px-6 rounded-2xl border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Active Filters / Chips */}
        {(selectedPO !== "all" || selectedType !== "all" || searchQuery) && (
          <div className="flex flex-wrap gap-2 items-center animate-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Active Filters:</span>
            
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
                <Search className="w-3 h-3" />
                <span className="text-xs font-bold">"{searchQuery}"</span>
                <X className="w-3 h-3 cursor-pointer hover:text-blue-900" onClick={() => setSearchQuery("")} />
              </Badge>
            )}

            {selectedPO !== "all" && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-slate-200 transition-colors">
                <span className="text-[10px] font-bold text-slate-400 uppercase">PO:</span>
                <span className="text-xs font-bold">{selectedPO}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSelectedPO("all")} />
              </Badge>
            )}

            {selectedType !== "all" && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-slate-200 transition-colors">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Type:</span>
                <span className="text-xs font-bold">{documentTypes.find(t => t.id === selectedType)?.name}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSelectedType("all")} />
              </Badge>
            )}

            <button 
              onClick={resetFilters}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline underline-offset-4 px-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Document Repository</span>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            Showing {filteredDocs.length} documents
          </span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-slate-700">TXN ID</TableHead>
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
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-20 text-slate-400 italic">
                    No documents found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => (
                  <TableRow key={doc.transactionId} className="hover:bg-slate-50 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-500">{doc.transactionId}</TableCell>
                    <TableCell className="font-bold text-slate-900">{doc.poNumber}</TableCell>
                    <TableCell className="text-slate-600">{doc.wbNumber}</TableCell>
                    <TableCell className="text-slate-600">{doc.grnNumber}</TableCell>
                    <TableCell className="text-slate-600">{doc.invoiceNumber}</TableCell>
                    <TableCell>{getDocTypeBadge(doc.documentType)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-[150px]">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate text-sm text-slate-600">{doc.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{doc.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => setViewerDoc(doc)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
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

      {/* Document Viewer Modal */}
      <DocumentViewer 
        document={viewerDoc}
        isOpen={!!viewerDoc}
        onClose={() => setViewerDoc(null)}
      />
    </div>
  );
}

