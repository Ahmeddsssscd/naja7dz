import { ImageResponse } from "next/og";

// Default OG image — appears when naja7dz.com is shared on WhatsApp, FB, X, etc.
// Next.js convention: app/opengraph-image.tsx → /opengraph-image

export const alt = "Najaح — La plateforme éducative qui aide ton enfant à réussir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #FAF9F6 0%, #FAF9F6 50%, #E8EDF5 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Top: Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 18,
              background: "#0F1B33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 28 Q14 16 28 16 Q48 16 54 32 Q58 52 36 56 Q20 58 12 48"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M20 14 L38 6 L56 14 L38 22 Z" fill="#FFFFFF" />
              <path
                d="M28 16 L38 22 L48 16 L48 24 Q48 27 44 28 L32 28 Q28 27 28 24 Z"
                fill="#FFFFFF"
              />
              <circle cx="56" cy="30" r="3" fill="#D4A72C" />
              <path
                d="M50 16 Q55 19 56 28"
                stroke="#D4A72C"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#0F1B33",
              letterSpacing: "-1.5px",
            }}
          >
            Najaح
          </div>
        </div>

        {/* Center: Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              color: "#0F1B33",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            La plateforme qui aide ton enfant à{" "}
            <span
              style={{
                color: "#D4A72C",
                marginLeft: 16,
                borderBottom: "10px solid rgba(212, 167, 44, 0.45)",
              }}
            >
              réussir.
            </span>
          </div>
          <div style={{ fontSize: 28, color: "#5A6478", maxWidth: 800, lineHeight: 1.4 }}>
            Du primaire au Bac · Programme officiel algérien · Arabe & Français
          </div>
        </div>

        {/* Bottom: URL strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#5A6478",
          }}
        >
          <span style={{ color: "#0F1B33", fontWeight: 600 }}>naja7dz.com</span>
          <span style={{ color: "#D4A72C" }}>Fait avec ❤️ en Algérie</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
