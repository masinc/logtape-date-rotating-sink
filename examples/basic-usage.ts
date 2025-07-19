import { configure, getLogger } from "@logtape/logtape";
import { getDateRotatingFileSink } from "@logtape/date-rotating-file";

// Configure LogTape with date rotating file sink
await configure({
  sinks: {
    // Daily rotation
    file: getDateRotatingFileSink("logs/app-<year>-<month>-<day>.log"),
  },
  filters: {},
  loggers: [
    {
      category: ["myapp"],
      level: "debug",
      sinks: ["file"],
    },
  ],
});

const logger = getLogger(["myapp"]);

// Generate some sample logs
console.log("🚀 Starting basic usage example...");

logger.info("Application started successfully");
logger.debug("Debug information for troubleshooting");
logger.warn("This is a warning message");

// Simulate some application activity
for (let i = 1; i <= 5; i++) {
  logger.info(`Processing item ${i}`, { itemId: i, status: "processing" });
  
  // Simulate some work
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (i === 3) {
    logger.error("Failed to process item", { itemId: i, error: "Network timeout" });
  } else {
    logger.info(`Successfully processed item ${i}`, { itemId: i, status: "completed" });
  }
}

logger.info("Application finished");

console.log("✅ Basic usage example completed!");
console.log("📁 Check the 'logs/' directory for the generated log file:");
console.log(`   logs/app-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}.log`);