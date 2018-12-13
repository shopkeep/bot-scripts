const fs = require("fs");

module.exports = {
  getArgs: () => process.argv.slice(2),
  getBotDirectory: () => fs.realpathSync(process.cwd())
};
