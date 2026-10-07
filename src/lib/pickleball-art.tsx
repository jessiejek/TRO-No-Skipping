// JJQR - AI (Oct 7, 2026)
// Shared pickleball artwork for next/og ImageResponse (icon, apple-icon, OG/Twitter images).
// Satori-friendly: flex layout + absolute positioning only.

type Hole = { x: number; y: number; d: number };

// JJQR - AI (Oct 7, 2026) — hole positions as fractions of the ball diameter.
function ring(count: number, radius: number, d: number, offsetDeg = 0): Hole[] {
  return Array.from({ length: count }, (_, i) => {
    const a = ((360 / count) * i + offsetDeg) * (Math.PI / 180);
    return { x: 0.5 + radius * Math.cos(a), y: 0.5 + radius * Math.sin(a), d };
  });
}

// JJQR - AI (Oct 7, 2026) — detailed layout for large renders, chunky layout for tiny favicons.
const DETAILED_HOLES: Hole[] = [
  { x: 0.5, y: 0.5, d: 0.1 },
  ...ring(6, 0.22, 0.095, 0),
  ...ring(10, 0.385, 0.085, 18),
];

const SIMPLE_HOLES: Hole[] = [
  { x: 0.5, y: 0.5, d: 0.16 },
  ...ring(5, 0.29, 0.15, -90),
];

export const courtColors = {
  // JJQR - AI (Oct 7, 2026) — matches globals.css green palette + themeColor.
  courtDark: "#1E3932",
  court: "#006241",
  courtLight: "#00754A",
  mint: "#86efac",
  line: "rgba(255, 255, 255, 0.85)",
};

export function Pickleball({
  size,
  simple = false,
}: {
  size: number;
  simple?: boolean;
}) {
  // JJQR - AI (Oct 7, 2026)
  const holes = simple ? SIMPLE_HOLES : DETAILED_HOLES;
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#d4f02f",
        backgroundImage:
          "radial-gradient(circle at 35% 30%, #f7ffc2 0%, #dcf53f 32%, #b7d81e 72%, #8fb012 100%)",
        boxShadow: simple ? "none" : `0 ${Math.round(size * 0.05)}px ${Math.round(size * 0.1)}px rgba(0,0,0,0.28)`,
      }}
    >
      {holes.map((h, i) => {
        const d = Math.max(2, Math.round(h.d * size));
        return (
          <div
            key={i}
            style={{
              display: "flex",
              position: "absolute",
              left: Math.round(h.x * size - d / 2),
              top: Math.round(h.y * size - d / 2),
              width: d,
              height: d,
              borderRadius: "50%",
              backgroundColor: "#6f8c0c",
              backgroundImage:
                "radial-gradient(circle at 60% 65%, #9cbc1c 0%, #7a990f 45%, #556d06 100%)",
            }}
          />
        );
      })}
    </div>
  );
}
