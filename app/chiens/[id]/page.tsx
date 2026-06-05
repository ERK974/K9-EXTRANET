"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useParams } from "next/navigation"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ChienDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [chien, setChien] = useState<any>(null)

  async function fetchChien() {
    if (!id) return

    const { data, error } = await supabase
      .from("chiens")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.log("CHIEN ERROR:", error)
      return
    }

    // 🔥 fetch client séparé (plus fiable que join)
    let clientData = null

    if (data.client_id) {
      const { data: client } = await supabase
        .from("clients")
        .select("nom, prenom, telephone, email")
        .eq("id", data.client_id)
        .single()

      clientData = client
    }

    setChien({
      ...data,
      client: clientData
    })
  }

  useEffect(() => {
    fetchChien()
  }, [id])

  if (!chien) {
    return (
      <main style={{ padding: 30 }}>
        <p>Chargement...</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 30 }}>
      <Link href="/chiens">← Retour</Link>

      <h1 style={{ marginTop: 20 }}>
        🐕 {chien.nom}
      </h1>

      {/* CHIEN */}
      <section style={{ marginTop: 20 }}>
        <h3>Infos chien</h3>

        <p>Race : {chien.race}</p>
        <p>Âge : {chien.age ?? "Non renseigné"}</p>

        <p>
          Identification : {chien.numero_identification_chien}
        </p>

        <p>
          Mordant : {chien.autorise_mordant ? "Oui" : "Non"}
        </p>

        <p>
          Statut : {chien.locked ? "🔒 Verrouillé" : "🟢 Actif"}
        </p>
      </section>

      <hr style={{ margin: "20px 0" }} />

      {/* CLIENT */}
      <section>
        <h3>Client associé</h3>

        {chien.client ? (
          <>
            <p>
              Nom : {chien.client.nom} {chien.client.prenom}
            </p>
            <p>Téléphone : {chien.client.telephone}</p>
            <p>Email : {chien.client.email}</p>
          </>
        ) : (
          <p>Aucun client associé</p>
        )}
      </section>
    </main>
  )
}