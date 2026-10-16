import API_URL from "../config/api"
import { tokenManager } from "../utils/tokenManager"

export async function register(username, password) {
  try {
    const response = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    return await response.json()
  } catch (error) {
    return { msg: "Erro ao conectar ao servidor" }
  }
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/acesso`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json()
  if (response.ok && data.token) {
    tokenManager.setToken(data.token)
  }
  return data
}

export function logout() {
  tokenManager.removeToken()
}

export function isAuthenticated() {
  return tokenManager.isAuthenticated()
}

export function getAuthHeader() {
  const token = tokenManager.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}