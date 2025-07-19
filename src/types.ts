import type { LogRecord, Sink } from "@logtape/logtape";

/**
 * Configuration options for the date rotating file sink.
 */
export interface DateRotatingFileSinkOptions {
  /**
   * Custom formatter function to format log records.
   * @param record - The log record to format
   * @returns Formatted string to write to the file
   */
  formatter?: (record: LogRecord) => string;
  
  /**
   * Buffer size in bytes before flushing to disk.
   * @default 8192
   */
  bufferSize?: number;
  
  /**
   * Interval in milliseconds to automatically flush the buffer.
   * Set to 0 to disable automatic flushing.
   * @default 5000
   */
  flushInterval?: number;
  
  /**
   * Whether to use non-blocking writes (currently unused).
   * @default false
   */
  nonBlocking?: boolean;
  
  /**
   * Timezone for date formatting (e.g., "Asia/Tokyo", "UTC").
   * Uses system timezone if not specified.
   */
  timezone?: string;
}

/**
 * A LogTape sink that rotates log files based on date patterns.
 * Implements both Sink and Disposable interfaces for resource management.
 */
export type DateRotatingFileSink = Sink & Disposable;
