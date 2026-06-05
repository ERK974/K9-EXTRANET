import { company } from "../../lib/company"

export default function BrandHeader() {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "#111513",
        borderBottom: "1px solid #2c322f",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#cfd2c7"
      }}
    >
      <div style={{ fontWeight: 700 }}>
        🐕 {company.name}
      </div>

      <div style={{ fontSize: 12, textAlign: "right" }}>
        <div>SIRET : {company.legal.siret}</div>
        <div>{company.legal.objet_social}</div>
        <div>
          📞 {company.contact.phone} | ✉ {company.contact.email}
        </div>
      </div>
    </div>
  )
}