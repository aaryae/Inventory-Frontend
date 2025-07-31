import { axiosInstance } from "../../config/axios";

export const searchResources = async (filters) => {
  const params = {};

  if (filters.brand) params.brand = filters.brand;
  if (filters.model) params.model = filters.model;
  if (filters.purchaseDate) params.purchaseDate = filters.purchaseDate;
  if (filters.specification) params.specification = filters.specification;

  const response = await axiosInstance.get("/api/resources/filter", { params });
  return response.data;
};
