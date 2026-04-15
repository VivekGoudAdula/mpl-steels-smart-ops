
import React from "react";
import { Search, X, RefreshCcw, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPO?: string;
  setSelectedPO?: (po: string) => void;
  selectedType?: string;
  setSelectedType?: (type: string) => void;
  resetFilters: () => void;
  samplePOs?: { id: string }[];
  documentTypes?: { id: string, name: string }[];
  placeholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedPO,
  setSelectedPO,
  selectedType,
  setSelectedType,
  resetFilters,
  samplePOs = [],
  documentTypes = [],
  placeholder = "Search documents..."
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-center bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 transition-all duration-300">
      {/* Search Input - dominant width */}
      <div className="relative flex-[2.5] w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-all duration-300 group-focus-within:text-blue-500 group-focus-within:scale-110" />
        <Input
          placeholder={placeholder}
          className="h-12 pl-12 pr-12 bg-slate-50 border-transparent rounded-xl focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:border-blue-400 focus-visible:bg-white transition-all duration-200 text-sm font-medium placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors animate-in fade-in zoom-in duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Select Box 1: PO Selection */}
      {setSelectedPO && (
        <div className="w-full lg:flex-1 min-w-[160px]">
          <Select value={selectedPO} onValueChange={setSelectedPO}>
            <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 px-4 text-sm font-semibold text-slate-700">
              <SelectValue placeholder="PO Number" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-2xl border-slate-100 p-1 bg-white ring-1 ring-slate-200/50">
              <SelectItem value="all" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 focus:text-blue-600 cursor-pointer text-sm font-semibold transition-colors">
                <div className="flex items-center gap-2">
                  <span>All POs</span>
                </div>
              </SelectItem>
              {samplePOs.map((po) => (
                <SelectItem key={po.id} value={po.id} className="rounded-lg py-2.5 px-3 focus:bg-slate-50 focus:text-blue-600 cursor-pointer text-sm font-semibold transition-colors">
                  <div className="flex items-center gap-2">
                    <span>{po.id}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Select Box 2: Document Types */}
      {setSelectedType && (
        <div className="w-full lg:flex-1 min-w-[160px]">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl hover:border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 px-4 text-sm font-semibold text-slate-700">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-2xl border-slate-100 p-1 bg-white ring-1 ring-slate-200/50">
              <SelectItem value="all" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 focus:text-blue-600 cursor-pointer text-sm font-semibold transition-colors">
                <div className="flex items-center gap-2">
                  <span>All Types</span>
                </div>
              </SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id} className="rounded-lg py-2.5 px-3 focus:bg-slate-50 focus:text-blue-600 cursor-pointer text-sm font-semibold transition-colors">
                  <div className="flex items-center gap-2">
                    <span>{type.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reset Button */}
      <Button
        variant="ghost"
        onClick={resetFilters}
        className="h-12 px-6 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 active:scale-95 transition-all font-bold text-xs uppercase tracking-widest whitespace-nowrap"
      >
        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
        Reset Filters
      </Button>
    </div>
  );
};
