"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../../lib/supabase"

export default function SeancesPage() {
  const [seances, setSeances] = useState<any[]>([])

  async function fetchSeances() {
    const { data: seancesData, error: seancesError } =
      await supabase
        .from("seances")
        .select("*")
        .neq("statut", "termine")
        .order("date", { ascending: true })

    if (seancesError) {
      console.log("SEANCES ERROR:", seancesError)
      return
    }

    // 🔄 ON PREND LES CHIENS MAINTENANT
    const { data: reservationsData, error: reservationsError } =
      await supabase
        .from("reservations")
        .select("seance_id, chien_id")

    if (reservationsError) {
      console.log("RESERVATIONS ERROR:", reservationsError)
      return
    }

    // 🔥 COMPTE PAR CHIEN (LOGIQUE MÉTIER CORRECTE)
    const reservationsCount: Record<string, Set<string>> = {}

    reservationsData?.forEach((r: any) => {
      const key = String(r.seance_id)

      if (!reservationsCount[key]) {
        reservationsCount[key] = new Set()
      }

      reservationsCount[key].add(String(r.chien_id))
    })

    const enriched = (seancesData || []).map((s) => {
      const key = String(s.id)

      const inscrits = reservationsCount[key]
        ? reservationsCount[key].size
        : 0

      const placesMax = Number(s.places_max || 0)

      const placesRestantes = Math.max(
        placesMax - inscrits,
        0
      )

      return {
        ...s,
        inscrits,
        places_restantes: placesRestantes
      }
    })

    setSeances(enriched)
  }

  useEffect(() => {
    fetchSeances()
  }, [])

  return (
    <main style={{ padding: 30 }}>
      <h1>📅 Séances</h1>

      {seances.length === 0 ? (
        <p>Aucune séance</p>
      ) : (
        seances.map((s) => {
          const complet = s.places_restantes === 0

          return (
            <div
              key={s.id}
              style={{
                background: "#242424",
                border: "1px solid #2c322f",
                padding: 14,
                marginBottom: 12,
                borderRadius: 8,
                maxWidth: 650,
                borderLeft: complet
                  ? "3px solid #8b5a4a"
                  : "3px solid #D2B48C",
                opacity: complet ? 0.7 : 1
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {s.type}
              </div>

              <div>
                📅 {s.date} - ⏰ {s.heure}
              </div>

              <div>
                ⏳ {s.duree} min
              </div>

              <div>
                🐕 {s.inscrits} / {s.places_max} chiens inscrits
              </div>

              <div>
                Places restantes : {s.places_restantes}
              </div>

              <div>
                Statut :{" "}
                <span style={{ fontWeight: 600 }}>
                  {complet ? "COMPLET" : "DISPONIBLE"}
                </span>
              </div>

              <div style={{ marginTop: 10 }}>
                <Link href={`/seances/${s.id}`}>
                  Voir détails →
                </Link>
              </div>
            </div>
          )
        })
      )}
    </main>
  )
}