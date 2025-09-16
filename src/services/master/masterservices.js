import { axiosInstance } from "../../config/axios";

// Get all resources
export const createMasterClass = async (payload) => {
  const response = await axiosInstance.post("/api/master/resource-class", payload);
  return response.data;
};


export const createMasterType = async (payload) => {
  const response = await axiosInstance.post(`/api/master/resource-type/${payload}`);
  return response.data;
};


export const createMasterStatus = async (Payload) => {
  const response = await axiosInstance.post("/api/master/resource-status", Payload);
  return response.data;
};

export const getMasterClass = async () => {
  const response = await axiosInstance.get("/api/master/resource-class",);
  return response.data;
};


export const getMasterType = async () => {
  const response = await axiosInstance.get(`/api/master/resource-type`);
  return response.data;
};

export const getMasterStatus = async () => {
  const response = await axiosInstance.get("/api/master/resource-status", );
  return response.data;
};


export const getMasterClassbyId = async (params) => {
  const response = await axiosInstance.get(`/api/master/resource-class/${params}`,);
  return response.data;
};


export const getMasterTypebyId = async (params) => {
  const response = await axiosInstance.get(`/api/master/resource-type/${params}`);
  return response.data;
};

export const getMasterStatusbyId = async (params) => {
  const response = await axiosInstance.get(`/api/master/resource-status/${params}`, );
  return response.data;
};

