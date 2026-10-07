// JJQR - AI (Oct 7, 2026)
import { ImageResponse } from "next/og";
import { Pickleball, courtColors } from "@/lib/pickleball-art";

// JJQR - AI (Oct 7, 2026)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// JJQR - AI (Oct 7, 2026) — full-bleed court (iOS rounds the corners) with a center line + pickleball.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: courtColors.court,
          backgroundImage: `linear-gradient(160deg, ${courtColors.courtLight} 0%, ${courtColors.court} 60%, ${courtColors.courtDark} 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            right: 0,
            top: 88,
            height: 4,
            backgroundColor: "rgba(255,255,255,0.35)",
          }}
        />
        <Pickleball size={124} />
      </div>
    ),
    { ...size },
  );
}
