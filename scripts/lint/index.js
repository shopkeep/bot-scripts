process.on("unhandledRejection", function(err) {
  throw err;
});

const path = require("path");
const spawn = require("cross-spawn");
const { getBotDirectory, getArgs } = require("../utils");

const botDirectory = getBotDirectory();
const args = getArgs();
const lintingFiles = path.resolve(botDirectory, "./src");
const eslintConfig = path.resolve(__dirname, "./eslintrc.json");
const eslint = path.resolve(
  require.resolve("eslint").split("eslint")[0],
  "./eslint/bin/eslint.js"
);

const result = spawn.sync(
  eslint,
  [lintingFiles, "--config", eslintConfig].concat(args),
  { stdio: "inherit" }
);

if (result.error) {
  console.error(result.error); // eslint-disable-line no-console
  process.exit(1);
}
if (result.signal) process.exit(1);
process.exit(result.status);
