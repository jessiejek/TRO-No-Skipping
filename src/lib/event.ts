export const event = {
  brandName: "TRO: No Skipping",
  celebrant: "Rizza Amor L. Caguco",
  celebrantShort: "Rizza",
  birthday: "October 20, 1996",
  partyDate: "Saturday, October 24, 2026",
  partyTime: "4:00 PM – 7:00 PM",
  /** ISO for countdown / calendar helpers */
  partyStartsAt: "2026-10-24T16:00:00+08:00",
  partyEndsAt: "2026-10-24T19:00:00+08:00",
  venue: "Prospin Davao",
  activity: "Pickleball birthday party",
  headline: "You've been served.",
  subcopy:
    "Court is in session at the pickleball court. Appearance is mandatory—unless you file a witty excuse.",
  cta: "Submit your RSVP (no continuances)",
} as const;

export type EventConfig = typeof event;
