"use client"

import { useRouter } from "next/navigation"

export default function MobileBar() {
  const router = useRouter()

  return (
    <div
      className="mobile-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#111513",
        borderTop: "1px solid #2c322f",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 0",
        zIndex: 1000
      }}
    >
      <button onClick={() => router.push("/")}>🏠</button>

      <button onClick={() => router.back()}>↩️</button>

      <button onClick={() => router.push("/seances")}>📅</button>

      <button onClick={() => router.push("/chiens")}>🐕</button>

      <button onClick={() => router.push("/clients")}>👤</button>
    </div>
  )
}