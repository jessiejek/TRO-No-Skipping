export const event = {
  brandName: "TRO: No Skipping",
  celebrant: "Rizza Amor L. Caguco",
  celebrantShort: "Amor",
  partyDate: "Saturday, October 24, 2026",
  partyTime: "4:00 PM – 7:00 PM",
  /** ISO for countdown / calendar helpers */
  partyStartsAt: "2026-10-24T16:00:00+08:00",
  partyEndsAt: "2026-10-24T19:00:00+08:00",
  venue: "Prospin Sports Center, 555 Kamuning Street Juna Subdivision, Davao City, Philippines, 8000",
  activity: "Pickleball birthday party",
  bring: "Just yourself / A food to share / Paddles if you have them",
  headline: "Amor's birthday on the court.",
  subcopy:
    "You're invited to play pickleball, enjoy snacks, and share good company! Come fuel the fun on the court or chill on the sidelines. Zero pressure, just pure good times!",
} as const;

export type EventConfig = typeof event;
