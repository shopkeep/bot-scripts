process.on("unhandledRejection", function(err) {
  throw err;
});

const path = require("path");
const jest = require("jest");
const { getBotDirectory, getArgs } = require("../utils");

const botDirectory = getBotDirectory();
const args = getArgs();
const mockLogger = path.resolve(__dirname, "./mock-logger.js");
jest.run(
  [botDirectory].concat(
    args,
    "--env",
    "node",
    "--setupFilesAfterEnv",
    mockLogger
  )
);
