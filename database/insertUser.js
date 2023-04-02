const mongoose = require('mongoose');
const User = require('../models/user.js');

async function insertUser(data) {
    const existsDiscord = await User.find({ userId: data.userId });
    const existsMinecraft = await User.find({ minecraftUUID: data.minecraftUUID });
    if (existsDiscord.length > 0 || existsMinecraft.length > 0) return false;
    const user = new User({
        userId: data.userId,
        guildId: data.guildId,
        discordUsername: data.discordUsername,
        minecraftUsername: data.minecraftUsername,
        minecraftUUID: data.minecraftUUID,
        house: data.house,
        staff: data.staff,
        year: data.year,
        headUrl: data.headUrl,
    });
    await user.save();
    console.log(`Inserted ${user.discordUsername} into the database`);
    return true;
}

module.exports = { insertUser };