"use client"

import type { TokenRequest, TokenResponse } from "./agora-config"

class TokenManager {
  private tokens: Map<string, TokenResponse> = new Map()
  private refreshTimers: Map<string, NodeJS.Timeout> = new Map()

  // Generate a unique key for token storage
  private getTokenKey(channel: string, uid: number, role: string): string {
    return `${channel}-${uid}-${role}`
  }

  // Request a new token from the server
  async requestToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      console.log("Requesting token:", request)

      const response = await fetch("/api/agora/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const tokenData: TokenResponse = await response.json()

      // Store the token
      const key = this.getTokenKey(request.channel, request.uid, request.role)
      this.tokens.set(key, tokenData)

      // Set up automatic refresh (refresh 5 minutes before expiration)
      this.scheduleTokenRefresh(key, request, tokenData.expiresAt)

      console.log("Token received and stored:", tokenData)
      return tokenData
    } catch (error) {
      console.error("Failed to request token:", error)
      throw error
    }
  }

  // Get stored token
  getToken(channel: string, uid: number, role: string): TokenResponse | null {
    const key = this.getTokenKey(channel, uid, role)
    const token = this.tokens.get(key)

    if (token) {
      // Check if token is still valid (not expired)
      const currentTime = Math.floor(Date.now() / 1000)
      if (currentTime < token.expiresAt - 300) {
        // 5 minutes buffer
        return token
      } else {
        // Token is expired or about to expire
        this.tokens.delete(key)
        return null
      }
    }

    return null
  }

  // Schedule automatic token refresh
  private scheduleTokenRefresh(key: string, request: TokenRequest, expiresAt: number) {
    // Clear existing timer
    const existingTimer = this.refreshTimers.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Calculate refresh time (5 minutes before expiration)
    const currentTime = Math.floor(Date.now() / 1000)
    const refreshTime = (expiresAt - currentTime - 300) * 1000 // Convert to milliseconds

    if (refreshTime > 0) {
      const timer = setTimeout(async () => {
        try {
          console.log("Auto-refreshing token for:", key)
          await this.requestToken(request)
        } catch (error) {
          console.error("Failed to auto-refresh token:", error)
        }
      }, refreshTime)

      this.refreshTimers.set(key, timer)
    }
  }

  // Manually refresh a token
  async refreshToken(channel: string, uid: number, role: "publisher" | "subscriber"): Promise<TokenResponse> {
    const request: TokenRequest = { channel, uid, role }
    return this.requestToken(request)
  }

  // Clear all tokens and timers
  clearAll() {
    this.tokens.clear()
    this.refreshTimers.forEach((timer) => clearTimeout(timer))
    this.refreshTimers.clear()
  }

  // Check if a token exists and is valid
  hasValidToken(channel: string, uid: number, role: string): boolean {
    return this.getToken(channel, uid, role) !== null
  }
}

// Export singleton instance
export const tokenManager = new TokenManager()
