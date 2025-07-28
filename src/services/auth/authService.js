import { axiosInstance } from '../../config/axios';

// Register (Sign-Up)
export const signUp = async (formData) => {
  const response = await axiosInstance.post('/api/auth/register', formData);
  return response.data;
};

// Login (Sign-In)
export const signIn = async (credentials) => {
  const response = await axiosInstance.post('/api/auth/login', credentials);
  return response.data;
};

// Forgot password: request reset code
export const requestReset = async (email) => {
  const response = await axiosInstance.post('/api/auth/request-reset', { email });
  return response.data;
};

// Forgot password: verify reset code and reset password
export const verifyReset = async ({ email, code, newPassword }) => {
  const response = await axiosInstance.post('/api/auth/verify-reset', { email, code, newPassword });
  return response.data;
};

// Refresh token
export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/auth/refresh', { refreshToken });
  return response.data;
};
