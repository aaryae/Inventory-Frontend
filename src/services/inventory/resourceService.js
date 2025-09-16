import { axiosInstance } from "../../config/axios";
const token = localStorage.getItem("token");

export const getResources = async (params) => {
  const response = await axiosInstance.get("/api/resources", { params });
  return response.data;
};


export const getResourceById = async (resourceId) => {
  const response = await axiosInstance.get(`/api/resources/${resourceId}`);
  return response.data;
};

export const createResource = async (resourcesPayload) => {
  console.log("Creating resource with payload:", resourcesPayload);
  if (!token) {
    throw new Error("No token found in localStorage");
   }
  const response = await axiosInstance.post("/api/resources", resourcesPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};



export const updateResource = async (resourceId, updatePayload) => {
  console.log("Updating resource with ID:", resourceId);
  const response = await axiosInstance.patch(`/api/resources/${resourceId}`, updatePayload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteResource = async (resourceId) => {
  const response = await axiosInstance.delete(`/api/resources/${resourceId}`);
  return response.data;
};
