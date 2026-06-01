"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [error, setError] = useState<any>(null)

  const load = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")

    console.log("DATA:", data)
    console.log("ERROR:", error)

    setClients(data || [])
    setError(error)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main style={{ padding: 30 }}>
      <h1>👤 Clients</h1>

      {error && <p style={{ color: "red" }}>{error.message}</p>}

      {clients.map((c) => (
        <div key={c.id}>
          👤 {c.nom} — {c.email} — {c.telephone}
        </div>
      ))}
    </main>
  )
}