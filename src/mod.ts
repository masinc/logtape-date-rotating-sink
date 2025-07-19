/**
 * @fileoverview LogTape Date Rotating Sink - A cross-runtime date-based log file rotation sink
 * 
 * This module provides a LogTape sink that automatically rotates log files based on date/time patterns.
 * It supports Deno, Node.js, and Bun with configurable buffering and flexible date placeholders.
 * 
 * @example
 * ```typescript
 * import { configure, getLogger } from "@logtape/logtape";
 * import { getDateRotatingFileSink } from "@masinc/logtape-date-rotating-sink";
 * 
 * await configure({
 *   sinks: {
 *     file: getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log")
 *   },
 *   loggers: [{ category: ["app"], sinks: ["file"] }]
 * });
 * 
 * const logger = getLogger(["app"]);
 * logger.info("Hello, world!"); // Creates logs/app-2025-01-19.log
 * ```
 */

export { getDateRotatingFileSink } from "./sink.ts";
export type {
  DateRotatingFileSink,
  DateRotatingFileSinkOptions,
} from "./types.ts";
