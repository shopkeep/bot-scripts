const fs = require("fs");
const path = require("path");

const matchAll = function(regex, text) {
  const matches = [];
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) matches.push(match);
  return matches;
};

module.exports = function(appDirectory, customEmojis) {
  const emojis = Object.assign(
    {
      help: ":information_source:",
      ping: ":bellhop_bell:",
      unknown: ":point_right:"
    },
    customEmojis
  );

  return new Promise(function(resolve, reject) {
    fs.readFile(path.resolve(appDirectory, "./README.md"), "utf8", function(
      err,
      data
    ) {
      if (err) return reject(err);

      const matchCommandHelp = /## Commands[\s\S]+(?:\s###\s[^#]+)+\s(?:##|---)\s/i;
      const commandGrouping = matchCommandHelp.exec(data);
      if (commandGrouping === null)
        return reject(new Error("Incompatible readme structure"));

      const commandHelp = commandGrouping[0];
      const matches = matchAll(/###\s([^#]+)/gi, commandHelp);

      const commandMapping = matches.reduce(function(mapping, matched) {
        const command = matched[1]
          .replace("---", "")
          .trim()
          .split("\n");

        return Object.assign({}, mapping, {
          [command[0]]: command
            .slice(1, command.length)
            .join("\n")
            .replace(/^\s+|\s+$/g, "")
        });
      }, {});

      const commandsHelp = Object.keys(commandMapping)
        .reduce(function(message, command) {
          const matchingKey = Object.keys(emojis).find(key =>
            command.startsWith(key)
          );

          message.push(
            `${emojis[matchingKey] || emojis.unknown} _*${command}*_\n${
              commandMapping[command]
            }`
          );
          return message;
        }, [])
        .join("\n\n");

      const helpMessage =
        "Here's a list of available commands " +
        `:information_desk_person: \n\n${commandsHelp}`;
      return resolve(helpMessage);
    });
  });
};
