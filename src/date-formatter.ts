/**
 * Formats a date into component strings for use in file path templates.
 * 
 * @param date - The date to format
 * @param timezone - Optional timezone (e.g., "Asia/Tokyo", "UTC")
 * @returns Object containing formatted date components with zero-padding
 * 
 * @example
 * ```typescript
 * const components = formatDate(new Date('2025-01-19T14:30:45Z'));
 * // Returns: { year: '2025', month: '01', day: '19', hour: '14', minute: '30', second: '45', week: '03' }
 * ```
 */
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

/**
 * Resolves a file path template by replacing date placeholders with actual values.
 * 
 * @param pathTemplate - Template string with placeholders like `<year>`, `<month>`, etc.
 * @param date - The date to use for placeholder replacement
 * @param timezone - Optional timezone for date formatting
 * @returns Resolved file path with placeholders replaced
 * 
 * @example
 * ```typescript
 * const path = resolvePath("logs/app-<year>-<month>-<day>.log", new Date('2025-01-19'));
 * // Returns: "logs/app-2025-01-19.log"
 * 
 * const hourlyPath = resolvePath("logs/<year>/<month>/app-<day>-<hour>.log", new Date('2025-01-19T14:30:00Z'));
 * // Returns: "logs/2025/01/app-19-14.log"
 * ```
 */
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
