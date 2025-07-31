import { Search, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { searchResources } from "../../../../services/search/searchService";

const InventoryFilters = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  onFilteredData,
  onResetData,
}) => {
  const [advancedFilters, setAdvancedFilters] = useState({
    brand: "",
    model: "",
    purchaseDate: "",
    specification: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleAdvancedSearch = async () => {
    setIsSearching(true);
    try {
      // Only include non-empty filters
      const activeFilters = Object.entries(advancedFilters).reduce(
        (acc, [key, value]) => {
          if (value && value.trim()) {
            acc[key] = value.trim();
          }
          return acc;
        },
        {}
      );

      if (Object.keys(activeFilters).length === 0) {
        // If no advanced filters, fall back to regular fetch
        onResetData();
        toast.info("No advanced filters applied");
      } else {
        const response = await searchResources(activeFilters);
        if (response.success) {
          onFilteredData(response.data || []);
          toast.success(
            `Found ${response.data?.length || 0} matching resources`
          );
        } else {
          toast.error(response.message || "Search failed");
        }
      }
    } catch (error) {
      toast.error("Search failed");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setAdvancedFilters({
      brand: "",
      model: "",
      purchaseDate: "",
      specification: "",
    });
    setShowAdvancedFilters(false);
    onResetData(); // Reset to original data
  };

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg"
      style={{ background: "#171821" }}
    >
      <div className="space-y-4">
        {/* Basic Search and Status Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code, brand, model, or specification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
                style={{ background: "#21222d" }}
              />
            </div>
          </div>

          {/* Status Filter and Controls */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
              style={{ background: "#21222d" }}
            >
              <option value="all">All Status</option>
              <option value="in stock">In Stock</option>
              <option value="low stock">Low Stock</option>
              <option value="out of stock">Out of Stock</option>
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center space-x-2 ${
                showAdvancedFilters
                  ? "bg-cyan-600 border-cyan-600 text-white"
                  : "bg-[#21222d] border-[#21222d] text-slate-300 hover:border-cyan-500"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Advanced</span>
            </button>

            <button
              onClick={handleClearFilters}
              className="px-4 py-3 rounded-xl bg-slate-600 hover:bg-slate-700 text-white transition-all flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="border-t border-[#21222d] pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-semibold text-slate-100">
                Advanced Search
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="Filter by brand..."
                  value={advancedFilters.brand}
                  onChange={(e) =>
                    handleAdvancedFilterChange("brand", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
                  style={{ background: "#21222d" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="Filter by model..."
                  value={advancedFilters.model}
                  onChange={(e) =>
                    handleAdvancedFilterChange("model", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
                  style={{ background: "#21222d" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={advancedFilters.purchaseDate}
                  onChange={(e) =>
                    handleAdvancedFilterChange("purchaseDate", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
                  style={{ background: "#21222d" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Specification
                </label>
                <input
                  type="text"
                  placeholder="Filter by specs..."
                  value={advancedFilters.specification}
                  onChange={(e) =>
                    handleAdvancedFilterChange("specification", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
                  style={{ background: "#21222d" }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleAdvancedSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Resources</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryFilters;
