
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
  selectedDateRange?: string;
  setSelectedDateRange?: (date: string) => void;
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
  selectedDateRange,
  setSelectedDateRange,
  resetFilters,
  samplePOs = [],
  documentTypes = [],
  placeholder = "Search documents..."
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-end w-full">
      {/* Search Input */}
      <div className="flex-1 w-full flex flex-col">
        <label className="enterprise-label">Global Transaction Search</label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4 transition-colors group-focus-within:text-[#0f172a]" />
          <input
            placeholder="Search by PO, WB, Invoice..."
            className="enterprise-input !pl-11 shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Select Box 1: PO Selection */}
      {setSelectedPO && (
        <div className="w-full lg:w-48 flex flex-col shrink-0">
          <label className="enterprise-label">Customer Scope</label>
          <Select value={selectedPO} onValueChange={setSelectedPO}>
            <SelectTrigger className="enterprise-input py-0 px-4 flex justify-between">
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-[#e2e8f0] p-1">
              <SelectItem value="all" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">All Time</SelectItem>
              {samplePOs?.map((po) => (
                <SelectItem key={po.id} value={po.id} className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">{po.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Select Box 3: Date Range */}
      {setSelectedDateRange && (
        <div className="w-full lg:w-48 flex flex-col shrink-0">
          <label className="enterprise-label">Time Period</label>
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="enterprise-input py-0 px-4 flex justify-between">
              <SelectValue placeholder="Display Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-[#e2e8f0] p-1">
              <SelectItem value="all" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">All Time</SelectItem>
              <SelectItem value="7d" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">Last 7 Days</SelectItem>
              <SelectItem value="30d" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">Last 30 Days</SelectItem>
              <SelectItem value="90d" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="enterprise-button-secondary px-8 flex items-center gap-2 group shrink-0"
      >
        <RefreshCcw className="w-4 h-4 text-[#94a3b8] group-hover:rotate-180 transition-transform duration-500" />
        <span>Reset</span>
      </button>
    </div>

  );
};

