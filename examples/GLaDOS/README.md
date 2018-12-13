# GLaDOS
Genetic Lifeform and Disk Operating System

<p align="center">
  <img src="https://media.giphy.com/media/dT6fNwkHWrREk/giphy.gif" alt="The cake" height="226" width="320" />
</p>

---


![Running GLaDOS](./aperture-science.gif)


## Setup

1. Copy this directory

2. Create a `.env` file in the root directory, with values for these variables:
 - `CAKE_IS_A_LIE` - boolean for whether the cake is a lie; `true` or `false`
 - Variables used by `@shopkeep/bot-scripts`
    - `SLACK_BOT_TOKEN` - token for the slack bot to connect to your slack workspace
    - `HEALTH_CHECK_PORT` - (optional) Port used for health check endpoint.
      - Defaults to `9000`
    - `LOGGING_LEVEL` - (optional) Level of logging to output.
      - Defaults to `info`

### Docker

Use `docker-compose` to build the environment and run the bot.
```
docker-compose build service
docker-compose run service
```

### Locally

Make sure you have Node.js and npm available. Install dependencies and run the
bot:
```
npm install
npm start
```


## Commands

### help

The details noted here.

### ping

Checks that the bot's alive. If it replies `PONG`, you're good to go.

### run aperture test protocol

Implements test protocol for current testing area


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
