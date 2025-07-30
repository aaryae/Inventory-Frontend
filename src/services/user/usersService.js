import { axiosInstance } from  "../../config/axios"

export const getUsers = async (params) => {
  const response = await axiosInstance.get('/api/admin/users', { params })
  return response.data
}

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/admin/users/${id}`)
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await axiosInstance.put(`/api/admin/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/users/${id}`)
  return response.data
} 