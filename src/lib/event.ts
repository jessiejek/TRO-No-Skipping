export const event = {
  brandName: "TRO: No Skipping",
  celebrant: "Rizza Amor L. Caguco",
  celebrantShort: "Amor",
  birthday: "October 20, 1996",
  partyDate: "Saturday, October 24, 2026",
  partyTime: "4:00 PM – 7:00 PM",
  /** ISO for countdown / calendar helpers */
  partyStartsAt: "2026-10-24T16:00:00+08:00",
  partyEndsAt: "2026-10-24T19:00:00+08:00",
  venue: "Prospin Davao",
  activity: "Pickleball birthday party",
  headline: "Amor's birthday on the court.",
  subcopy:
    "You're invited for pickleball, snacks, and good company! Come fuel the fun on the court or chill on the sidelines. Zero pressure, just pure good times!",
  cta: "RSVP below",
  bringFood:
    "You're welcome to bring food to share — snacks, drinks, or whatever your crew loves.",
} as const;

export type EventConfig = typeof event;
