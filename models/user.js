const { model, Schema } = require('mongoose');

module.exports = model('User', 
    new Schema({
        userId: String,
        guildId: String,
        discordUsername: String,
        minecraftUsername: String,
        minecraftUUID: String,
        house: String,
        staff: Boolean,
        year: String,
        headUrl: String,
    })
);