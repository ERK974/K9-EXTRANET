"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuthGuard } from "@/lib/useAuthGuard"

export default function ClientPage() {
  const loading = useAuthGuard("client")

  const [profile, setProfile] = useState<any>(null)
  const [chiens, setChiens] = useState<any[]>([])

  // 🔄 LOAD PROFIL CLIENT
  async function fetchProfile() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) return

    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("id", userData.user.id)
      .single()

    setProfile(data)
  }

  // 🔄 LOAD CHIENS DU CLIENT
  async function fetchChiens() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) return

    const { data } = await supabase
      .from("chiens")
      .select("*")
      .eq("client_id", userData.user.id)
      .order("nom", { ascending: true })

    setChiens(data || [])
  }

  useEffect(() => {
    fetchProfile()
    fetchChiens()
  }, [])

  if (loading) {
    return <p style={{ padding: 30 }}>🔐 Chargement espace client...</p>
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>👤 Espace Client</h1>

      {/* 👤 INFO CLIENT */}
      {profile && (
        <div style={{ marginBottom: 20 }}>
          <h3>Mes informations</h3>
          <p>{profile.nom} {profile.prenom}</p>
          <p>{profile.email}</p>
          <p>{profile.telephone}</p>
        </div>
      )}

      {/* 🐕 CHIENS */}
      <h3>Mes chiens</h3>

      {chiens.length === 0 ? (
        <p>Aucun chien enregistré</p>
      ) : (
        chiens.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10
            }}
          >
            <strong>{c.nom}</strong>
            <div>Race : {c.race}</div>
          </div>
        ))
      )}
    </main>
  )
}