// JJQR - AI (Oct 7, 2026)
import { ImageResponse } from "next/og";
import { Pickleball, courtColors } from "@/lib/pickleball-art";

// JJQR - AI (Oct 7, 2026)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// JJQR - AI (Oct 7, 2026) — flat full-bleed green (iOS rounds the corners) with a flat pickleball.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: courtColors.court,
        }}
      >
        <Pickleball size={124} />
      </div>
    ),
    { ...size },
  );
}
