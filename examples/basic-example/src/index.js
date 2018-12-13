// This emoji will prefix the slack command in the `help` slack command output
const customEmojis = {
  "my name is": ":wave:"
};

// This will be visible in the `status` slack command output
const statusData = {
  isExampleBot: true
};

// The bot will listen to slack commands prefixed with this; without directly
// mentioning the bot `example-bot my name is Alice` will call the slack command
const botname = "example-bot";

// Function called by bot-scripts start
module.exports = function(setupBot) {
  logger.debug("Setting up clients"); // Global `logger` object available

  // Bot instance and `listen` function provided from `setupBot`
  const { /* bot, */ listen } = setupBot({ botname, customEmojis, statusData });

  // Sets up case insensitive listener for "my name is" slack command
  // This can be called via a direct message, @ mention in a channel
  // or when it's prefixed by the `botname`
  listen("my name is (.+)", function(bot, message) {
    // Implement your slack command logic here, eg:
    // https://botkit.ai/docs/core.html#botreply
    bot.reply(message, `Hi ${message.match[1]}!`);
  });
};
