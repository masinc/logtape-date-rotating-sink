# LogTape Date Rotating Sink

A cross-runtime date-based log file rotation sink for [LogTape](https://logtape.org/). Supports Deno, Node.js, and Bun with automatic file rotation based on date/time patterns.

## Features

- 📅 **Date-based rotation** - Automatic file rotation using date/time placeholders
- 🔄 **Cross-runtime support** - Works on Deno, Node.js, and Bun
- 🚀 **High performance** - Built-in buffering and configurable flush intervals
- 🎯 **Flexible patterns** - Support for year, month, day, hour, minute, second, and week placeholders
- 🧹 **Resource cleanup** - Implements `Symbol.dispose` for automatic cleanup
- 📁 **Directory creation** - Automatically creates nested directories

## Installation

```bash
# Deno
deno add jsr:@masinc/logtape-date-rotating-sink

# Node.js/npm
npx jsr add @masinc/logtape-date-rotating-sink

# Bun
bunx jsr add @masinc/logtape-date-rotating-sink
```

## Quick Start

```typescript
import { configure, getLogger } from "@logtape/logtape";
import { getDateRotatingFileSink } from "@masinc/logtape-date-rotating-sink";

await configure({
  sinks: {
    file: getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log"),
  },
  loggers: [
    {
      category: ["myapp"],
      sinks: ["file"],
    },
  ],
});

const logger = getLogger(["myapp"]);
logger.info("Hello, world!");
// Creates: logs/app-2025-01-19.log
```

## Date Placeholders

The following placeholders are supported in file path templates:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `<year>`    | 4-digit year | `2025` |
| `<month>`   | 2-digit month (01-12) | `01` |
| `<day>`     | 2-digit day (01-31) | `19` |
| `<hour>`    | 2-digit hour (00-23) | `14` |
| `<minute>`  | 2-digit minute (00-59) | `30` |
| `<second>`  | 2-digit second (00-59) | `45` |
| `<week>`    | 2-digit week number (01-53) | `03` |

## Configuration Options

```typescript
interface DateRotatingFileSinkOptions {
  formatter?: (record: LogRecord) => string;
  bufferSize?: number;        // Default: 8192 bytes
  flushInterval?: number;     // Default: 5000ms
  nonBlocking?: boolean;      // Default: false (unused)
  timezone?: string;          // Default: system timezone
}
```

## Examples

### Daily Rotation

```typescript
// Creates files like: app-2025-01-19.log, app-2025-01-20.log
getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log")
```

### Hourly Rotation

```typescript
// Creates files like: app-2025-01-19-14.log, app-2025-01-19-15.log
getDateRotatingFileSink("logs/app-<year>-<month>-<day>-<hour>.log")
```

### Weekly Rotation with Nested Directories

```typescript
// Creates files like: logs/2025/01/week-03.log
getDateRotatingFileSink("logs/<year>/<month>/week-<week>.log")
```

### Custom Formatter

```typescript
import type { LogRecord } from "@logtape/logtape";

const jsonFormatter = (record: LogRecord) => {
  return JSON.stringify({
    timestamp: new Date(record.timestamp).toISOString(),
    level: record.level,
    message: Array.isArray(record.message) ? record.message.join(" ") : record.message,
    properties: record.properties,
  }) + "\n";
};

getDateRotatingFileSink("logs/app-<year>-<month>-<day>.json", {
  formatter: jsonFormatter,
  bufferSize: 4096,
  flushInterval: 1000,
})
```

### Timezone Support

```typescript
// Log files in Tokyo timezone
getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log", {
  timezone: "Asia/Tokyo"
})
```

## Resource Management

The sink implements `Symbol.dispose` for automatic cleanup:

```typescript
// Automatic cleanup when using statement ends
using sink = getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log");

// Manual cleanup
const sink = getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log");
sink[Symbol.dispose](); // Flushes buffer and clears timers
```

## File Rotation Behavior

- **Automatic rotation**: Files rotate automatically when the resolved path changes
- **Buffer flushing**: Buffers are automatically flushed during rotation
- **Directory creation**: Parent directories are created automatically
- **Error handling**: Failed writes restore the buffer for retry

## Cross-Runtime Compatibility

This package uses `node:fs/promises` directly, which works across all supported runtimes:

- **Deno**: Native support for Node.js modules
- **Node.js**: Standard fs/promises module
- **Bun**: Node.js compatibility layer

No runtime detection or polyfills required.

## Performance

- **Buffered writes**: Configurable buffer size (default: 8KB)
- **Periodic flushing**: Automatic buffer flushing (default: 5s)
- **Efficient rotation**: Minimal overhead during file rotation

## Examples

Check the [`examples/`](./examples/) directory for complete usage examples:

- [Basic Usage](./examples/basic-usage.ts) - Simple daily rotation
- [Custom Formatter](./examples/custom-formatter.ts) - JSON and custom formats
- [Multiple Sinks](./examples/multiple-sinks.ts) - Different rotation patterns
- [Web Server](./examples/web-server.ts) - High-volume logging

Run examples:

```bash
cd examples
deno task dev           # Basic usage
deno task web-server    # Web server logging
deno task custom-formatter
deno task multiple-sinks
```

## Development

```bash
# Run tests
deno task test

# Watch tests
deno task dev

# Type check
deno check

# Format code
deno fmt

# Lint code
deno lint
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.