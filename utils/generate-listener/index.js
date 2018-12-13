const createRegex = (regex, prefix = "^") =>
  new RegExp(`${prefix}${regex}$`, "i");

const generateListener = function(botname, controller, means) {
  return function(pattern, handler) {
    const loggedHandler = (...args) => {
      logger.debug(`Responding to "${pattern}" command`);
      handler(...args);
    };
    controller.hears(createRegex(pattern), means, loggedHandler);
    controller.hears(
      createRegex(pattern, `${botname} `),
      "ambient",
      loggedHandler
    );
  };
};

module.exports = generateListener;
