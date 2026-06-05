"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function ChiensPage() {
  const [nom, setNom] = useState("")
  const [race, setRace] = useState("")
  const [numeroId, setNumeroId] = useState("")

  const [clientId, setClientId] = useState("")
  const [clients, setClients] = useState<any[]>([])

  const [autoriseMordant, setAutoriseMordant] =
    useState(false)

  // 🔄 LOAD CLIENTS
  async function loadClients() {
    const { data, error } =
      await supabase
        .from("clients")
        .select(
          "id, nom, prenom, type"
        )

    if (error) {
      console.log(
        "CLIENT LOAD ERROR:",
        error
      )
      return
    }

    setClients(data || [])
  }

  useEffect(() => {
    loadClients()
  }, [])

  // ➕ AJOUT CHIEN
  async function addDog() {
    if (
      !nom ||
      !race ||
      !clientId
    ) {
      alert(
        "Champs obligatoires manquants"
      )
      return
    }

    const { error } =
      await supabase
        .from("chiens")
        .insert([
          {
            nom,
            race,
            numero_identification_chien:
              numeroId,
            client_id: clientId,
            autorise_mordant:
              autoriseMordant
          }
        ])

    if (error) {
      console.log(error)

      alert(
        "Erreur ajout chien"
      )

      return
    }

    // RESET
    setNom("")
    setRace("")
    setNumeroId("")
    setClientId("")
    setAutoriseMordant(false)

    alert("Chien ajouté ✔")
  }

  return (
    <main
      style={{
        padding: 30,
        maxWidth: 600
      }}
    >
      <h1>🐕 Ajouter chien</h1>

      <input
        placeholder="Nom du chien"
        value={nom}
        onChange={(e) =>
          setNom(e.target.value)
        }
        style={{
          display: "block",
          marginBottom: 10,
          width: "100%"
        }}
      />

      <input
        placeholder="Race"
        value={race}
        onChange={(e) =>
          setRace(e.target.value)
        }
        style={{
          display: "block",
          marginBottom: 10,
          width: "100%"
        }}
      />

      <input
        placeholder="Numéro identification chien"
        value={numeroId}
        onChange={(e) =>
          setNumeroId(
            e.target.value
          )
        }
        style={{
          display: "block",
          marginBottom: 10,
          width: "100%"
        }}
      />

      <select
        value={clientId}
        onChange={(e) =>
          setClientId(
            e.target.value
          )
        }
        style={{
          display: "block",
          marginBottom: 10,
          width: "100%"
        }}
      >
        <option value="">
          Choisir client
        </option>

        {clients.map((c) => (
          <option
            key={c.id}
            value={c.id}
          >
            {c.nom} {c.prenom} (
            {c.type})
          </option>
        ))}
      </select>

      <label
        style={{
          display: "block",
          marginTop: 10,
          marginBottom: 10
        }}
      >
        <input
          type="checkbox"
          checked={
            autoriseMordant
          }
          onChange={(e) =>
            setAutoriseMordant(
              e.target.checked
            )
          }
        />{" "}
        Autorisé mordant
      </label>

      <button
        onClick={addDog}
        style={{
          marginTop: 10
        }}
      >
        Ajouter chien
      </button>
    </main>
  )
}