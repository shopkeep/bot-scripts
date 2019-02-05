const path = require("path");
const {
  getBotDirectory,
  getArgs,
  startsWithPath,
  setupScript
} = require("../shared");

const execute = setupScript("eslint");
const botDirectory = getBotDirectory();
const args = getArgs();
const lintingFiles = path.resolve(botDirectory, "./src");
const eslintConfig = path.resolve(__dirname, "./eslintrc.json");

const cwd = startsWithPath(args) ? args.shift() : lintingFiles;
execute([cwd, "--config", eslintConfig].concat(args));
