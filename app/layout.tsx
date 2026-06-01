export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <h1 style={{ color: "red" }}>
          LAYOUT ACTIF
        </h1>

        {children}
      </body>
    </html>
  )
}