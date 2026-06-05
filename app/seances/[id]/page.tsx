"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useParams } from "next/navigation"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SeanceDetail() {
  const { id } = useParams()

  const [seance, setSeance] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [chiens, setChiens] = useState<any[]>([])

  const [selectedClient, setSelectedClient] = useState("")
  const [selectedChien, setSelectedChien] = useState("")

  async function fetchData() {
    const { data: seanceData } = await supabase
      .from("seances")
      .select("*")
      .eq("id", id)
      .single()

    const { data: resData } = await supabase
      .from("reservations")
      .select("*")
      .eq("seance_id", id)

    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, nom, prenom")

    const { data: chiensData } = await supabase
      .from("chiens")
      .select("id, nom, client_id")

    setSeance(seanceData)
    setReservations(resData || [])
    setClients(clientsData || [])
    setChiens(chiensData || [])
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  // 🧠 CAPACITÉ RÉELLE
  const placesOccupees = reservations.length
  const capacite = Number(seance?.places_max || 0)
  const isFull = placesOccupees >= capacite

  // 🧠 chiens déjà pris par client sur cette séance
  const chiensDejaPris = reservations
    .filter((r) => r.client_id === selectedClient)
    .map((r) => r.chien_id)

  const chiensClient = chiens.filter(
    (c) =>
      c.client_id === selectedClient &&
      !chiensDejaPris.includes(c.id)
  )

  // 🧠 compteur client
  const chiensCountClient = reservations.filter(
    (r) =>
      r.client_id === selectedClient
  ).length

  // 🚀 RESERVATION SAFE (VERROUILLAGE COMPLET)
  async function reserver() {
    if (!selectedClient || !selectedChien) return

    if (isFull) {
      alert("Séance complète ❌")
      return
    }

    const chiensClientCount = reservations.filter(
      (r) =>
        r.client_id === selectedClient
    ).length

    if (chiensClientCount >= 3) {
      alert("Maximum 3 chiens par client ❌")
      return
    }

    // 🔒 DOUBLE CHECK AVANT INSERT (ANTI BUG)
    const { data: currentSeance } = await supabase
      .from("seances")
      .select("places_max")
      .eq("id", id)
      .single()

    if (placesOccupees >= (currentSeance?.places_max || 0)) {
      alert("Séance complète (mise à jour temps réel) ❌")
      return
    }

    const { error } = await supabase
      .from("reservations")
      .insert([
        {
          client_id: selectedClient,
          seance_id: id,
          chien_id: selectedChien,
          statut: "inscrit"
        }
      ])

    if (error) {
      console.log(error)
      alert("Erreur réservation")
      return
    }

    setSelectedChien("")
    fetchData()
  }

  async function setStatut(reservationId: number, statut: string) {
    await supabase
      .from("reservations")
      .update({ statut })
      .eq("id", reservationId)

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? { ...r, statut }
          : r
      )
    )
  }

  if (!seance) return <p style={{ padding: 30 }}>Chargement...</p>

  return (
    <main style={{ padding: 30 }}>
      <Link href="/seances">← Retour</Link>

      <h1>📅 {seance.type}</h1>

      <p>📆 {seance.date}</p>
      <p>⏰ {seance.heure}</p>

      <h3>
        📍 Places : {placesOccupees} / {capacite}
      </h3>

      {isFull && (
        <p style={{ color: "red", fontWeight: 700 }}>
          🔒 Séance complète
        </p>
      )}

      <hr />

      {/* ➕ RESERVATION */}
      <h2>Ajouter une réservation</h2>

      <select
        value={selectedClient}
        onChange={(e) => {
          setSelectedClient(e.target.value)
          setSelectedChien("")
        }}
        disabled={isFull}
      >
        <option value="">Choisir client</option>

        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nom} {c.prenom}
          </option>
        ))}
      </select>

      {selectedClient && (
        <p>
          🐕 Chiens : {chiensCountClient} / 3
        </p>
      )}

      {selectedClient && chiensClient.length > 0 && (
        <select
          value={selectedChien}
          onChange={(e) => setSelectedChien(e.target.value)}
          disabled={isFull || chiensCountClient >= 3}
        >
          <option value="">Choisir chien</option>

          {chiensClient.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.nom}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={reserver}
        disabled={
          isFull ||
          !selectedClient ||
          !selectedChien ||
          chiensCountClient >= 3
        }
        style={{
          opacity:
            isFull ? 0.5 : 1,
          cursor:
            isFull ? "not-allowed" : "pointer"
        }}
      >
        Ajouter chien
      </button>

      <hr />

      {/* 👥 PARTICIPANTS */}
      <h2>Participants</h2>

      {reservations.length === 0 ? (
        <p>Aucun participant</p>
      ) : (
        reservations.map((r) => {
          const client = clients.find(
            (c) => c.id === r.client_id
          )
          const chien = chiens.find(
            (c) => c.id === r.chien_id
          )

          return (
            <div
              key={r.id}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10
              }}
            >
              <strong>
                {client
                  ? `${client.nom} ${client.prenom}`
                  : "Client"}
              </strong>

              <div>
                🐕{" "}
                {chien
                  ? chien.nom
                  : "Sans chien"}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 10
                }}
              >
                <button
                  onClick={() =>
                    setStatut(r.id, "present")
                  }
                >
                  Présent
                </button>

                <button
                  onClick={() =>
                    setStatut(r.id, "absent")
                  }
                >
                  Absent
                </button>
              </div>
            </div>
          )
        })
      )}
    </main>
  )
}