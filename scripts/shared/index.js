const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");

const setupScript = function(tool) {
  process.on("unhandledRejection", function(err) {
    throw err;
  });

  const executable = path.resolve(
    require.resolve(tool).split(tool)[0],
    `./${tool}/bin/${tool}.js`
  );

  return function call(args) {
    const result = spawn.sync(executable, args, { stdio: "inherit" });

    if (result.error) {
      console.error(result.error); // eslint-disable-line no-console
      process.exit(1);
    }
    if (result.signal) process.exit(1);
    process.exit(result.status);
  };
};

module.exports = {
  getArgs: () => process.argv.slice(2),
  getBotDirectory: () => fs.realpathSync(process.cwd()),
  startsWithPath: args =>
    typeof args[0] === "string" &&
    args[0].trim().length > 0 &&
    !args[0].trim().startsWith("--"),
  setupScript
};
