import { axiosInstance } from '../../config/axios';

export const signUp = async (formData) => {
  const response = await axiosInstance.post('/api/auth/register', formData);
  console.log("SignUp Response:", response.data);
  return response.data;
};

export const signIn = async (credentials) => {
  const response = await axiosInstance.post('/api/auth/login', credentials);
  console.log("SignIn Response:", response.data);
  return response.data;
};

export const requestReset = async (email) => {
  const response = await axiosInstance.post('/api/auth/request-reset', { email });
  return response.data;
};

export const verifyReset = async ({ email, code, newPassword }) => {
  const response = await axiosInstance.post('/api/auth/verify-reset', { email, code, newPassword });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/auth/refresh', { refreshToken });
  return response.data;
};
