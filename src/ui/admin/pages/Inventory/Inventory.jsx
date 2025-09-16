import { Calendar, DollarSign, Eye, FileText, Package, Pencil, Plus, Tag, Trash2, X, Zap, } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createResource,
  deleteResource,
  getResourceById,
  getResources,
  updateResource
} from "../../../../services/inventory/resourceService";
import { getMasterStatus, getMasterClass, getMasterType } from "../../../../services/master/masterservices";
import InventoryFilters from "./InventoryFilters";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [originalInventory, setOriginalInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editResource, setEditResource] = useState(null);
  const [status, setStatus] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resourceIdToDelete, setResourceIdToDelete] = useState(null);

const [originalResource, setOriginalResource] = useState(null);
  const [resourceClasses, setResourceClasses] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [newResource, setNewResource] = useState({
    brand: "",
    model: "",
    specification: "",
    purchaseDate: "",
    warrantyExpiry: "",
    resourceTypeName: "",
    resourceClassName: "",
    resourceStatusName: "In Stock",
    unitPrice: "",
    serialNumber: "",
    remarks: "",
    batchId: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("username") || "User";
    console.log("Logged In Username:", name);

    if (name === "admin") {
      setIsAdmin(true);
    }
  }, []);
  useEffect(() => {
    fetchInventory();
  }, []);
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
  useEffect(() => {
    const fetchType = async () => {
      try {
        const response = await getMasterType();
        console.log("Fetched Resource Types:", response);
        if (response.success) {
          const typeNames = response.data.map(
            (item) => item.resourceTypeName
          );
          setResourceTypes(typeNames);
        }
      } catch (exception) {
        console.error("Error fetching status:", exception);
      }
    };
    fetchType();
  }, []);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await getMasterClass();
        console.log("Fetched Resource Classes:", response);
        if (response.success) {
          const classNames = response.data.map(
            (item) => item.resourceClassName
          );
          setResourceClasses(classNames);
        }
      } catch (exception) {
        console.error("Error fetching class:", exception);
      }
    };
    fetchClass();
  }, []);



  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await getResources();
      console.log("Fetched Inventory:", response);
      if (response.success) {
        const data = response.data || [];
        setInventory(data);
        setOriginalInventory(data);
      } else {
        toast.error(response.message || "Failed to fetch resources");
      }
    } catch (error) {
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };


  const handleFilteredData = (filteredData) => {
    setInventory(filteredData);
  };


  const handleResetData = () => {
    setInventory(originalInventory);
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



  const handleEditResource = async (resourceId) => {
  console.log("Editing Resource ID:", resourceId);
  if (!resourceId) {
    toast.error("Resource ID is missing");
    return;
  }

  try {
    const res = await getResourceById(resourceId);
    if (res.success) {
      setEditResource(res.data);
      setOriginalResource(res.data);
      setIsEditModalOpen(true);
    } else {
      toast.error(res.message || "Failed to fetch resource details");
    }
  } catch (error) {
    toast.error("Error fetching resource");
    console.error(error);
  }
};



const buildUpdatePayload = (original, updated) => {
  const changes = {};
  Object.keys(updated).forEach((key) => {
    if (updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
  });
  return changes;
};


  const handleDeleteResource = async (resourceId) => {
    try {
      const response = await deleteResource(resourceId);
      if (response.success) {
        toast.success("Resource deleted successfully");
        await fetchInventory();
      } else {
        toast.error(response.message || "Failed to delete resource");
      }
    } catch (error) {
      toast.error("Failed to delete resource");
    }
  };
  const validateResourceForm = () => {
    const errors = {};

    if (!newResource.brand.trim()) errors.brand = "Brand is required";
    if (!newResource.model.trim()) errors.model = "Model is required";
    if (!newResource.specification.trim()) errors.specification = "Specification is required";
    if (!newResource.purchaseDate) errors.purchaseDate = "Purchase date is required";
    if (!newResource.resourceTypeName) errors.resourceTypeName = "Resource type is required";
    if (!newResource.resourceClassName) errors.resourceClassName = "Resource class is required";

    return errors;
  };



  const handleAddResource = async (e) => {
    e.preventDefault();

    const errors = validateResourceForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill all required fields");
      return;
    }
    setFormErrors({});
    setAddLoading(true);


    const resourcePayload = {
      brand: newResource.brand.trim(),
      model: newResource.model.trim(),
      specification: newResource.specification.trim(),
      purchaseDate: newResource.purchaseDate,
      warrantyExpiry: newResource.warrantyExpiry || null,
      resourceTypeName: newResource.resourceTypeName,
      resourceClassName: newResource.resourceClassName,
      resourceStatusName: newResource.resourceStatusName,
      serialNumber: newResource.serialNumber.trim(),
      unitPrice: parseFloat(newResource.unitPrice),
      remarks: newResource.remarks.trim() ? newResource.remarks.trim() : null,
      batchId: newResource.batchId ? parseInt(newResource.batchId, 10) : null,
    };

    const wrapperPayload = {
      resources: [resourcePayload],
    };

    try {
      const response = await createResource(wrapperPayload);

      if (response.success) {
        toast.success("Resource added successfully!");
        setShowAddModal(false);


        setNewResource({
          brand: "",
          model: "",
          specification: "",
          purchaseDate: "",
          warrantyExpiry: "",
          resourceTypeName: "",
          resourceClassName: "",
          resourceStatusName: "In Stock",
          unitPrice: "",
          serialNumber: "",
          remarks: "",
          batchId: "",
        });

        await fetchInventory();
      } else {
        toast.error(response.message || "Failed to add resource");
      }
    } catch (error) {
      console.error("Add resource error:", error);
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
                    originalInventory.filter(
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
                    originalInventory.filter(
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
                    originalInventory.filter(
                      (item) => item.resourceStatus === "Out of Stock"
                    ).length
                  }{" "}
                  Out of Stock
                </span>
              </div>
            </div>
          </div>

          {
            isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Item</span>
              </button>
            )}
        </div>
      </div>


      <InventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onFilteredData={handleFilteredData}
        onResetData={handleResetData}
      />


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
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Serial No
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
                      {item.specification || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.resourceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.resourceClass || "N/A"}
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
                      {item.batchId || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.unitPrice || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.serialNumber || "N/A"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.purchaseDate || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {item.warrantyExpiry || "N/A"}
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
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEditResource(item.resourceId)}
                              className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-yellow-400/10 transition-all"
                              title="Edit Resource"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setResourceIdToDelete(item.resourceId);
                                setShowConfirm(true);
                              }}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-all"
                              title="Delete Resource"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </>
                        )}
                      </div>


                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete this resource? This action cannot be undone.
              </p>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteResource(resourceIdToDelete);
                    setShowConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>



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
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Basic Information
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Brand *</label>
                  <input
                    type="text"
                    value={newResource.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.brand ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                    placeholder="Enter brand name "
                    minLength={2}
                    maxLength={20}
                  />
                  {formErrors.brand && (
                    <p className="text-red-500 text-sm">{formErrors.brand}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Model *</label>
                  <input
                    type="text"
                    value={newResource.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.model ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                    placeholder="Enter model "
                    minLength={2}
                    maxLength={20}
                  />
                  {formErrors.model && (
                    <p className="text-red-500 text-sm">{formErrors.model}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Specification *
                  </label>
                  <input
                    type="text"
                    value={newResource.specification}
                    onChange={(e) => handleInputChange("specification", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.specification ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                    placeholder="Enter specifications (5-50 chars)"
                    minLength={5}
                    maxLength={50}
                  />
                  {formErrors.specification && (
                    <p className="text-red-500 text-sm">{formErrors.specification}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Resource Type *
                  </label>
                  <select
                    value={newResource.resourceTypeName}
                    onChange={(e) => handleInputChange("resourceTypeName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.resourceTypeName ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                  >
                    <option value={""}>Select type</option>
                    {resourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {formErrors.resourceTypeName && (
                    <p className="text-red-500 text-sm">{formErrors.resourceTypeName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Resource Class *
                  </label>
                  <select
                    value={newResource.resourceClassName}
                    onChange={(e) => handleInputChange("resourceClassName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.resourceClassName ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                  >
                    <option value={""}>Select Class</option>
                    {resourceClasses.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {formErrors.resourceClassName && (
                    <p className="text-red-500 text-sm">{formErrors.resourceClassName}</p>
                  )}
                </div>

                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Identification
                    </h4>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Unit Price *
                  </label>
                  <input
                    type="number"
                    value={newResource.unitPrice}
                    onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.unitPrice ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                    placeholder="Enter unit price"
                    min="1"
                    step="0.01"
                  />
                  {formErrors.unitPrice && (
                    <p className="text-red-500 text-sm">{formErrors.unitPrice}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    value={newResource.serialNumber}
                    onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.serialNumber ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                    placeholder="Enter serial number"
                    minLength={2}
                    maxLength={50}
                  />
                  {formErrors.serialNumber && (
                    <p className="text-red-500 text-sm">{formErrors.serialNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Batch ID</label>
                  <input
                    type="number"
                    value={newResource.batchId}
                    onChange={(e) => handleInputChange("batchId", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter batch ID (optional)"
                    min="1"
                  />
                </div>

                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Financial & Status
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Status *</label>
                  <select
                    value={newResource.resourceStatusName}
                    onChange={(e) => handleInputChange("resourceStatusName", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  >
                    <option value={""}>Select status</option>
                    {status.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-slate-100">Dates</h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    value={newResource.purchaseDate}
                    onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#21222d] border ${formErrors.purchaseDate ? "border-red-500" : "border-[#21222d]"
                      } text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                  />
                  {formErrors.purchaseDate && (
                    <p className="text-red-500 text-sm">{formErrors.purchaseDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Warranty Expiry
                  </label>
                  <input
                    type="date"
                    value={newResource.warrantyExpiry}
                    onChange={(e) => handleInputChange("warrantyExpiry", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#21222d] border border-[#21222d] text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Additional Information
                    </h4>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-300">Remarks</label>
                  <textarea
                    value={newResource.remarks}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
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
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Specification
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.specification || "N/A"}
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Class
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.resourceClass || "N/A"}
                  </p>
                </div>




                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-slate-100">
                      Identification
                    </h4>
                  </div>
                </div>



                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Unit Price
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.unitPrice || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Serial Number
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.serialNumber || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Batch ID
                  </label>
                  <p className="text-slate-100 font-medium bg-[#21222d] px-4 py-3 rounded-xl">
                    {selectedResource.batchId || "N/A"}
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
                {isAdmin && (
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                    onClick={() => handleEditResource(selectedResource.resourceId)}
                  >
                    <Pencil className="w-5 h-5" />
                    <span>Edit Resource</span>
                  </button>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editResource && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171821] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#21222d] shadow-2xl">
            <div className="sticky top-0 bg-[#171821] border-b border-[#21222d] p-6 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-100">Edit Resource</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-300 p-2 rounded-lg hover:bg-[#21222d] transition-all"
                aria-label="Close Edit Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Brand", key: "brand" },
                  { label: "Model", key: "model" },
                  { label: "Specification", key: "specification" },
                  { label: "Batch Id", key: "batchId", type: "batchId" },       
                  { label: "Unit Price", key: "unitPrice", type: "number" },
                  { label: "Serial Number", key: "serialNumber" },
                  { label: "Purchase Date", key: "purchaseDate", type: "date" },
                  { label: "Warranty Expiry", key: "warrantyExpiry", type: "date" },
                ].map(({ label, key, type }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">{label}</label>
                    <input
                      type={type || "text"}
                      value={editResource[key] || ""}
                      placeholder="N/A"
                      onChange={(e) =>
                        setEditResource((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#21222d] bg-[#21222d] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Type</label>
                  <select
                    value={editResource.resourceType || ""}
                    onChange={(e) =>
                      setEditResource((prev) => ({
                        ...prev,
                        resourceType: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#21222d] bg-[#21222d] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select type</option>
                    {resourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Class</label>
                  <select
                    value={editResource.resourceClass || ""}
                    onChange={(e) =>
                      setEditResource((prev) => ({
                        ...prev,
                        resourceClass: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#21222d] bg-[#21222d] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select class</option>
                    {resourceClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Status</label>
                  <select
                    value={editResource.resourceStatus || ""}
                    onChange={(e) =>
                      setEditResource((prev) => ({
                        ...prev,
                        resourceStatus: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#21222d] bg-[#21222d] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500" >
                    <option value="">Select status</option>
                    {status.map((statusName) => (
                      <option key={statusName} value={statusName}>
                        {statusName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-400">Remarks</label>
                  <textarea
                    value={editResource.remarks || ""}
                    placeholder="N/A"
                    onChange={(e) =>
                      setEditResource((prev) => ({
                        ...prev,
                        remarks: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#21222d] bg-[#21222d] text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-[#21222d]">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>          
<button
  onClick={async () => {
    try {
      const payload = buildUpdatePayload(originalResource, {
        ...editResource,
        purchaseDate: editResource.purchaseDate
          ? editResource.purchaseDate.split("T")[0]
          : null,
        warrantyExpiry: editResource.warrantyExpiry
          ? editResource.warrantyExpiry.split("T")[0]
          : null,
        resourceStatusName: editResource.resourceStatus,
      });

      if (Object.keys(payload).length === 0) {
        toast.info("No changes made");
        return;
      }

      const update = await updateResource(editResource.resourceId, payload);

      if (update.success) {
        toast.success("Resource updated successfully");
        setIsEditModalOpen(false);
      } else {
        toast.error(update.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating resource");
    }
  }}
  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all transform hover:scale-105"
>
  Save Changes
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


