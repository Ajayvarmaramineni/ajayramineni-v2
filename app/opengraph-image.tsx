import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ajay Ramineni — Data Strategist & ML Enthusiast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Indigo accent bar */}
        <div
          style={{
            width: 80,
            height: 4,
            background: "#6366f1",
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f8f8f8",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Ajay Ramineni
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          Data Strategist · ML Engineer · Founder of DataStatz
        </div>

        {/* Bottom row */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 20, color: "#52525b" }}>
            MS Business Analytics @ WPI
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#6366f1",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            ajayramineni.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
