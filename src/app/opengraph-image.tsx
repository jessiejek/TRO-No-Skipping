// JJQR - AI (Oct 7, 2026)
import { event } from "@/lib/event";
import { renderShareCard } from "@/lib/share-card";

// JJQR - AI (Oct 7, 2026)
export const alt = `${event.celebrantShort}'s Pickleball Birthday · ${event.partyDate}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// JJQR - AI (Oct 7, 2026)
export default function OpengraphImage() {
  return renderShareCard();
}
