const util = require("util");
const { outputError } = require("@shopkeep/bot-scripts/utils");
const { isMaterialEmancipationGridRequiredFor } = require("./utils");

const setupCommands = function({ listen }) {
  listen("run aperture test protocol( .*)?", function(bot, message) {
    const specificProtocol = (message.match[1] || "").toLowerCase().trim();
    logger.info("Running protocol", { specificProtocol });

    const pending = `:hourglass_flowing_sand: Implementing test protocol...`;
    bot.replyAndUpdate(message, pending, async function(replyErr, src, update) {
      const updateMessage = util.promisify(update);

      if (replyErr) {
        logger.error("Error replying to command", { err: replyErr });
        outputError(bot, message, replyErr);
        return;
      }

      const cakeTruthfulness = process.env.CAKE_IS_A_LIE;
      if (cakeTruthfulness !== "true" && cakeTruthfulness !== "false") {
        logger.error("Unknown cake truthfulness", { cakeTruthfulness });
        outputError(
          bot,
          message,
          new Error(
            "Invalid cake truthfulness definition - " + cakeTruthfulness
          )
        );
        return;
      }

      if (cakeTruthfulness === "true") {
        logger.debug("Cake is a lie");
        await updateMessage(
          ":fire::fire::fire: This is your fault. I'm going to kill you. And all the cake is gone. " +
            `You don't even care, do you <@${message.user}>? :fire::fire::fire:`
        );
        return;
      }

      if (isMaterialEmancipationGridRequiredFor(specificProtocol)) {
        logger.debug("Material emancipation grid in effect");
        await updateMessage(
          ":warning: Please be advised that a noticeable taste of blood is not part of any test protocol " +
            "but is an unintended side effect of the Aperture Science Material Emancipation Grid, which may, " +
            "in semi-rare cases, emancipate dental fillings, crowns, tooth enamel, and teeth."
        );
        return;
      }

      logger.debug("Cake is promised");
      updateMessage(
        `<@${
          message.user
        }> Cake, and grief counseling, will be available at the conclusion of the test. :cake:`
      );
    });
  });
};

module.exports = setupCommands;
