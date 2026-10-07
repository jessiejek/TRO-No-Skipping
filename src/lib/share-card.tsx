// JJQR - AI (Oct 7, 2026)
// Shared 1200x630 link-preview card used by opengraph-image and twitter-image. Flat + minimal.
import { ImageResponse } from "next/og";
import { event } from "@/lib/event";
import { Pickleball, courtColors } from "@/lib/pickleball-art";

// JJQR - AI (Oct 7, 2026)
export const shareCardSize = { width: 1200, height: 630 };
export const shareCardAlt = `${event.celebrantShort}'s Pickleball Birthday · ${event.partyDate}`;

// JJQR - AI (Oct 7, 2026) — "Oct 24 · Prospin Sports Center"
const shortDate = new Date(event.partyStartsAt).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "Asia/Manila",
});
const venueShort = event.venue.split(",")[0].trim();

export function renderShareCard() {
  // JJQR - AI (Oct 7, 2026)
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: courtColors.court,
          color: "#ffffff",
        }}
      >
        <Pickleball size={150} />
        <div style={{ display: "flex", marginTop: 48, fontSize: 64 }}>
          {`${event.celebrantShort}'s Pickleball Birthday`}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 30,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          {`${shortDate} · ${venueShort}`}
        </div>
      </div>
    ),
    { ...shareCardSize },
  );
}
