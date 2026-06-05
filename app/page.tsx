import Link from "next/link"

export default function Dashboard() {
  return (
    <main style={{ padding: 30 }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* 📊 ACCUEIL */}
        <Link href="/">
          🏠 Accueil
        </Link>

        {/* 👤 CLIENTS */}
        <Link href="/clients">
          👤 Clients
        </Link>

        {/* 🐕 CHIENS */}
        <Link href="/chiens">
          🐕 Chiens
        </Link>

        {/* 📅 SÉANCES */}
        <Link href="/seances">
          📅 Séances
        </Link>

        {/* 📊 STATS */}
        <Link href="/stats">
          📊 Statistiques
        </Link>

      </div>
    </main>
  )
}