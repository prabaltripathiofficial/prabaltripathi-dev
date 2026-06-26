export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date.length === 10 ? date + "T00:00:00" : date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Date + 24-hour time in IST (Asia/Kolkata). Updates are stored as UTC
// instants; this renders them in IST consistently for every viewer.
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} · ${time} IST`;
}
