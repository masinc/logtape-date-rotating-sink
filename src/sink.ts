import type { LogRecord } from "@logtape/logtape";
import type {
  DateRotatingFileSink,
  DateRotatingFileSinkOptions,
} from "./types.ts";
import { resolvePath } from "./date-formatter.ts";
// @ts-ignore: Node.js modules are available in all supported runtimes
import * as fs from "node:fs/promises";

const DEFAULT_OPTIONS: Required<DateRotatingFileSinkOptions> = {
  formatter: (record: LogRecord) =>
    `${new Date(record.timestamp).toISOString()} [${record.level}] ${
      Array.isArray(record.message) ? record.message.join(" ") : record.message
    }\n`,
  bufferSize: 8192,
  flushInterval: 5000,
  nonBlocking: false,
  timezone: "",
};

class DateRotatingFileSinkImpl {
  private pathTemplate: string;
  private options: Required<DateRotatingFileSinkOptions>;
  private buffer = "";
  private currentFilePath = "";
  private flushTimer: number | null = null;
  private disposed = false;

  constructor(pathTemplate: string, options: DateRotatingFileSinkOptions = {}) {
    this.pathTemplate = pathTemplate;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.init();
  }

  private init(): void {
    // Start the first flush timer if needed
    this.scheduleNextFlush();
  }

  private scheduleNextFlush(): void {
    if (this.options.flushInterval > 0 && !this.disposed) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = null; // Clear timer reference
        if (!this.disposed) {
          if (this.buffer.length > 0) {
            this.flush().catch(() => {
              // Ignore flush errors in background timer
            });
            // Only reschedule if there was something to flush
            this.scheduleNextFlush();
          }
          // If buffer is empty, don't reschedule - let process exit naturally
        }
      }, this.options.flushInterval);
    }
  }

  emit = (record: LogRecord): void => {
    if (this.disposed) return;

    const newFilePath = resolvePath(
      this.pathTemplate,
      new Date(record.timestamp),
      this.options.timezone || undefined,
    );

    // Set initial file path if not set
    if (!this.currentFilePath) {
      this.currentFilePath = newFilePath;
    }

    // Rotation needed
    if (newFilePath !== this.currentFilePath) {
      if (this.buffer.length > 0) {
        this.flush().catch(() => {
          // Handle flush error silently for now
        });
      }
      this.currentFilePath = newFilePath;
    }

    const formattedRecord = this.options.formatter(record);
    this.buffer += formattedRecord;

    // Restart timer if it's not running and we have flush interval
    if (this.flushTimer === null && this.options.flushInterval > 0) {
      this.scheduleNextFlush();
    }

    if (this.buffer.length >= this.options.bufferSize) {
      this.flush().catch(() => {
        // Handle flush error silently for now
      });
    } else if (this.options.flushInterval === 0) {
      // If flushInterval is 0, flush immediately
      this.flush().catch(() => {
        // Handle flush error silently for now
      });
    }
  };

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const content = this.buffer;
    this.buffer = "";

    try {
      // Ensure directory exists
      const dirPath = this.currentFilePath.substring(
        0,
        this.currentFilePath.lastIndexOf("/"),
      );
      if (dirPath) {
        await fs.mkdir(dirPath, { recursive: true });
      }

      await fs.appendFile(this.currentFilePath, content, "utf8");
    } catch (error) {
      // Restore buffer on error
      this.buffer = content + this.buffer;
      throw error;
    }
  }

  [Symbol.dispose](): void {
    this.disposed = true;

    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.buffer.length > 0) {
      // Synchronous flush attempt - this is a limitation
      // In real implementation, we might want to use a different approach
      this.flush().catch(() => {
        // Ignore errors during disposal
      });
    }
  }
}

/**
 * Creates a date rotating file sink for LogTape.
 * 
 * The sink automatically rotates log files when the resolved file path changes
 * based on the current date/time and the provided path template.
 * 
 * @param pathTemplate - File path template with date placeholders like `<year>`, `<month>`, `<day>`, etc.
 * @param options - Optional configuration for the sink
 * @returns A LogTape sink function with Symbol.dispose for resource cleanup
 * 
 * @example
 * ```typescript
 * // Daily rotation
 * const dailySink = getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log");
 * 
 * // Hourly rotation with custom buffer
 * const hourlySink = getDateRotatingFileSink("logs/app-<year>-<month>-<day>-<hour>.log", {
 *   bufferSize: 4096,
 *   flushInterval: 1000
 * });
 * 
 * // Weekly rotation with nested directories
 * const weeklySink = getDateRotatingFileSink("logs/<year>/week-<week>.log");
 * 
 * // Use with LogTape
 * await configure({
 *   sinks: {
 *     file: dailySink
 *   },
 *   loggers: [{ category: ["app"], sinks: ["file"] }]
 * });
 * ```
 */
export function getDateRotatingFileSink(
  pathTemplate: string,
  options?: DateRotatingFileSinkOptions,
): DateRotatingFileSink {
  const impl = new DateRotatingFileSinkImpl(pathTemplate, options);
  const sinkFunction = impl.emit.bind(impl) as DateRotatingFileSink;

  // Add dispose method to the function
  (sinkFunction as DateRotatingFileSink)[Symbol.dispose] = () => impl[Symbol.dispose]();

  return sinkFunction;
}
