import type { LogRecord, Sink } from "@logtape/logtape";

export interface DateRotatingFileSinkOptions {
  formatter?: (record: LogRecord) => string;
  bufferSize?: number;
  flushInterval?: number;
  nonBlocking?: boolean;
  timezone?: string;
}

export type DateRotatingFileSink = Sink & Disposable;