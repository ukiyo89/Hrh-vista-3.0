/** Event dates use India time regardless of a visitor's device timezone.
 * No session time is confirmed: this counts to the start of the event date.
 */
export const event = {
  start: "2026-11-21T00:00:00+05:30",
  end: "2026-11-23T00:00:00+05:30",
  dates: "21–22 November 2026",
  venue: "Venue to be announced",
} as const;

export function getEventCountdown(now: number) {
  const start = Date.parse(event.start);
  const end = Date.parse(event.end);
  const total = Math.max(0, Math.ceil((start - now) / 1000));
  return {
    phase: now < start ? "upcoming" : now < end ? "live" : "ended",
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
