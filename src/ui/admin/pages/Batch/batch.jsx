import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { batch as createBatch, getBatches } from "../../../../../src/services/batch/batchservices";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { getMasterType } from "../../../../../src/services/master/masterservices";
const Batch = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [batchId, setBatchId] = useState(null);
const [resourceTypes, setResourceTypes] = useState([]);
  const [resourceTypeName, setResourceTypeName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const [batches, setBatches] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("username") || "User";
    if (name.toLowerCase() === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
  const fetchResourceTypes = async () => {
    try {
      const response = await getMasterType();
      console.log("Resource types fetched:", response);
        if (response.success) {
          const typeNames = response.data.map(
            (item) => item.resourceTypeName
          );
          setResourceTypes(typeNames);
          console.log("Resource types set:", typeNames);
    }} catch (exception) {
      console.error("Error fetching resource types:", exception);
    }
  };

  fetchResourceTypes(); 
}, []);
  const fetchBatches = async () => {
    try {
      const response = await getBatches();
      setBatches(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
      setBatches([]);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleCreateBatch = async () => {
    if (!resourceTypeName || !quantity || !description)
      return toast.error("All fields are required!");

    try {
      const formData = { resourceTypeName, quantity: Number(quantity), description };
      const response = await createBatch(formData);

      setBatchId(response.data.batchId);
      toast.success(`Batch created! ID: ${response.data.batchId}`);
      setShowCreateModal(false);

      setResourceTypeName("");
      setQuantity("");
      setDescription("");

      fetchBatches();
    } catch (err) {
      console.error("Batch creation failed:", err.response?.data || err.message);
      toast.error("Failed to create batch. Check console.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please select a file");
    if (!batchId) return toast.error("Please select a batch first!");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must be logged in!");

    try {
      const formData = new FormData();
      formData.append("excel", selectedFile);
      formData.append("batchId", batchId);

      const response = await axios.post(
        "http://localhost:8080/api/resources/upload-excel",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Batch Excel uploaded successfully!");
      setShowUploadModal(false);
      setSelectedFile(null);
      setBatchId(null);

      fetchBatches();
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to upload batch");
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="mb-6 p-6 mt-10 rounded-2xl border border-[#21222d] shadow-lg bg-[#171821]">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Upload className="w-8 h-8 text-cyan-400" /> Batch Management
        </h1>
        <p className="text-slate-400 mt-2">
          Create batches first, then upload Excel files to manage resources.
        </p>
      </div>

      {isAdmin && (
        <div className="flex justify-end mb-4 gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:scale-105 transition"
          >
            Create Batch
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 rounded-xl hover:scale-105 transition text-white"
          >
            <Upload className="w-4 h-4" /> Upload Batch Excel
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-[#171821] rounded-xl border border-[#21222d] p-4">
        <table className="min-w-full text-left text-white">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="px-4 py-2">Batch ID</th>
              <th className="px-4 py-2">Batch Code</th>
              <th className="px-4 py-2">Resource Type</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {batches.length > 0 ? (
              batches.map((batch) => (
                <tr key={batch.batchId} className="border-b border-gray-600">
                  <td className="px-4 py-2">{batch.batchId}</td>
                  <td className="px-4 py-2">{batch.batchCode}</td>
                  <td className="px-4 py-2">{batch.resourceType}</td>
                  <td className="px-4 py-2">{batch.quantity}</td>
                  <td className="px-4 py-2">{batch.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-400">
                  No batches created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAdmin && showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171821] p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Create Batch</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {/* <input
                type="text"
                placeholder="Resource Type Name"
                value={resourceTypeName}
                onChange={(e) => setResourceTypeName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#2a2b36] bg-[#21222d] text-white"
              />
               */}
               <select
  value={resourceTypeName}
  onChange={(e) => setResourceTypeName(e.target.value)}
  className="w-full px-4 py-3 rounded-lg border border-[#2a2b36] bg-[#21222d] text-white"
  required
>
  <option value="" disabled>
    Select Resource Type
  </option>
  {resourceTypes.map((type, index) => (
    <option key={index} value={type}>
      {type}
    </option>
  ))}
</select>

              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#2a2b36] bg-[#21222d] text-white"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#2a2b36] bg-[#21222d] text-white"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-slate-600 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBatch}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171821] p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Upload Batch Excel</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <select
                value={batchId || ""}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full px-4 py-3 bg-[#21222d] text-white rounded-lg border border-[#2a2b36]"
                required
              >
                <option value="" disabled>
                  Select Batch
                </option>
                {batches.map((b) => (
                  <option key={b.batchId} value={b.batchId}>
                    {b.batchCode} - {b.resourceType}
                  </option>
                ))}
              </select>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-[#21222d] text-white rounded-lg border border-[#2a2b36]"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg text-white"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batch;
