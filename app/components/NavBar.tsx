"use client"

import { useRouter } from "next/navigation"

export default function NavBar() {
  const router = useRouter()

  return (
    <div
      style={{
        padding: "10px 16px",
        background: "#111513",
        borderBottom: "1px solid #2c322f",
        color: "#cfd2c7",
        display: "flex",
        alignItems: "center"
      }}
    >
      {/* NOM APP */}
      <div style={{ fontWeight: 700, letterSpacing: 1 }}>
        K9 Éducation Réunion
      </div>

      {/* ESPACE + BOUTON RETOUR */}
      <div style={{ marginLeft: "auto" }}>
        <button onClick={() => router.back()}>
          Retour
        </button>
      </div>
    </div>
  )
}