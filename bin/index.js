#!/usr/bin/env node
/*
 * Taken from react-app-rewired and modified
 * Source: https://github.com/timarney/react-app-rewired/blob/35aee6bcadafb14a5edc6281133bcdcf012f4cfd/packages/react-app-rewired/bin/index.js
 * Date: 2018-07-08
 */

/* eslint-disable no-console */
const spawn = require("cross-spawn");
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === "start" || x === "test" || x === "lint"
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case "start":
  case "test":
  case "lint": {
    const result = spawn.sync(
      "node",
      nodeArgs
        .concat(require.resolve("../scripts/" + script))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: "inherit" }
    );
    if (result.signal) {
      if (result.signal === "SIGKILL") {
        console.log(
          "The build failed because the process exited too early. " +
            "This probably means the system ran out of memory or someone called " +
            "`kill -9` on the process."
        );
      } else if (result.signal === "SIGTERM") {
        console.log(
          "The build failed because the process exited too early. " +
            "Someone might have called `kill` or `killall`, or the system could " +
            "be shutting down."
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
    console.log("Perhaps you need to update bot-scripts?");
    break;
}
