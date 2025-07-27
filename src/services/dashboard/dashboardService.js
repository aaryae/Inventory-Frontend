import { axiosInstance } from "../../config/axios"

export const getCountBySpecification = async () => {
  const response = await axiosInstance.get('/api/admin/dashboard/count-by-specification')
  return response.data
}

export const getCountByResourceType = async () => {
  const response = await axiosInstance.get('/api/admin/dashboard/count-by-resourceType')
  return response.data
}

export const getCountByModel = async () => {
  const response = await axiosInstance.get('/api/admin/dashboard/count-by-model')
  return response.data
}

export const getCountByBrand = async () => {
  const response = await axiosInstance.get('/api/admin/dashboard/count-by-brand')
  return response.data
} 