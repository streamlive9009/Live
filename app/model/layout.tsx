"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function ModelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("modelToken")
    const modelAuth = localStorage.getItem("modelAuth")

    const isAuthPage = pathname?.includes("/auth/")

    if (!token || !modelAuth) {
      setIsAuthenticated(false)
      if (!isAuthPage) {
        router.push("/model/auth/login")
      }
    } else {
      setIsAuthenticated(true)
      if (isAuthPage) {
        router.push("/model")
      }
    }
  }, [pathname, router])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
