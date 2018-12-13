const os = require("os");
const Botkit = require("botkit");
const packagejson = require("../../../package.json");
const outputError = require("../../../utils/output-error");
const generateListener = require("../../../utils/generate-listener");
const convertReadmeToHelp = require("./convert-readme-to-help");

let cachedHelpMessage;
const getHelpMessage = async function(appDirectory, customEmojis) {
  if (cachedHelpMessage) return cachedHelpMessage;

  cachedHelpMessage = await convertReadmeToHelp(appDirectory, customEmojis);
  return cachedHelpMessage;
};

const init = function(
  appDirectory,
  { botname = "bot", customEmojis, statusData = {} }
) {
  logger.debug("Setting up slack client");

  const controller = Botkit.slackbot({
    logger,
    scopes: ["bot"],
    stats_optout: true
  });

  controller
    .spawn({ token: process.env.SLACK_BOT_TOKEN, retry: 50 })
    .startRTM(function(err) {
      if (err) {
        logger.error("Error connecting to slack", { err });
        throw err;
      }
      logger.debug("Connected to slack");
    });

  const means = ["direct_message", "direct_mention", "mention"];
  const listen = generateListener(botname, controller, means);

  listen("ping", function(bot, message) {
    bot.reply(message, "PONG! :table_tennis_paddle_and_ball:");
  });

  listen("help", async function(bot, message) {
    try {
      const helpMessage = await getHelpMessage(appDirectory, customEmojis);
      bot.reply(message, helpMessage);
    } catch (err) {
      outputError(bot, message, err);
    }
  });

  listen("status", async function(bot, message) {
    try {
      const networkInterfaces = [].concat.apply(
        [],
        Object.values(os.networkInterfaces())
      );
      const networkData = networkInterfaces.filter(
        ({ family, internal }) => family.toLowerCase() === "ipv4" && !internal
      );
      const ipAddress =
        networkData.length > 0 ? networkData[0].address : "unknown";

      const payload = JSON.stringify(
        Object.assign(
          {
            hostname: os.hostname(),
            ipAddress,
            botScriptsVersion: packagejson.version
          },
          statusData
        ),
        null,
        4
      );
      bot.reply(message, "```\n" + payload + "\n```");
    } catch (err) {
      outputError(bot, message, err);
    }
  });

  return {
    listen,
    bot: controller
  };
};

module.exports = init;
