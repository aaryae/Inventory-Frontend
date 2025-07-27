// import axios from 'axios'

// export const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8080/api',

// })

// // ✅ Add request interceptor to attach token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Optional: response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message)
//     return Promise.reject(error)
//   }
// )
