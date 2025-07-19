import { assertEquals, assertExists } from "@std/assert";
import type { LogRecord } from "@logtape/logtape";
import { getDateRotatingFileSink } from "./sink.ts";

// Create a mock LogRecord for testing
function createTestLogRecord(
  timestamp: Date = new Date(),
  level: string = "INFO",
  message: string = "test message",
): LogRecord {
  return {
    timestamp: timestamp.getTime(),
    level,
    message: [message], // message is an array
    rawMessage: message,
    category: ["test"],
    properties: {},
  } as LogRecord;
}

Deno.test("getDateRotatingFileSink should create sink function", () => {
  const sink = getDateRotatingFileSink("test-<year>-<month>-<day>.log", {
    flushInterval: 0, // Disable timer to prevent leaks in this test
  });
  assertEquals(typeof sink, "function");

  // Clean up to prevent resource leaks
  using _disposable = sink;
});

Deno.test("sink should write to correct file based on date", async () => {
  const testDir = "./test-output/sink-test";
  const sink = getDateRotatingFileSink(
    `${testDir}/app-<year>-<month>-<day>.log`,
    {
      flushInterval: 0, // Disable auto-flush for testing
      bufferSize: 0, // No buffering for immediate write
    },
  );

  try {
    const record = createTestLogRecord(
      new Date(2025, 0, 19, 14, 30, 45),
      "INFO",
      "test message",
    );

    sink(record);

    // Wait a bit for async file operations
    await new Promise((resolve) => setTimeout(resolve, 200));

    const expectedFile = `${testDir}/app-2025-01-19.log`;

    const content = await Deno.readTextFile(expectedFile);
    assertExists(content);
    assertEquals(content.includes("test message"), true);
    assertEquals(content.includes("[INFO]"), true);
  } finally {
    // Cleanup
    using _disposable = sink;
    try {
      await Deno.remove(testDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  }
});

Deno.test("sink should rotate files when date changes", async () => {
  const testDir = "./test-output/rotation-test";
  const sink = getDateRotatingFileSink(
    `${testDir}/app-<year>-<month>-<day>.log`,
    {
      flushInterval: 0,
      bufferSize: 1, // Force flush after each record
    },
  );

  try {
    // First day
    const record1 = createTestLogRecord(
      new Date(2025, 0, 19, 14, 30, 45),
      "INFO",
      "day 1 message",
    );
    sink(record1);

    // Wait a bit to ensure first record is processed
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Second day
    const record2 = createTestLogRecord(
      new Date(2025, 0, 20, 10, 15, 30),
      "WARN",
      "day 2 message",
    );
    sink(record2);

    // Wait for file operations
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Check both files exist
    const file1 = `${testDir}/app-2025-01-19.log`;
    const file2 = `${testDir}/app-2025-01-20.log`;

    const content1 = await Deno.readTextFile(file1);
    const content2 = await Deno.readTextFile(file2);

    assertEquals(content1.includes("day 1 message"), true);
    assertEquals(content2.includes("day 2 message"), true);
  } finally {
    // Cleanup
    using _disposable = sink;
    try {
      await Deno.remove(testDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  }
});

Deno.test("sink should use custom formatter", async () => {
  const testDir = "./test-output/formatter-test";
  const sink = getDateRotatingFileSink(
    `${testDir}/app-<year>-<month>-<day>.log`,
    {
      formatter: (record) => `CUSTOM: ${record.level} - ${record.message}\n`,
      flushInterval: 0,
      bufferSize: 0,
    },
  );

  try {
    const record = createTestLogRecord(
      new Date(2025, 0, 19, 14, 30, 45),
      "ERROR",
      "custom test",
    );

    sink(record);

    await new Promise((resolve) => setTimeout(resolve, 200));

    const content = await Deno.readTextFile(`${testDir}/app-2025-01-19.log`);
    assertEquals(content.includes("CUSTOM: ERROR - custom test"), true);
  } finally {
    using _disposable = sink;
    try {
      await Deno.remove(testDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  }
});
