export function formatDate(
  date: Date,
  timezone?: string,
): Record<string, string> {
  const targetDate = timezone
    ? new Date(date.toLocaleString("en-US", { timeZone: timezone }))
    : date;

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const hour = targetDate.getHours();
  const minute = targetDate.getMinutes();
  const second = targetDate.getSeconds();

  // ISO week number calculation
  const yearStart = new Date(year, 0, 1);
  const dayOfYear = Math.floor(
    (targetDate.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000),
  ) + 1;
  const week = Math.ceil(dayOfYear / 7);

  return {
    year: String(year),
    month: String(month).padStart(2, "0"),
    day: String(day).padStart(2, "0"),
    hour: String(hour).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
    second: String(second).padStart(2, "0"),
    week: String(week).padStart(2, "0"),
  };
}

export function resolvePath(
  pathTemplate: string,
  date: Date,
  timezone?: string,
): string {
  const dateValues = formatDate(date, timezone);

  let result = pathTemplate;
  for (const [key, value] of Object.entries(dateValues)) {
    result = result.replace(new RegExp(`<${key}>`, "g"), value);
  }

  return result;
}
