# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Testing
- `deno task test` - Run all tests with required permissions (--allow-read --allow-write)
- `deno task dev` - Run tests in watch mode
- `deno test --no-check` - Run tests without TypeScript checking (useful for debugging)
- `deno test src/sink.test.ts` - Run specific test file
- `deno check` - Type check all files

### Examples
- `cd examples && deno task dev` - Run basic usage example
- `cd examples && deno task web-server` - Run web server logging example
- `cd examples && deno task custom-formatter` - Run custom formatter example
- `cd examples && deno task multiple-sinks` - Run multiple sinks example

### Code Quality
- `deno fmt` - Format all TypeScript files
- `deno lint` - Lint all files

## Architecture Overview

This is a LogTape sink implementation that provides date-based log file rotation with cross-runtime support (Deno/Node.js/Bun).

### Core Components

**Main Implementation (`src/`):**
- `sink.ts` - Main sink implementation with `DateRotatingFileSinkImpl` class and public `getDateRotatingFileSink()` function
- `date-formatter.ts` - Date formatting logic that converts dates to file path placeholders (`<year>`, `<month>`, `<day>`, etc.)
- `types.ts` - TypeScript interfaces for `DateRotatingFileSinkOptions` and `DateRotatingFileSink`
- `mod.ts` - Public API exports

**Key Design Decisions:**
- Uses `node:fs/promises` directly for cross-runtime file operations (works in Deno, Node.js, and Bun)
- No runtime abstraction layer - keeps code simple and performant
- Supports placeholder-based file naming: `<year>`, `<month>`, `<day>`, `<hour>`, `<minute>`, `<second>`, `<week>`
- Built-in buffering and periodic flushing with automatic flush on rotation

### File Rotation Logic

The sink automatically creates new log files when the resolved file path changes based on the current date/time. For example:
- Template: `logs/app-<year>-<month>-<day>.log`
- Creates: `logs/app-2025-01-19.log`, `logs/app-2025-01-20.log`, etc.

File rotation happens in the `emit()` method when `resolvePath()` returns a different path than `currentFilePath`.

### Testing Strategy

- Unit tests for date formatting (`date-formatter.test.ts`)
- Integration tests for sink functionality (`sink.test.ts`)
- Tests create temporary files in `test-output/` (gitignored)
- All tests require `--allow-read --allow-write` permissions

### Cross-Runtime Compatibility

Uses `node:fs/promises` with `@ts-ignore` comments to work across:
- **Deno**: Native support for `node:` imports
- **Node.js**: Standard fs/promises module
- **Bun**: Node.js compatibility layer

No dynamic imports or runtime detection needed - static imports work everywhere.

### LogRecord Message Handling

LogTape's `LogRecord.message` can be either a string or an array. The default formatter handles both:
```typescript
Array.isArray(record.message) ? record.message.join(" ") : record.message
```

### Symbol.dispose Integration

The sink implements `Symbol.dispose` for resource cleanup, allowing use with `using` declarations for automatic timer cleanup and buffer flushing.