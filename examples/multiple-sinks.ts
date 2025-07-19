import { configure, getLogger, getConsoleSink } from "@logtape/logtape";
import { getDateRotatingFileSink } from "@logtape/date-rotating-file";

// Configure multiple sinks for different purposes
await configure({
  sinks: {
    // Console for immediate feedback
    console: getConsoleSink(),
    
    // Daily application logs
    app: getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log", {
      formatter: (record) => {
        const timestamp = new Date(record.timestamp).toISOString();
        const message = Array.isArray(record.message) ? record.message.join(" ") : record.message;
        return `${timestamp} [${record.level.toUpperCase()}] ${record.category.join(".")} - ${message}\n`;
      },
    }),
    
    // Minute-based logs for high-frequency monitoring
    monitoring: getDateRotatingFileSink("logs/monitor-<year><month><day>-<hour><minute>.log", {
      formatter: (record) => {
        const timestamp = new Date(record.timestamp).toISOString();
        const message = Array.isArray(record.message) ? record.message.join(" ") : record.message;
        return `${timestamp},${record.level},${message},${JSON.stringify(record.properties)}\n`;
      },
      bufferSize: 512, // Small buffer for frequent flushes
      flushInterval: 500, // Flush every 500ms
    }),
    
    // Security events with daily rotation
    security: getDateRotatingFileSink("logs/security/<year>/<month>/security-<day>.log", {
      formatter: (record) => {
        const timestamp = new Date(record.timestamp).toISOString();
        const message = Array.isArray(record.message) ? record.message.join(" ") : record.message;
        return `[SECURITY] ${timestamp} | ${message} | Context: ${JSON.stringify(record.properties)}\n`;
      },
    }),
    
    // Performance metrics with hourly rotation
    performance: getDateRotatingFileSink("logs/perf/perf-<year>-<month>-<day>-<hour>h.log", {
      formatter: (record) => {
        const message = Array.isArray(record.message) ? record.message.join(" ") : record.message;
        return `${record.timestamp},${message},${record.properties.duration || 0},${record.properties.memory || 0}\n`;
      },
    }),
  },
  filters: {},
  loggers: [
    {
      category: ["app"],
      level: "info",
      sinks: ["console", "app"],
    },
    {
      category: ["monitor"],
      level: "debug",
      sinks: ["monitoring"],
    },
    {
      category: ["security"],
      level: "warn",
      sinks: ["console", "security"],
    },
    {
      category: ["performance"],
      level: "info", 
      sinks: ["performance"],
    },
  ],
});

const appLogger = getLogger(["app"]);
const monitorLogger = getLogger(["monitor"]);
const securityLogger = getLogger(["security"]);
const perfLogger = getLogger(["performance"]);

console.log("🔄 Starting multiple sinks example...");

// Application lifecycle
appLogger.info("Application started", { version: "1.0.0", environment: "production" });

// Monitoring loop
for (let i = 0; i < 5; i++) {
  monitorLogger.debug("System health check", {
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 8000),
    diskSpace: Math.floor(Math.random() * 1000),
  });
  
  await new Promise(resolve => setTimeout(resolve, 100));
}

// Security events
securityLogger.warn("Failed login attempt", {
  username: "admin",
  ip: "192.168.1.100",
  userAgent: "curl/7.68.0",
  attempt: 1,
});

securityLogger.warn("Multiple failed login attempts", {
  username: "admin", 
  ip: "192.168.1.100",
  attempts: 5,
  blocked: true,
});

// Performance metrics
const operations = ["database_query", "api_call", "file_processing", "image_resize"];

for (let i = 0; i < 8; i++) {
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const duration = Math.floor(Math.random() * 1000) + 50;
  const memory = Math.floor(Math.random() * 512) + 100;
  
  perfLogger.info(`Operation completed: ${operation}`, {
    operation,
    duration,
    memory,
    success: Math.random() > 0.1,
  });
  
  appLogger.info(`Processed ${operation}`, { duration, status: "completed" });
  
  await new Promise(resolve => setTimeout(resolve, 200));
}

// More monitoring data
for (let i = 0; i < 10; i++) {
  monitorLogger.debug("Resource usage", {
    timestamp: Date.now(),
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 8000),
    connections: Math.floor(Math.random() * 50),
  });
  
  await new Promise(resolve => setTimeout(resolve, 50));
}

appLogger.info("Application shutdown initiated");
appLogger.info("All processes completed successfully");

console.log("✅ Multiple sinks example completed!");
console.log("📁 Check the various log directories:");
console.log("   📂 logs/");
console.log("      📄 app-YYYY-MM-DD.log (daily app logs)");
console.log("      📄 monitor-YYYYMMDD-HHMM.log (minute-based monitoring)");
console.log("      📂 security/YYYY/MM/");
console.log("         📄 security-DD.log (daily security logs)");
console.log("      📂 perf/");
console.log("         📄 perf-YYYY-MM-DD-HHh.log (hourly performance logs)");