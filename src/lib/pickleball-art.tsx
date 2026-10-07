// JJQR - AI (Oct 7, 2026)
// Shared flat pickleball artwork for next/og ImageResponse (icon, apple-icon, OG/Twitter images).

type Hole = { x: number; y: number; d: number };

// JJQR - AI (Oct 7, 2026) — hole positions as fractions of the ball diameter.
function ring(count: number, radius: number, d: number, offsetDeg = 0): Hole[] {
  return Array.from({ length: count }, (_, i) => {
    const a = ((360 / count) * i + offsetDeg) * (Math.PI / 180);
    return { x: 0.5 + radius * Math.cos(a), y: 0.5 + radius * Math.sin(a), d };
  });
}

// JJQR - AI (Oct 7, 2026) — few flat holes; chunkier layout for tiny favicons.
const DETAILED_HOLES: Hole[] = [
  { x: 0.5, y: 0.5, d: 0.1 },
  ...ring(6, 0.24, 0.1, -90),
  ...ring(8, 0.39, 0.085, -67.5),
];

const SIMPLE_HOLES: Hole[] = [
  { x: 0.5, y: 0.5, d: 0.16 },
  ...ring(5, 0.29, 0.15, -90),
];

export const courtColors = {
  // JJQR - AI (Oct 7, 2026) — matches globals.css green palette + themeColor.
  court: "#006241",
  mint: "#86efac",
  ball: "#d4f02f",
  hole: "#a3bf1a",
};

export function Pickleball({
  size,
  simple = false,
}: {
  size: number;
  simple?: boolean;
}) {
  // JJQR - AI (Oct 7, 2026) — flat: solid lime circle, solid darker holes, no shine/shadow.
  const holes = simple ? SIMPLE_HOLES : DETAILED_HOLES;
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: courtColors.ball,
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
              backgroundColor: courtColors.hole,
            }}
          />
        );
      })}
    </div>
  );
}
