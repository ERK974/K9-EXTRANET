"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ChiensPage() {
  const [chiens, setChiens] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      console.log("SUPABASE TEST RUN")

      const { data, error } = await supabase
        .from("chiens")
        .select("*")

      console.log("DATA:", data)
      console.log("ERROR:", error)

      setChiens(data || [])
    }

    load()
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>Chiens</h1>

      {chiens.length === 0 ? (
        <p>Aucun chien</p>
      ) : (
        chiens.map((c, i) => (
          <div key={i}>
            🐕 {c.nom}
          </div>
        ))
      )}
    </main>
  )
}