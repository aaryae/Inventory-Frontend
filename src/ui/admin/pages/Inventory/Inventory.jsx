import {
  Calendar,
  DollarSign,
  Eye,
  FileText,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createResource,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Form state for adding new resource
  const [newResource, setNewResource] = useState({
    resourceCode: "",
    brand: "",
    model: "",
    specification: "",
    resourceType: "",
    resourceClass: "",
    resourceStatus: "In Stock",
    purchaseDate: "",
    warrantyExpiry: "",
    batchCode: "",
    unitPrice: "",
    remarks: "",
  });

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

  const handleAddResource = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      // Validate required fields
      const requiredFields = ["resourceCode", "brand", "model", "resourceType"];
      const missingFields = requiredFields.filter(
        (field) => !newResource[field].trim()
      );

      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(", ")}`);
        setAddLoading(false);
        return;
      }

      const resourcePayload = {
        resources: [newResource],
      };

      const response = await createResource(resourcePayload);
      if (response.success) {
        toast.success("Resource added successfully!");
        setShowAddModal(false);
        setNewResource({
          resourceCode: "",
          brand: "",
          model: "",
          specification: "",
          resourceType: "",
          resourceClass: "",
          resourceStatus: "In Stock",
          purchaseDate: "",
          warrantyExpiry: "",
          batchCode: "",
          unitPrice: "",
          remarks: "",
        });
        fetchInventory();
      } else {
        toast.error(response.message || "Failed to add resource");
      }
    } catch (error) {
      toast.error("Failed to add resource");
    } finally {
      setAddLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewResource((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64 text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading resources...</span>
        </div>
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
            <h1 className="text-3xl font-bold text-slate-100 flex items-center space-x-3">
              <Package className="w-8 h-8 text-cyan-400" />
              <span>Inventory Management</span>
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your product inventory and stock levels
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>
                  {
                    inventory.filter(
                      (item) => item.resourceStatus === "In Stock"
                    ).length
                  }{" "}
                  In Stock
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>
                  {
                    inventory.filter(
                      (item) => item.resourceStatus === "Low Stock"
                    ).length
                  }{" "}
                  Low Stock
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>
                  {
                    inventory.filter(
                      (item) => item.resourceStatus === "Out of Stock"
                    ).length
                  }{" "}
                  Out of Stock
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Item</span>
          </button>
        </div>
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
                className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
                style={{ background: "#21222d" }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
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
              className="px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 border border-[#21222d] transition-all"
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
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Specification
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Warranty Expiry
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21222d]">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Package className="w-12 h-12 text-slate-500" />
                      <div>
                        <p className="text-lg font-medium">
                          No resources found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.resourceId}
                    className="hover:bg-[#21222d] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-cyan-400">
                      {item.resourceCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.specification}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.resourceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.resourceClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.unitPrice
                        ? `${parseFloat(item.unitPrice).toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          item.resourceStatus
                        )}`}
                      >
                        {item.resourceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.purchaseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.warrantyExpiry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleViewResource(item.resourceId)}
                          className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-400/10 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-yellow-400/10 transition-all"
                          title="Edit Resource"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(item.resourceId)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-all"
                          title="Delete Resource"
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
      </div>

      {/* Add New Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171821] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#21222d] shadow-2xl">
            <div className="sticky top-0 bg-[#171821] border-b border-[#21222d] p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">
                      Add New Resource
                    </h3>
                    <p className="text-slate-400">
                      Fill in the details below to add a new inventory item
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-300 p-2 rounded-lg hover:bg-[#21222d] transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddResource} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information Section */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Basic Information
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Resource Code *
                  </label>
                  <input
                    type="text"
                    value={newResource.resourceCode}
                    onChange={(e) =>
                      handleInputChange("resourceCode", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter resource code"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={newResource.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter brand name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={newResource.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter model"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Resource Type *
                  </label>
                  <select
                    value={newResource.resourceType}
                    onChange={(e) =>
                      handleInputChange("resourceType", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="laptop">Laptop</option>
                    <option value="mouse">Mouse</option>
                    <option value="monitor">Monitor</option>
                    <option value="audio">Audio</option>
                    <option value="storage">Storage</option>
                    <option value="networking">Networking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Specification
                  </label>
                  <input
                    type="text"
                    value={newResource.specification}
                    onChange={(e) =>
                      handleInputChange("specification", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter specifications"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Resource Class
                  </label>
                  <input
                    type="text"
                    value={newResource.resourceClass}
                    onChange={(e) =>
                      handleInputChange("resourceClass", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter resource class"
                  />
                </div>

                {/* Financial & Status Section */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Financial & Status
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Unit Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={newResource.unitPrice}
                      onChange={(e) =>
                        handleInputChange("unitPrice", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Status
                  </label>
                  <select
                    value={newResource.resourceStatus}
                    onChange={(e) =>
                      handleInputChange("resourceStatus", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                {/* Dates & Tracking Section */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Dates & Tracking
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={newResource.purchaseDate}
                    onChange={(e) =>
                      handleInputChange("purchaseDate", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Warranty Expiry
                  </label>
                  <input
                    type="date"
                    value={newResource.warrantyExpiry}
                    onChange={(e) =>
                      handleInputChange("warrantyExpiry", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Batch Code
                  </label>
                  <input
                    type="text"
                    value={newResource.batchCode}
                    onChange={(e) =>
                      handleInputChange("batchCode", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter batch code"
                  />
                </div>

                {/* Remarks Section */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Additional Information
                    </h4>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Remarks
                  </label>
                  <textarea
                    value={newResource.remarks}
                    onChange={(e) =>
                      handleInputChange("remarks", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                    placeholder="Enter any additional remarks or notes about this resource..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-[#21222d]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  {addLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding Resource...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Add Resource</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Resource Modal */}
      {showResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171821] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#21222d] shadow-2xl">
            <div className="sticky top-0 bg-[#171821] border-b border-[#21222d] p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">
                      Resource Details
                    </h3>
                    <p className="text-slate-400">
                      Complete information about this resource
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="text-slate-400 hover:text-slate-300 p-2 rounded-lg hover:bg-[#21222d] transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Basic Information
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Resource Code
                  </label>
                  <p className="text-slate-100 font-medium text-lg bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.resourceCode}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Brand
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.brand}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Model
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.model}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Type
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.resourceType}
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Specification
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.specification || "N/A"}
                  </p>
                </div>

                {/* Financial & Status */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Financial & Status
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Unit Price
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.unitPrice
                      ? `${parseFloat(selectedResource.unitPrice).toFixed(2)}`
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Class
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.resourceClass || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Status
                  </label>
                  <div className="bg-[#21222d] px-4 py-3 rounded-xl">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedResource.resourceStatus
                      )}`}
                    >
                      {selectedResource.resourceStatus}
                    </span>
                  </div>
                </div>

                {/* Dates & Tracking */}
                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Dates & Tracking
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Purchase Date
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.purchaseDate || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Warranty Expiry
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.warrantyExpiry || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Batch Code
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.batchCode || "N/A"}
                  </p>
                </div>

                {/* Remarks */}
                {selectedResource.remarks && (
                  <>
                    <div className="md:col-span-2 mt-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <FileText className="w-5 h-5 text-purple-400" />
                        <h4 className="text-lg font-semibold text-slate-100">
                          Remarks
                        </h4>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <p className="text-slate-100 bg-[#21222d] px-4 py-3 rounded-xl leading-relaxed">
                        {selectedResource.remarks}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-[#21222d]">
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Close</span>
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2">
                  <Pencil className="w-5 h-5" />
                  <span>Edit Resource</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
