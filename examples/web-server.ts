import { configure, getLogger } from "@logtape/logtape";
import { getDateRotatingFileSink } from "@logtape/date-rotating-file";

// Configure LogTape with hourly rotation for a web server
await configure({
  sinks: {
    // Hourly rotation for high-volume web server logs
    access: getDateRotatingFileSink("logs/access-<year>-<month>-<day>-<hour>.log", {
      formatter: (record) => {
        const timestamp = new Date(record.timestamp).toISOString();
        const message = Array.isArray(record.message) ? record.message.join(' ') : record.message;
        const props = JSON.stringify(record.properties);
        return `${timestamp} [${record.level.toUpperCase()}] ${message} ${props}\n`;
      },
      bufferSize: 4096,
      flushInterval: 1000, // Flush every second for real-time logging
    }),
    
    // Daily rotation for application errors
    error: getDateRotatingFileSink("logs/error-<year>-<month>-<day>.log", {
      formatter: (record) => {
        const timestamp = new Date(record.timestamp).toISOString();
        const message = Array.isArray(record.message) ? record.message.join(' ') : record.message;
        return `${timestamp} [ERROR] ${message}\n  Properties: ${JSON.stringify(record.properties, null, 2)}\n\n`;
      },
    }),
  },
  filters: {},
  loggers: [
    {
      category: ["webserver", "access"],
      level: "info",
      sinks: ["access"],
    },
    {
      category: ["webserver", "error"],
      level: "error", 
      sinks: ["error"],
    },
  ],
});

const accessLogger = getLogger(["webserver", "access"]);
const errorLogger = getLogger(["webserver", "error"]);

console.log("🌐 Starting web server logging example...");

// Simulate web server requests
const users = ["alice", "bob", "charlie", "diana"];
const endpoints = ["/", "/api/users", "/api/products", "/api/orders", "/dashboard"];
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
];

for (let i = 1; i <= 20; i++) {
  const user = users[Math.floor(Math.random() * users.length)];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  const statusCode = Math.random() > 0.9 ? 500 : (Math.random() > 0.1 ? 200 : 404);
  const responseTime = Math.floor(Math.random() * 500) + 50;
  
  // Log access request
  accessLogger.info("HTTP Request", {
    method: "GET",
    url: endpoint,
    statusCode,
    responseTime,
    userAgent,
    user,
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  });
  
  // Log errors for 5xx status codes
  if (statusCode >= 500) {
    errorLogger.error("Internal server error", {
      endpoint,
      user,
      statusCode,
      error: "Database connection timeout",
      stack: "Error: Database connection timeout\n    at DatabaseConnection.query(...)\n    at UserService.findById(...)",
    });
  }
  
  // Simulate request processing time
  await new Promise(resolve => setTimeout(resolve, 100));
}

console.log("✅ Web server logging example completed!");
console.log("📁 Check the 'logs/' directory for generated files:");
console.log("   - access-YYYY-MM-DD-HH.log (hourly rotation)");
console.log("   - error-YYYY-MM-DD.log (daily rotation)");