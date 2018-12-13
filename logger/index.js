const logger = require("bristol");

const levels = [
  "emergency",
  "alert",
  "critical",
  "error",
  "warning",
  "notice",
  "info",
  "debug"
];

const loggingLevel = process.env.LOGGING_LEVEL || "info";

const getBaseLogger = function() {
  logger.setSeverities(levels);
  return logger;
};

const setupLogger = function() {
  getBaseLogger();

  logger
    .addTarget("console")
    .withLowestSeverity(loggingLevel)
    .withFormatter("human");

  return logger;
};

module.exports = { getBaseLogger, setupLogger };
