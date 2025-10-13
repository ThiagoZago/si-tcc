import axios from "axios"
import { tokenManager } from "./tokenManager"
import API_URL from "../config/api"

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()

    if (token) {
      if (tokenManager.isTokenExpired()) {
        tokenManager.removeToken()
        window.location.href = "/acesso"
        return Promise.reject(new Error("Token expirado. Faça login novamente."))
      }

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken()
      window.location.href = "/acesso"
    }
    return Promise.reject(error)
  },
)

export default axiosInstance