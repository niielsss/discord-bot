const config = require('./bot/config.js');
const BotClient = require('./bot/BotClient.js');

const client = new BotClient(config);

client.start();