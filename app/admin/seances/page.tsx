"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuthGuard } from "@/lib/useAuthGuard"

export default function AdminSeancesPage() {
  const loading = useAuthGuard("admin")

  const [seances, setSeances] = useState<any[]>([])

  const [form, setForm] = useState({
    type: "obeissance",
    date: "",
    heure: "",
    places_max: 10
  })

  // 🔄 LOAD SÉANCES
  async function fetchSeances() {
    const { data, error } = await supabase
      .from("seances")
      .select("*")
      .order("date", { ascending: true })

    if (error) {
      console.log("FETCH ERROR:", error)
      return
    }

    setSeances(data || [])
  }

  // ➕ ADD SÉANCE
  async function addSeance() {
    if (!form.date || !form.heure) {
      alert("Date et heure obligatoires")
      return
    }

    const { error } = await supabase.from("seances").insert([
      {
        type: form.type,
        date: form.date,
        heure: form.heure,
        places_max: Number(form.places_max),
        places_restantes: Number(form.places_max)
      }
    ])

    if (error) {
      console.log("INSERT ERROR:", error)
      alert("Erreur création séance : " + error.message)
      return
    }

    setForm({
      type: "obeissance",
      date: "",
      heure: "",
      places_max: 10
    })

    fetchSeances()
  }

  // ❌ DELETE SÉANCE
  async function deleteSeance(id: string) {
    const ok = confirm("Supprimer cette séance ?")
    if (!ok) return

    const { error } = await supabase
      .from("seances")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("DELETE ERROR:", error)
      alert("Erreur suppression : " + error.message)
      return
    }

    fetchSeances()
  }

  useEffect(() => {
    fetchSeances()
  }, [])

  // 🛡 protection admin
  if (loading) {
    return (
      <main style={{ padding: 30 }}>
        <p>🔐 Vérification accès admin...</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>📅 Admin Séances</h1>

      {/* ➕ FORM */}
      <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10 }}>
        <h3>Créer une séance</h3>

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="obeissance">Obéissance</option>
          <option value="mordant">Mordant</option>
          <option value="theorie">Théorie</option>
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <input
          type="time"
          value={form.heure}
          onChange={(e) =>
            setForm({ ...form, heure: e.target.value })
          }
        />

        <input
          type="number"
          value={form.places_max}
          onChange={(e) =>
            setForm({
              ...form,
              places_max: Number(e.target.value)
            })
          }
        />

        <button onClick={addSeance} style={{ marginTop: 10 }}>
          Créer séance
        </button>
      </div>

      {/* 📋 LISTE */}
      <h2>Liste séances</h2>

      {seances.length === 0 ? (
        <p>Aucune séance</p>
      ) : (
        seances.map((s) => {
          const isFull = s.places_restantes <= 0

          return (
            <div
              key={s.id}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10,
                backgroundColor: isFull ? "#ffe5e5" : "white"
              }}
            >
              <strong>{s.type.toUpperCase()}</strong>

              <div>📆 {s.date}</div>
              <div>⏰ {s.heure}</div>

              <div>
                📊 Places :{" "}
                {s.places_max - s.places_restantes} / {s.places_max}
              </div>

              {isFull && (
                <div style={{ color: "red", fontWeight: "bold" }}>
                  ⚠ Séance complète
                </div>
              )}

              <button
                onClick={() => deleteSeance(s.id)}
                style={{
                  marginTop: 10,
                  background: "red",
                  color: "white",
                  padding: 6,
                  cursor: "pointer"
                }}
              >
                Supprimer
              </button>
            </div>
          )
        })
      )}
    </main>
  )
}