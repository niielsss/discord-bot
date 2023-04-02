const { GatewayIntentBits } = require('discord.js');

module.exports = {
    options: {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
        ]
    },
}