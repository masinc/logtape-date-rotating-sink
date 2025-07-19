import { configure, getLogger } from "@logtape/logtape";
import { getDateRotatingFileSink } from "@logtape/date-rotating-file";

// Custom formatter that outputs JSON logs
const jsonFormatter = (record: any) => {
  const logEntry = {
    timestamp: new Date(record.timestamp).toISOString(),
    level: record.level.toUpperCase(),
    category: record.category.join("."),
    message: Array.isArray(record.message) ? record.message.join(" ") : record.message,
    properties: record.properties,
  };
  return JSON.stringify(logEntry) + "\n";
};

// Custom formatter for development (colorized and readable)
const devFormatter = (record: any) => {
  const timestamp = new Date(record.timestamp).toLocaleString();
  const level = record.level.toUpperCase().padEnd(5);
  const category = record.category.join(".").padEnd(15);
  const message = Array.isArray(record.message) ? record.message.join(" ") : record.message;
  
  let line = `${timestamp} [${level}] ${category} ${message}`;
  
  if (Object.keys(record.properties).length > 0) {
    line += ` | ${JSON.stringify(record.properties)}`;
  }
  
  return line + "\n";
};

// Configure different formatters for different environments
await configure({
  sinks: {
    // Production: JSON format for easy parsing
    production: getDateRotatingFileSink("logs/prod-<year>-<month>-<day>.log", {
      formatter: jsonFormatter,
      bufferSize: 8192,
      flushInterval: 5000,
    }),
    
    // Development: Human-readable format
    development: getDateRotatingFileSink("logs/dev-<year>-<month>-<day>.log", {
      formatter: devFormatter,
      bufferSize: 1024,
      flushInterval: 1000,
    }),
    
    // Audit: Weekly rotation with detailed formatting
    audit: getDateRotatingFileSink("logs/audit-<year>-W<week>.log", {
      formatter: (record) => {
        const timestamp = new Date(record.timestamp).toISOString();
        const message = Array.isArray(record.message) ? record.message.join(" ") : record.message;
        return `[AUDIT] ${timestamp} | ${record.category.join(".")} | ${message} | ${JSON.stringify(record.properties)}\n`;
      },
    }),
  },
  filters: {},
  loggers: [
    {
      category: ["app"],
      level: "debug",
      sinks: ["production", "development"],
    },
    {
      category: ["audit"],
      level: "info",
      sinks: ["audit"],
    },
  ],
});

const appLogger = getLogger(["app"]);
const auditLogger = getLogger(["audit"]);

console.log("🎨 Starting custom formatter example...");

// Application logs
appLogger.debug("Application initialization started");
appLogger.info("Database connection established", { host: "localhost", port: 5432 });
appLogger.warn("Deprecated API endpoint used", { endpoint: "/api/v1/users", newEndpoint: "/api/v2/users" });

// User actions for audit
const users = ["admin", "user1", "user2"];
const actions = ["login", "logout", "create_user", "delete_user", "update_profile"];

for (let i = 0; i < 10; i++) {
  const user = users[Math.floor(Math.random() * users.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  auditLogger.info(`User action: ${action}`, {
    userId: user,
    action,
    timestamp: new Date().toISOString(),
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: "Mozilla/5.0 (Example Browser)",
  });
  
  appLogger.info(`Processing ${action} for user ${user}`, { user, action });
  
  await new Promise(resolve => setTimeout(resolve, 200));
}

appLogger.error("Unexpected error occurred", { 
  error: "Database query failed",
  query: "SELECT * FROM users WHERE active = true",
  code: "DB_ERROR_001"
});

console.log("✅ Custom formatter example completed!");
console.log("📁 Check the 'logs/' directory for files with different formats:");
console.log("   - prod-YYYY-MM-DD.log (JSON format)");
console.log("   - dev-YYYY-MM-DD.log (human-readable format)");
console.log("   - audit-YYYY-WWW.log (audit format with weekly rotation)");