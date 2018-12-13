const http = require("http");
const port = process.env.HEALTH_CHECK_PORT || 9000;

const init = function(controller) {
  logger.debug("Setting up health check");
  const version = controller.version();
  const userAgent = controller.my_user_agent;
  let isConnected = false;

  controller.on("rtm_open", function() {
    logger.info("Slack connection opened");
    isConnected = true;
  });

  controller.on("rtm_close", function() {
    logger.info("Slack connection closed");
    isConnected = false;
  });

  controller.on("rtm_reconnect_failed", function() {
    logger.error("Reconnection failed");
    isConnected = false;
  });

  const requestHandler = function(request, response) {
    const responseCode = isConnected ? 200 : 503;
    logger.debug("Checking health", { isConnected, version, userAgent });
    response.writeHead(responseCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ isConnected, version, userAgent }));
  };

  return http.createServer(requestHandler).listen(port, function(err) {
    if (err) {
      logger.error("Error listening to port", { err, port });
      throw err;
    }
  });
};

module.exports = init;
