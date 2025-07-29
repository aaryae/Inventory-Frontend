import { axiosInstance } from "../config/axios";

// Get all resources
export const getResources = async (params) => {
  const response = await axiosInstance.get("/api/resources", { params });
  return response.data;
};

// Get a single resource by ID
export const getResourceById = async (resourceId) => {
  const response = await axiosInstance.get(`/api/resources/${resourceId}`);
  return response.data;
};

// Create new resources (expects { resources: [...] } as body)
export const createResource = async (resourcesPayload) => {
  const response = await axiosInstance.post("/api/resources", resourcesPayload);
  return response.data;
};

// Update a resource by ID (PATCH)
export const updateResource = async (resourceId, updatePayload) => {
  const response = await axiosInstance.patch(`/api/resources/${resourceId}`, updatePayload);
  return response.data;
};

// Delete a resource by ID
export const deleteResource = async (resourceId) => {
  const response = await axiosInstance.delete(`/api/resources/${resourceId}`);
  return response.data;
}; 