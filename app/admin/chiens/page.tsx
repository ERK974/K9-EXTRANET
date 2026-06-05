"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuthGuard } from "@/lib/useAuthGuard"

export default function AdminChiens() {
  const loading = useAuthGuard("admin")

  const [chiens, setChiens] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])

  const [nom, setNom] = useState("")
  const [race, setRace] = useState("")
  const [clientId, setClientId] = useState("")

  // 🔄 LOAD CHIENS (tri alphabétique)
  async function fetchChiens() {
    const { data, error } = await supabase
      .from("chiens")
      .select("*, clients(nom, prenom)")
      .order("nom", { ascending: true })

    if (error) {
      console.log("CHIENS ERROR:", error)
      return
    }

    setChiens(data || [])
  }

  // 🔄 LOAD CLIENTS (tri alphabétique)
  async function fetchClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("id, nom, prenom")
      .order("nom", { ascending: true })

    if (error) {
      console.log("CLIENTS ERROR:", error)
      return
    }

    setClients(data || [])
  }

  // ➕ ADD CHIEN
  async function addChien() {
    if (!nom.trim() || !race.trim() || !clientId) {
      alert("Champs manquants")
      return
    }

    const { error } = await supabase.from("chiens").insert([
      {
        nom: nom.trim(),
        race: race.trim(),
        client_id: clientId
      }
    ])

    if (error) {
      console.log("ADD ERROR:", error)
      alert("Erreur ajout chien : " + error.message)
      return
    }

    setNom("")
    setRace("")
    setClientId("")
    fetchChiens()
  }

  // ❌ DELETE CHIEN
  async function deleteChien(id: string) {
    const ok = confirm("Supprimer ce chien ?")
    if (!ok) return

    const { error } = await supabase
      .from("chiens")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("DELETE ERROR:", error)
      alert("Erreur suppression : " + error.message)
      return
    }

    fetchChiens()
  }

  useEffect(() => {
    fetchChiens()
    fetchClients()
  }, [])

  // 🛡 loading guard
  if (loading) {
    return (
      <main style={{ padding: 30 }}>
        <p>🔐 Vérification accès admin...</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>🐕 Admin Chiens</h1>

      {/* ➕ FORM */}
      <div style={{ marginBottom: 20, padding: 10, border: "1px solid #ccc" }}>
        <h3>Ajouter un chien</h3>

        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />

        <input
          placeholder="Race"
          value={race}
          onChange={(e) => setRace(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />

        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        >
          <option value="">Choisir client</option>

          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom} {c.prenom}
            </option>
          ))}
        </select>

        <button onClick={addChien}>
          Ajouter chien
        </button>
      </div>

      {/* 📋 LISTE CHIENS */}
      <h2>Liste chiens</h2>

      {chiens.length === 0 ? (
        <p>Aucun chien</p>
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

            <div>
              Client :{" "}
              {c.clients
                ? `${c.clients.nom} ${c.clients.prenom}`
                : "N/A"}
            </div>

            <button
              onClick={() => deleteChien(c.id)}
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
        ))
      )}
    </main>
  )
}