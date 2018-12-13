const setupCommands = require("./commands");

const customEmojis = {
  "run aperture test protocol": ":robot_face:"
};

const statusData = {
  cakeTruthfulness: process.env.CAKE_IS_A_LIE
};

const botname = "glados";

module.exports = function(setupBot) {
  logger.debug("Setting up clients");
  const { bot, listen } = setupBot({ botname, customEmojis, statusData });
  setupCommands({ bot, listen });
};
