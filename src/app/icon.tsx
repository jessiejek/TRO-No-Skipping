// JJQR - AI (Oct 7, 2026)
import { ImageResponse } from "next/og";
import { Pickleball, courtColors } from "@/lib/pickleball-art";

// JJQR - AI (Oct 7, 2026)
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// JJQR - AI (Oct 7, 2026) — pickleball favicon on a green court tile.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: 7,
          backgroundColor: courtColors.court,
        }}
      >
        <Pickleball size={26} simple />
      </div>
    ),
    { ...size },
  );
}
