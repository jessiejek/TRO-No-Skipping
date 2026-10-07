// JJQR - AI (Oct 7, 2026)
// Shared 1200x630 link-preview card used by opengraph-image and twitter-image.
import { ImageResponse } from "next/og";
import { event } from "@/lib/event";
import { Pickleball, courtColors } from "@/lib/pickleball-art";

// JJQR - AI (Oct 7, 2026)
export const shareCardSize = { width: 1200, height: 630 };
export const shareCardAlt = `${event.celebrantShort}'s Pickleball Birthday · ${event.partyDate}`;

// JJQR - AI (Oct 7, 2026)
const venueShort = event.venue.split(",")[0].trim();
const confetti = [
  { left: 70, top: 70, d: 18, c: "#fde047" },
  { left: 560, top: 40, d: 12, c: "#f9a8d4" },
  { left: 1110, top: 80, d: 16, c: "#fde047" },
  { left: 1040, top: 540, d: 14, c: "#f9a8d4" },
  { left: 110, top: 540, d: 12, c: courtColors.mint },
  { left: 640, top: 575, d: 10, c: "#fde047" },
  { left: 1150, top: 300, d: 10, c: courtColors.mint },
];

export function renderShareCard() {
  // JJQR - AI (Oct 7, 2026)
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: courtColors.court,
          backgroundImage: `linear-gradient(135deg, ${courtColors.courtLight} 0%, ${courtColors.court} 55%, ${courtColors.courtDark} 100%)`,
          color: "#ffffff",
        }}
      >
        {/* JJQR - AI (Oct 7, 2026) — court outline + kitchen line */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 32,
            top: 32,
            right: 32,
            bottom: 32,
            border: "4px solid rgba(255,255,255,0.28)",
            borderRadius: 20,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 470,
            top: 32,
            bottom: 32,
            width: 4,
            backgroundColor: "rgba(255,255,255,0.18)",
          }}
        />
        {confetti.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              position: "absolute",
              left: p.left,
              top: p.top,
              width: p.d,
              height: p.d,
              borderRadius: "50%",
              backgroundColor: p.c,
            }}
          />
        ))}

        {/* JJQR - AI (Oct 7, 2026) — ball */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 470,
            height: "100%",
          }}
        >
          <Pickleball size={300} />
        </div>

        {/* JJQR - AI (Oct 7, 2026) — text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingLeft: 40,
            paddingRight: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 22px",
              borderRadius: 999,
              backgroundColor: courtColors.mint,
              color: courtColors.courtDark,
              fontSize: 26,
              letterSpacing: 1,
            }}
          >
            {`You're invited · ${event.brandName}`}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {`${event.celebrantShort}'s Pickleball Birthday`}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 36,
              color: "#d9f99d",
            }}
          >
            {event.partyDate}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontSize: 28,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {`${event.partyTime} · ${venueShort}`}
          </div>
        </div>
      </div>
    ),
    { ...shareCardSize },
  );
}
