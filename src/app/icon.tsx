import { ImageResponse } from "next/og";

// Auto-generated favicon — Najaح mark on navy background
// Next.js convention: app/icon.tsx automatically becomes the site favicon

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F1B33",
          borderRadius: 6,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 28 Q14 16 28 16 Q48 16 54 32 Q58 52 36 56 Q20 58 12 48"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M20 14 L38 6 L56 14 L38 22 Z" fill="#FFFFFF" />
          <path
            d="M28 16 L38 22 L48 16 L48 24 Q48 27 44 28 L32 28 Q28 27 28 24 Z"
            fill="#FFFFFF"
          />
          <circle cx="38" cy="8" r="1.6" fill="#D4A72C" />
          <circle cx="56" cy="30" r="2.6" fill="#D4A72C" />
          <path
            d="M50 16 Q55 19 56 28"
            stroke="#D4A72C"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
