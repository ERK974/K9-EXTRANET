"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function StatsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [chiens, setChiens] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])

  async function fetchData() {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, nom, prenom")

    const { data: chiensData } = await supabase
      .from("chiens")
      .select("id, nom, client_id")

    const { data: resData } = await supabase
      .from("reservations")
      .select("*")
      .eq("statut", "present") // 🔥 uniquement présents

    setClients(clientsData || [])
    setChiens(chiensData || [])
    setReservations(resData || [])
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 📊 TOP CLIENTS (présences uniquement)
  const clientStats = clients
    .map((c) => {
      const clientReservations = reservations.filter(
        (r) => r.client_id === c.id
      )

      const dogIds = [...new Set(clientReservations.map(r => r.chien_id))]

      const dogs = chiens.filter(d =>
        dogIds.includes(d.id)
      )

      return {
        ...c,
        totalPresent: clientReservations.length,
        dogs
      }
    })
    .filter(c => c.totalPresent > 0)
    .sort((a, b) => b.totalPresent - a.totalPresent)
    .slice(0, 3) // 🔥 TOP 3 uniquement

  return (
    <main style={{ padding: 30 }}>
      <Link href="/">← Dashboard</Link>

      <h1>📊 Top 3 Clients les plus présents</h1>

      <hr />

      {clientStats.length === 0 && (
        <p>Aucune donnée disponible</p>
      )}

      {clientStats.map((c, index) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15
          }}
        >
          <h2>
            {index === 0 && "🥇"}
            {index === 1 && "🥈"}
            {index === 2 && "🥉"}
            {" "}
            {c.nom} {c.prenom}
          </h2>

          <p>🟢 Présences : {c.totalPresent}</p>

          <div>
            <strong>🐕 Chiens utilisés :</strong>
            {c.dogs.length === 0 ? (
              <p>Aucun chien</p>
            ) : (
              c.dogs.map((d: any) => (
                <div key={d.id}>
                  - {d.nom}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </main>
  )
}