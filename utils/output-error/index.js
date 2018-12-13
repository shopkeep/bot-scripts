const outputError = function(bot, message, err) {
  const stack = err && err.stack ? err.stack : undefined;
  logger.debug("An error occurred handling slack command", { err, stack });
  bot.reply(
    message,
    ":dizzy_face: Sorry, there was an error with your command " +
      `:exclamation: Error received:\n\`\`\`\n${err}\n\`\`\``
  );
};

module.exports = outputError;
