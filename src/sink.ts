import type { LogRecord } from "@logtape/logtape";
import type {
  DateRotatingFileSink,
  DateRotatingFileSinkOptions,
} from "./types.ts";
import { resolvePath } from "./date-formatter.ts";
import { createFileWriter, type FileWriter } from "./runtime.ts";

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
  private fileWriter: FileWriter | null = null;
  private buffer = "";
  private currentFilePath = "";
  private flushTimer: number | null = null;
  private disposed = false;
  private initPromise: Promise<void>;

  constructor(pathTemplate: string, options: DateRotatingFileSinkOptions = {}) {
    this.pathTemplate = pathTemplate;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.initPromise = this.init();
  }

  private async init(): Promise<void> {
    this.fileWriter = await createFileWriter();

    if (this.options.flushInterval > 0) {
      this.flushTimer = setInterval(() => {
        if (this.buffer.length > 0) {
          this.flush().catch(() => {
            // Ignore flush errors in background timer
          });
        }
      }, this.options.flushInterval);
    }
  }

  emit = (record: LogRecord): void => {
    if (this.disposed) return;

    // Ensure initialization is complete before processing
    this.initPromise.then(async () => {
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
          await this.flush().catch(() => {
            // Handle flush error silently for now
          });
        }
        this.currentFilePath = newFilePath;
      }

      const formattedRecord = this.options.formatter(record);
      this.buffer += formattedRecord;

      if (this.buffer.length >= this.options.bufferSize) {
        await this.flush().catch(() => {
          // Handle flush error silently for now
        });
      }
    }).catch(() => {
      // Handle initialization error silently
    });
  };

  private async flush(): Promise<void> {
    if (!this.fileWriter || this.buffer.length === 0) return;

    const content = this.buffer;
    this.buffer = "";

    try {
      // Ensure directory exists
      const dirPath = this.currentFilePath.substring(
        0,
        this.currentFilePath.lastIndexOf("/"),
      );
      if (dirPath) {
        await this.fileWriter.ensureDir(dirPath);
      }

      await this.fileWriter.append(this.currentFilePath, content);
    } catch (error) {
      // Restore buffer on error
      this.buffer = content + this.buffer;
      throw error;
    }
  }

  [Symbol.dispose](): void {
    this.disposed = true;

    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
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

export function getDateRotatingFileSink(
  pathTemplate: string,
  options?: DateRotatingFileSinkOptions,
): DateRotatingFileSink {
  const impl = new DateRotatingFileSinkImpl(pathTemplate, options);
  const sinkFunction = impl.emit.bind(impl) as DateRotatingFileSink;

  // Add dispose method to the function
  (sinkFunction as any)[Symbol.dispose] = () => impl[Symbol.dispose]();

  return sinkFunction;
}
