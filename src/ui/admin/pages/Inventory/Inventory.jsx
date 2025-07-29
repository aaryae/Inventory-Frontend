import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteResource,
  getResourceById,
  getResources,
} from "../../../../services/resourceService";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await getResources();
      if (response.success) {
        setInventory(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch resources");
      }
    } catch (error) {
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResource = async (resourceId) => {
    try {
      const response = await getResourceById(resourceId);
      if (response.success) {
        setSelectedResource(response.data);
        setShowResourceModal(true);
      } else {
        toast.error(response.message || "Failed to fetch resource details");
      }
    } catch (error) {
      toast.error("Failed to fetch resource details");
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;
    try {
      const response = await deleteResource(resourceId);
      if (response.success) {
        toast.success("Resource deleted successfully");
        fetchInventory();
      } else {
        toast.error(response.message || "Failed to delete resource");
      }
    } catch (error) {
      toast.error("Failed to delete resource");
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.resourceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specification?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.resourceType?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === "all" ||
      item.resourceStatus?.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalItems = inventory.length;
  const inStockItems = inventory.filter(
    (item) => item.resourceStatus?.toLowerCase() === "in stock"
  ).length;
  const lowStockItems = inventory.filter(
    (item) => item.resourceStatus?.toLowerCase() === "low stock"
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => item.resourceStatus?.toLowerCase() === "out of stock"
  ).length;

  // Pagination calculations
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredInventory.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-900 text-green-200";
      case "Low Stock":
        return "bg-yellow-900 text-yellow-200";
      case "Out of Stock":
        return "bg-red-900 text-red-200";
      default:
        return "bg-[#21222d] text-slate-300";
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div
      className="p-4 rounded-xl border border-[#21222d] shadow-lg"
      style={{ background: "#171821" }}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-xl font-semibold text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64 text-slate-400">
        Loading resources...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div
        className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg"
        style={{ background: "#171821" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              Inventory Management
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your product inventory and stock levels
            </p>
          </div>
          <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Package}
          title="Total Items"
          value={totalItems}
          color="bg-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          title="In Stock"
          value={inStockItems}
          color="bg-green-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="Low Stock"
          value={lowStockItems}
          color="bg-yellow-600"
        />
        <StatCard
          icon={XCircle}
          title="Out of Stock"
          value={outOfStockItems}
          color="bg-red-600"
        />
      </div>

      {/* Filters and Search */}
      <div
        className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg"
        style={{ background: "#171821" }}
      >
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
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
                style={{ background: "#21222d" }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
              style={{ background: "#21222d" }}
            >
              <option value="all">All Types</option>
              <option value="keyboard">Keyboard</option>
              <option value="laptop">Laptop</option>
              <option value="mouse">Mouse</option>
              <option value="monitor">Monitor</option>
              <option value="audio">Audio</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
              style={{ background: "#21222d" }}
            >
              <option value="all">All Status</option>
              <option value="in stock">In Stock</option>
              <option value="low stock">Low Stock</option>
              <option value="out of stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div
        className="rounded-2xl border border-[#21222d] shadow-lg overflow-hidden"
        style={{ background: "#171821" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#21222d" }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Specification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Warranty Expiry
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21222d]">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No resources found
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr
                    key={item.resourceId}
                    className="hover:bg-[#21222d] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.resourceCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.specification}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.resourceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.resourceClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          item.resourceStatus
                        )}`}
                      >
                        {item.resourceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.purchaseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-100">
                      {item.warrantyExpiry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewResource(item.resourceId)}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300 p-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(item.resourceId)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredInventory.length > 0 && (
          <div
            className="px-6 py-4 border-t border-[#21222d]"
            style={{ background: "#171821" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Items per page and info */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="px-3 py-1 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
                    style={{ background: "#21222d" }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-slate-400">entries</span>
                </div>
                <div className="text-sm text-slate-400">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredInventory.length)} of{" "}
                  {filteredInventory.length} entries
                </div>
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#21222d] text-slate-400 hover:text-slate-100 hover:bg-[#21222d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ background: "#171821" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                            : "border border-[#21222d] text-slate-400 hover:text-slate-100 hover:bg-[#21222d]"
                        }`}
                        style={
                          currentPage !== pageNumber
                            ? { background: "#171821" }
                            : {}
                        }
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-[#21222d] text-slate-400 hover:text-slate-100 hover:bg-[#21222d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ background: "#171821" }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Resource Modal */}
      {showResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171821] rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-100">
                Resource Details
              </h3>
              <button
                onClick={() => setShowResourceModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Resource Code</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.resourceCode}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Brand</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.brand}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Model</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.model}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Specification</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.specification}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Type</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.resourceType}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Class</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.resourceClass}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Status</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.resourceStatus}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Purchase Date</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.purchaseDate}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">
                  Warranty Expiry
                </label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.warrantyExpiry}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Batch Code</label>
                <p className="text-slate-100 font-medium">
                  {selectedResource.batchCode}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowResourceModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
