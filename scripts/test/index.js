const path = require("path");
const {
  getBotDirectory,
  getArgs,
  startsWithPath,
  setupScript
} = require("../shared");

const execute = setupScript("jest");
const botDirectory = getBotDirectory();
const args = getArgs();
const mockLogger = path.resolve(__dirname, "./mock-logger.js");

const cwd = startsWithPath(args) ? args.shift() : botDirectory;
execute(
  [cwd, "--env", "node", "--setupFilesAfterEnv", mockLogger].concat(args)
);
