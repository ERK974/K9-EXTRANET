"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuthGuard } from "@/lib/useAuthGuard"

export default function AdminPage() {
  const loading = useAuthGuard("admin")
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()

    router.push("/login")
  }

  if (loading) {
    return (
      <main style={{ padding: 30 }}>
        <p>Vérification accès admin...</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>🛡 Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}
      >
        <button
          onClick={logout}
          style={{
            background: "red",
            color: "white",
            padding: 10,
            border: "none",
            cursor: "pointer"
          }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <Link href="/admin/clients">
          👤 Clients
        </Link>

        <Link href="/admin/chiens">
          🐕 Chiens
        </Link>

        <Link href="/admin/seances">
          📅 Séances
        </Link>
      </div>
    </main>
  )
}