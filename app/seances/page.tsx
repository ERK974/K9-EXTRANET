"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Seances() {
  const [seances, setSeances] = useState<any[]>([])
  const [chiens, setChiens] = useState<any[]>([])
  const [selected, setSelected] = useState<Record<string, string>>({})

  const load = async () => {
    // 1. séances
    const { data: seancesData } = await supabase
      .from("seances")
      .select("*")
      .order("date", { ascending: true })

    // 2. chiens
    const { data: chiensData } = await supabase
      .from("chiens")
      .select("*")

    // 3. reservations (simple et fiable)
    const { data: reservationsData } = await supabase
      .from("reservations")
      .select("*")

    // merge manuel (FIABLE)
    const merged = (seancesData || []).map((s) => ({
      ...s,
      reservations: (reservationsData || []).filter(
        (r) => r.seance_id === s.id
      ),
    }))

    setSeances(merged)
    setChiens(chiensData || [])
  }

  useEffect(() => {
    load()
  }, [])

  const inscrire = async (seanceId: string) => {
    const chienId = selected[seanceId]

    if (!chienId) {
      alert("Choisir un chien")
      return
    }

    // 🔒 anti doublon côté FRONT
    const seance = seances.find((s) => s.id === seanceId)

    const already = seance?.reservations?.some(
      (r: any) => r.chien_id === chienId
    )

    if (already) {
      alert("Déjà inscrit")
      return
    }

    const { error } = await supabase
      .from("reservations")
      .insert({
        seance_id: seanceId,
        chien_id: chienId,
      })

    if (error) {
      console.log(error)
      alert("Erreur inscription")
      return
    }

    load()
  }

  const retirer = async (id: string) => {
    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Erreur suppression")
      return
    }

    load()
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>📅 Séances K9-ER</h1>

      {seances.map((s) => {
        const count = s.reservations?.length || 0
        const max = s.place_max || 0
        const full = max && count >= max
        const closed = s.statut !== "ouverte"

        return (
          <div key={s.id} style={box}>

            <strong>
              🕒 {s.date} {s.heure} — {s.type}
            </strong>

            <div>
              🐕 {count}/{max || "∞"}{" "}
              {full && "🔴 COMPLET"}{" "}
              {closed && "⚫ FERMÉ"}
            </div>

            {/* LISTE INSCRITS */}
            <div style={{ marginTop: 10 }}>
              {s.reservations?.map((r: any) => {
                const chien = chiens.find(
                  (c) => c.id === r.chien_id
                )

                return (
                  <div key={r.id} style={row}>
                    🐕 {chien?.nom || "chien"}

                    <button onClick={() => retirer(r.id)}>
                      retirer
                    </button>
                  </div>
                )
              })}
            </div>

            {/* INSCRIPTION */}
            <div style={{ marginTop: 10 }}>
              <select
                value={selected[s.id] || ""}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    [s.id]: e.target.value,
                  })
                }
              >
                <option value="">Choisir chien</option>
                {chiens.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>

              <button
                disabled={full || closed}
                onClick={() => inscrire(s.id)}
                style={{ marginLeft: 10 }}
              >
                inscrire
              </button>
            </div>

          </div>
        )
      })}
    </main>
  )
}

const box: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 15,
  marginBottom: 15,
  borderRadius: 8,
}

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: 5,
}