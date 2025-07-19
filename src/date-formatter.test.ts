import { assertEquals } from "@std/assert";
import { formatDate, resolvePath } from "./date-formatter.ts";

Deno.test("formatDate should format date correctly", () => {
  const date = new Date(2025, 0, 19, 14, 30, 45); // January 19, 2025, 14:30:45

  const result = formatDate(date);

  assertEquals(result.year, "2025");
  assertEquals(result.month, "01");
  assertEquals(result.day, "19");
  assertEquals(result.hour, "14");
  assertEquals(result.minute, "30");
  assertEquals(result.second, "45");
  assertEquals(result.week, "03");
});

Deno.test("resolvePath should replace placeholders correctly", () => {
  const date = new Date(2025, 0, 19, 14, 30, 45);

  const testCases = [
    {
      template: "logs/app-<year>-<month>-<day>.log",
      expected: "logs/app-2025-01-19.log",
    },
    {
      template: "logs/<year>/<month>/<day>/app-<hour>.log",
      expected: "logs/2025/01/19/app-14.log",
    },
    {
      template: "app-<year><month><day>-<hour><minute><second>.log",
      expected: "app-20250119-143045.log",
    },
    {
      template: "logs/weekly-<year>-W<week>.log",
      expected: "logs/weekly-2025-W03.log",
    },
  ];

  for (const { template, expected } of testCases) {
    const result = resolvePath(template, date);
    assertEquals(result, expected);
  }
});

Deno.test("resolvePath should handle multiple occurrences of same placeholder", () => {
  const date = new Date(2025, 0, 19, 14, 30, 45);

  const result = resolvePath("logs/<year>/backup-<year>-<month>.log", date);
  assertEquals(result, "logs/2025/backup-2025-01.log");
});

Deno.test("resolvePath should handle template without placeholders", () => {
  const date = new Date(2025, 0, 19, 14, 30, 45);

  const result = resolvePath("logs/static.log", date);
  assertEquals(result, "logs/static.log");
});
