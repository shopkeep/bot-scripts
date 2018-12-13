process.on("unhandledRejection", function(err) {
  throw err;
});

const path = require("path");
const { getBotDirectory } = require("../utils");
const botDirectory = getBotDirectory();

const botPath = path.resolve(botDirectory, "./src/index.js");
const envPath = path.resolve(botDirectory, "./.env");
require("dotenv").config({ path: envPath });

const { setupLogger } = require("../../logger");
global.logger = setupLogger();
logger.debug("Booting bot");

const healthCheck = require("./health-check");
const getBot = require("./botkit");

require(botPath)(function(options = {}) {
  const botUtils = getBot(botDirectory, options);
  healthCheck(botUtils.bot);
  return botUtils;
});
