
import React from "react";
import { Search, X, RefreshCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType?: string;
  setSelectedType?: (type: string) => void;
  startDate?: string;
  setStartDate?: (date: string) => void;
  endDate?: string;
  setEndDate?: (date: string) => void;
  resetFilters: () => void;
  documentTypes?: { id: string, name: string }[];
  placeholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  resetFilters,
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
            placeholder={placeholder}
            className="enterprise-input !pl-11 shadow-none outline-none"
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

      {/* Select Box: Document Type (if applicable) */}
      {setSelectedType && (
        <div className="w-full lg:w-48 flex flex-col shrink-0">
          <label className="enterprise-label">Document Type</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="enterprise-input h-10 py-0 px-4 flex justify-between bg-white outline-none">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-[#e2e8f0] p-1">
              <SelectItem value="all" className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">All Types</SelectItem>
              {documentTypes?.map((t) => (
                <SelectItem key={t.id} value={t.id} className="rounded-lg py-2.5 px-3 focus:bg-slate-50 text-sm font-semibold">{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Date Filters: Start Date */}
      {setStartDate && (
        <div className="w-full lg:w-44 flex flex-col shrink-0">
          <label className="enterprise-label">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="enterprise-input !pl-10 h-10 w-full bg-white transition-all focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Date Filters: End Date */}
      {setEndDate && (
        <div className="w-full lg:w-44 flex flex-col shrink-0">
          <label className="enterprise-label">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="enterprise-input !pl-10 h-10 w-full bg-white transition-all focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="enterprise-button-secondary px-8 flex items-center gap-2 group shrink-0 h-10 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200"
      >
        <RefreshCcw className="w-4 h-4 text-[#94a3b8] group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-900">Reset Filters</span>
      </button>
    </div>
  );
};
