import { jwtDecode } from "jwt-decode"

const TOKEN_KEY = "token"

export const tokenManager = {
  setToken(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch (error) {
      console.error("Error saving token:", error)
    }
  },

  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch (error) {
      console.error("Error retrieving token:", error)
      return null
    }
  },

  removeToken() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch (error) {
      console.error("Error removing token:", error)
    }
  },

  isTokenExpired() {
    const token = this.getToken()
    if (!token) return true

    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decoded.exp < currentTime + 300) {
        console.warn("Token is about to expire or has expired")
        return true
      }

      return decoded.exp < currentTime
    } catch (error) {
      console.error("Error decoding token:", error)
      return true
    }
  },

  isAuthenticated() {
    return this.getToken() !== null && !this.isTokenExpired()
  },
}
