# LogTape Date Rotating Sink Examples

This directory contains practical examples demonstrating how to use the LogTape Date Rotating Sink in real-world scenarios.

## Examples Overview

### 1. Basic Usage (`basic-usage.ts`)
A simple example showing daily log rotation with default settings.

**Features:**
- Daily rotation pattern: `app-YYYY-MM-DD.log`
- Default formatter
- Basic logging operations

**Run:**
```bash
deno task dev
```

### 2. Web Server Logging (`web-server.ts`)
Demonstrates logging for a high-volume web server with different rotation strategies.

**Features:**
- Hourly rotation for access logs: `access-YYYY-MM-DD-HH.log`
- Daily rotation for error logs: `error-YYYY-MM-DD.log`
- Custom formatters for different log types
- Buffering and flush configuration

**Run:**
```bash
deno task web-server
```

### 3. Custom Formatters (`custom-formatter.ts`)
Shows how to implement different log formats for various environments.

**Features:**
- JSON formatter for production logs
- Human-readable formatter for development
- Weekly rotation for audit logs: `audit-YYYY-WWW.log`
- Multiple output formats

**Run:**
```bash
deno task custom-formatter
```

### 4. Multiple Sinks (`multiple-sinks.ts`)
Advanced example with multiple sinks for different purposes.

**Features:**
- Console + file output
- Minute-based rotation: `monitor-YYYYMMDD-HHMM.log`
- Nested directory structure: `security/YYYY/MM/security-DD.log`
- Performance logs with hourly rotation
- Different loggers for different concerns

**Run:**
```bash
deno task multiple-sinks
```

## File Naming Patterns

The date rotating sink supports various placeholder patterns:

- `<year>` → 2025
- `<month>` → 01
- `<day>` → 19
- `<hour>` → 14
- `<minute>` → 30
- `<second>` → 45
- `<week>` → 03 (ISO week number)

## Configuration Options

### DateRotatingFileSinkOptions

```typescript
{
  formatter?: (record: LogRecord) => string;  // Custom log formatter
  bufferSize?: number;                        // Buffer size (default: 8192)
  flushInterval?: number;                     // Flush interval in ms (default: 5000)
  nonBlocking?: boolean;                      // Non-blocking mode (default: false)
  timezone?: string;                          // Timezone for date formatting
}
```

## Common Patterns

### Daily Rotation
```typescript
getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log")
```

### Hourly Rotation
```typescript
getDateRotatingFileSink("logs/app-<year>-<month>-<day>-<hour>.log")
```

### Weekly Rotation
```typescript
getDateRotatingFileSink("logs/app-<year>-W<week>.log")
```

### Nested Directories
```typescript
getDateRotatingFileSink("logs/<year>/<month>/app-<day>.log")
```

### High-Frequency Logging
```typescript
getDateRotatingFileSink("logs/detailed-<year><month><day>-<hour><minute>.log")
```

## Running Examples

All examples can be run independently:

```bash
# Run all examples
deno task dev
deno task web-server
deno task custom-formatter
deno task multiple-sinks

# Or run directly
deno run --allow-read --allow-write basic-usage.ts
```

## Generated Log Files

After running the examples, you'll find various log files in the `logs/` directory demonstrating different rotation patterns and formatting styles.

## Tips

1. **Choose appropriate rotation intervals** based on log volume
2. **Use custom formatters** for structured logging (JSON, CSV, etc.)
3. **Configure buffering** for high-volume applications
4. **Separate concerns** with different sinks for different log types
5. **Consider directory structure** for easier log management