import "./globals.css"
import Image from "next/image"

export const metadata = {
  title: "K9 Éducation Réunion",
  description: "Gestion cynophile"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>

        {/* 🧠 HEADER GLOBAL */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 15,
            borderBottom: "1px solid #ddd"
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
          />

          <strong>K9 Éducation Réunion</strong>
        </header>

        {/* 📦 CONTENU DES PAGES */}
        <main>
          {children}
        </main>

      </body>
    </html>
  )
}