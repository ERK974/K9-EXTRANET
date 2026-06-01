import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1>K9 Extranet V1</h1>

      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/clients">Clients</Link>
        <Link href="/chiens">Chiens</Link>
        <Link href="/seances">Séances</Link>
      </nav>
    </div>
  )
}