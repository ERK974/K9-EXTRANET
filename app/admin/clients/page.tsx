"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuthGuard } from "@/lib/useAuthGuard"

export default function AdminClientsPage() {
  const loading = useAuthGuard("admin")

  const [clients, setClients] = useState<any[]>([])

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    type: "particulier",
    numero_carte_pro: ""
  })

  // 🔄 LOAD CLIENTS
  async function fetchClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("*, chiens(*)")
      .order("nom", { ascending: true })

    if (error) {
      console.log("FETCH ERROR:", error)
      return
    }

    setClients(data || [])
  }

  // ➕ ADD CLIENT
  async function addClient() {
    if (!form.nom.trim() || !form.prenom.trim()) {
      alert("Nom et prénom obligatoires")
      return
    }

    const { error } = await supabase.from("clients").insert([
      {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email,
        telephone: form.telephone,
        type: form.type,
        numero_carte_pro:
          form.type === "pro" ? form.numero_carte_pro : null
      }
    ])

    if (error) {
      console.log("INSERT ERROR:", error)
      alert("Erreur ajout client : " + error.message)
      return
    }

    setForm({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      type: "particulier",
      numero_carte_pro: ""
    })

    fetchClients()
  }

  // ❌ DELETE CLIENT
  async function deleteClient(id: string) {
    const ok = confirm("Supprimer ce client ?")
    if (!ok) return

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("DELETE ERROR:", error)
      alert("Erreur suppression : " + error.message)
      return
    }

    fetchClients()
  }

  useEffect(() => {
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
      <h1>👤 Admin Clients</h1>

      {/* ➕ FORM */}
      <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10 }}>
        <h3>Ajouter client</h3>

        <input
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />

        <input
          placeholder="Prénom"
          value={form.prenom}
          onChange={(e) => setForm({ ...form, prenom: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Téléphone"
          value={form.telephone}
          onChange={(e) => setForm({ ...form, telephone: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="particulier">Particulier</option>
          <option value="pro">Professionnel</option>
        </select>

        {form.type === "pro" && (
          <input
            placeholder="Numéro carte pro"
            value={form.numero_carte_pro}
            onChange={(e) =>
              setForm({
                ...form,
                numero_carte_pro: e.target.value
              })
            }
          />
        )}

        <button onClick={addClient} style={{ marginTop: 10 }}>
          Ajouter client
        </button>
      </div>

      {/* 📋 LISTE CLIENTS */}
      <h2>Liste clients</h2>

      {clients.length === 0 ? (
        <p>Aucun client</p>
      ) : (
        clients.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10
            }}
          >
            <strong>{c.nom} {c.prenom}</strong>

            <div>{c.email}</div>
            <div>{c.telephone}</div>
            <div>Type : {c.type}</div>

            {/* 🐕 CHIENS */}
            <div style={{ marginTop: 10 }}>
              <strong>Chiens :</strong>

              {c.chiens?.length > 0 ? (
                c.chiens.map((chien: any) => (
                  <div key={chien.id} style={{ marginLeft: 15 }}>
                    🐕 {chien.nom}
                  </div>
                ))
              ) : (
                <div style={{ marginLeft: 15 }}>
                  Aucun chien
                </div>
              )}
            </div>

            <button
              onClick={() => deleteClient(c.id)}
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