import { Search, X, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { searchResources } from "../../../../services/search/searchService";
import { getMasterStatus } from "../../../../services/master/masterservices";
import { updateResource } from "../../../../services/inventory/resourceService";
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
  const [status, setStatus] = useState([]);
  const [resources, setResources] = useState([]);

 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editResource, setEditResource] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getMasterStatus();
        if (response.success) {
          const statusNames = response.data.map(
            (item) => item.resourceStatusName
          );
          setStatus(statusNames);
        }
      } catch (exception) {
        console.error("Error fetching status:", exception);
      }
    };
    fetchStatus();
  }, []);

  const handleAdvancedSearch = async () => {
    setIsSearching(true);
    try {
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
        onResetData();
        toast.info("No advanced filters applied");
      } else {
        const response = await searchResources(activeFilters);
        if (response.success) {
          setResources(response.data || []);
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
    onResetData();
    setResources([]);
  };

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters((prev) => ({ ...prev, [field]: value }));
  };

  
  const handleEditResource = async(resource) => {
     const update = await updateResource(resource.id, resource);
    if (update.success) {
      toast.success("Resource updated successfully");   
    setEditResource({ ...resource });
    setIsEditModalOpen(true);
  };}

  const handleSaveResource = () => {
    if (!editResource.brand || !editResource.model) {
      toast.error("Brand and Model are required");
      return;
    }
    const updatedResources = resources.map((res) =>
      res.id === editResource.id ? editResource : res
    );
    setResources(updatedResources);
    toast.success("Resource updated successfully");
    setIsEditModalOpen(false);
  };

  return (
    <div
      className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg"
      style={{ background: "#171821" }}
    >
      <div className="space-y-4">
      
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
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

  
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
              style={{ background: "#21222d" }}
            >
              <option value="all">All Status</option>
              {status.map((statusName, index) => (
                <option key={index} value={statusName}>
                  {statusName}
                </option>
              ))}
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

{(searchTerm ||
  selectedStatus !== "all" ||
  Object.values(advancedFilters).some((val) => val && val.trim())) && (
  <button
    onClick={handleClearFilters}
    className="px-4 py-3 rounded-xl bg-slate-600 hover:bg-slate-700 text-white transition-all flex items-center space-x-2"
  >
    <X className="w-4 h-4" />
    <span>Clear</span>
  </button>
)}
          </div>
        </div>

     
        {showAdvancedFilters && (
          <div className="border-t border-[#21222d] pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {["brand", "model", "purchaseDate", "specification"].map(
                (field, i) => (
                  <div className="space-y-2" key={i}>
                    <label className="text-sm font-medium text-slate-300">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "purchaseDate" ? "date" : "text"}
                      placeholder={`Filter by ${field}...`}
                      value={advancedFilters[field]}
                      onChange={(e) =>
                        handleAdvancedFilterChange(field, e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
                      style={{ background: "#21222d" }}
                    />
                  </div>
                )
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleAdvancedSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 flex items-center space-x-2"
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

      
        {resources.length > 0 && (
          <div className="mt-4">
            <h4 className="text-slate-200 mb-2">Search Results</h4>
            {resources.map((res) => (
              <div
                key={res.id}
                className="flex justify-between items-center bg-[#21222d] p-3 rounded-lg mb-2"
              >
                <div className="text-slate-100">
                  <p>
                    <strong>{res.brand}</strong> - {res.model}
                  </p>
                  <p className="text-sm text-slate-400">
                    {res.specification} | {res.purchaseDate}
                  </p>
                </div>
                <button
                  onClick={() => handleEditResource(res)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    
   
    </div>
  );
};

export default InventoryFilters;
