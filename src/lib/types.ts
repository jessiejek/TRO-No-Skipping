export type RsvpStatus = "yes" | "no";

export interface Rsvp {
  id: string;
  name: string;
  status: RsvpStatus;
  note?: string;
  createdAt: string;
}

export interface CreateRsvpInput {
  name: string;
  status: RsvpStatus;
  note?: string;
}
