"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function useAuthGuard(requiredRole?: "admin" | "client") {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile) {
        router.push("/login")
        return
      }

      if (requiredRole && profile.role !== requiredRole) {
        router.push(profile.role === "admin" ? "/admin" : "/client")
        return
      }

      setLoading(false)
    }

    check()
  }, [router, requiredRole])

  return loading
}