# bot-scripts
Common functionality for botkit slack bots

<p align="center">
  <img src="https://media.giphy.com/media/5yLgocwEzOGUTsT9mKs/giphy.gif" alt="Bot Scripts" height="180" width="320" />
</p>

---

## Installation

```
npm install @shopkeep/bot-scripts
```

## Quick Start

Copy an example from the `examples/` directory and use as a starting point for
your next bot project. Rename the `.env.example` file to `.env` and get the bot
set up by adding a `SLACK_BOT_TOKEN` into the `.env`.

Run `npm install` to install the dependencies and then start your bot with
`npm start`. For any further requirements, check the `README.md` file of your
chosen example.

## What's Provided

`bot-scripts` aims to extact common functionality and tooling, used by botkit
slack bots, into a centralised repository. It provides three commands:

- `bot-scripts lint` provides consistent tooling versions and configuration for
  linting rules using [ESLint](https://www.npmjs.com/package/eslint)
  (and associated plugins) and [Prettier](https://www.npmjs.com/package/prettier).
- `bot-scripts test` provides consistent tooling versions and configuration
  for running tests using [Jest](https://www.npmjs.com/package/jest).
- `bot-scripts start` provides consistent tooling versions and configuration
  for [Botkit](https://www.npmjs.com/package/botkit), as well as setting up
  boilerplate functionality and starting your bot.

### Bot Slack Commands

All bots using this set of scripts will have these slack commands by default:

- `ping` slack command
  - eg. `@your-bot ping`
  - Bot will reply with `pong`
- `help` slack command
  - eg. `@your-bot help`
  - Bot will reply a list of slack commands, using the `## Commands` section of
    the README as the source of this data. (See `examples/` for readme files
    where this has been used.)
- `status` slack command
  - eg. `@your-bot status`
  - Bot will reply with useful status information including host name, IP
    address and bot-scripts version. Additional data can be added to this
    response.

### Development Functionality

Your bot should have an entry point at `src/index.js` which exports a function.
On `start`, `bot-scripts` will call this function and provide it with a
`setupBot` function as a single parameter.

__Basic Example:__

You can get a complete runnable setup of this example at
[`examples/basic-example/`](./examples/basic-example/)

```js
// This emoji will prefix the slack command in the `help` slack command output
const customEmojis = {
  "my name is": ":wave:"
};

// This will be visible in the `status` slack command output
const statusData = {
  isExampleBot: true
};

// The bot will listen to slack commands prefixed with the botname string;
// This means you can call the bot without directly mentioning it.
// eg. If you had a bot under the handle `@HiBot` you could still call this bot
// via `example-bot my name is Alice`. This can be of use as part of reminders.
const botname = "example-bot";

module.exports = function(setupBot) { // Function called by bot-scripts start
  logger.debug("Setting up clients"); // Global `logger` object available

  // Bot instance and `listen` function provided from `setupBot`
  const { bot, listen } = setupBot({ botname, customEmojis, statusData });

  // Sets up case insensitive listener for "my name is" slack command
  // This can be called via a direct message, @ mention in a channel
  // or when it's prefixed by the `botname`
  listen("my name is (.+)", function(bot, message) {
    // Implement your slack command logic here, eg:
    // https://botkit.ai/docs/core.html#botreply
    bot.reply(message, `Hi ${message.match[1]}!`);
  });
};
```

#### Initial Setup

Your entry point function will be provided with a `setupBot` function. This
function should be called with an object, which can contain:

- `botname` - (optional) Name of the bot when
  [called ambiently](https://botkit.ai/docs/core.html#incoming-message-events)
  - Defaults to `bot`
  - eg. `bot ping` would call the `ping` slack command
- `customEmojis` - (optional) Mapping of slack command string to emoji for
  `help` output
  - Used to prefix slack commands with memorable emoji in `help` output.
    Defaults to `:point_right:`. For simplicity, this will match on slack
    commands starting with the provided object key, so the entire slack command
    string isn't required.
- `statusData` - (optional) Object of data to add to `status` output

This function returns an object containing the `bot` BotKit instance and a
`listen` function.

- Generally the `bot` BotKit instance won't be used; but it can be required as
  a parameter by some of the utility functions (documented later).
- The `listen` function is used to add slack commands to your bot. The provided
  `listen` function takes a string to listen for (which can contain regex syntax),
  which is then converted to a case insensitive regular expression and bound to
  both targetted means of communication (direct message, direct mention, etc.)
  and ambient targetting based on the provided `botname` (defaults to "bot").
  This allows for calling the bot as part of Slacks reminder functionality.

#### Logging

A global `logger` variable is provided to output a standard log format to the
console. Log level output can be set via environment variable:

- `LOGGING_LEVEL` - (optional) Level of logging to output.
  - Defaults to `info` (supports `debug` for verbose logging)
  - Follows the [Syslog severity levels](https://en.wikipedia.org/wiki/Syslog#Severity_level).

#### Utils

There are some helpful utilities available which can be imported separately.
These are provided under `@shopkeep/bot-scripts/utils` which will provide a
single `util` object containing:

- `getUser` function takes a **bot instance** and a **user ID** and returns a
  promise which will resolve to a standardised user object, which looks like:
  - `{ id, name, handle, email, avatar, tz }`
  - User ID most commonly comes from `message.user`, when looking up the caller
- `outputError` function takes a **bot instance**, the **message** and an
  **error message** (or error object) and will reply to the user with the error
  details.
- `generateListener` function takes the **bot name**, a **bot instance** and an
  **array of the [means by which it should listen](https://botkit.ai/docs/core.html#incoming-message-events)**
  and returns a function which can be used to set up listeners (like the
  `listen` function provided by `setupBot`).
  - This should be used when the provided `listen` function isn't suitable and
     a custom setup for the listen function is required.
  - Example:
    ```js
    const { generateListener } = require("@shopkeep/bot-scripts/utils");
    const botname = "example-bot";

    module.exports = function(setupBot) {
      const { bot } = setupBot();

      const directListener = generateListener(botname, bot, [
        // You can add as many or few message events here as you want to bind to
        // https://botkit.ai/docs/core.html#incoming-message-events
        'direct_message' // This listener will only bind to direct messages
      ]);

      directListener("my name is (.+)", function(bot, message) {
        bot.reply(message, `Hi ${message.match[1]}!`);
      });
    };
    ```

### Infrastructure Support

A healthcheck endpoint is exposed which can be used to determine the health of
the bot. This returns a `200` when the Slack real-time messaging websocket
connection available, and a `503` when it is not.

- `HEALTH_CHECK_PORT` - (optional) Port used for health check endpoint.
  - Defaults to `9000`

## Contributing

Pull requests on this repository are very welcome. There is test and linting
tooling in place. Formatting is provided by prettier. This project uses the same
linting and testing tooling as provided to any bots which use these scripts.

### Docker

Use `docker-compose` to build the environment, and run tests and lint.
```
docker-compose build test
docker-compose run test    # Test and lint
```

### Locally

Make sure you have Node.js and npm available locally. Install dependencies and
run the test and linting tasks.
```
npm install
npm test        # Run all tests with jest
npm run lint    # Lint the codebase with eslint
```
