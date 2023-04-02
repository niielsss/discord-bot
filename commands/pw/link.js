const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPlayer } = require('../../util/potterworld/getPlayer.js');
const { insertUser } = require('../../database/insertUser.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Minecraft account to your Discord account')
        .addStringOption(option => option.setName('username').setDescription('Your Minecraft username').setRequired(true)),
    async execute(interaction) {
        const data = await getPlayer(interaction.options.getString('username'));
        if (data) {
            const player = {
                userId: interaction.user.id,
                guildId: interaction.guild.id,
                discordUsername: interaction.user.username + '#' + interaction.user.discriminator,
                minecraftUsername: data.player.username,
                minecraftUUID: data.player.uuid,
                house: data.player.house,
                staff: data.player.staff,
                year: data.player.year,
                headUrl: data.player.head_url,
            };

            const inserted = await insertUser(player);

            const color = this.chooseColour(player.house);
            const embed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({
                    name: player.minecraftUsername,
                    iconURL: player.headUrl,
                })
                .addFields(
                    { name: 'House', value: player.house.charAt(0).toUpperCase() + player.house.slice(1).toLowerCase(), inline: true },
                    { name: 'Year', value: player.year, inline: true },
                    { name: 'Staff', value: player.staff ? 'True' : 'False', inline: true },
                )
                .addFields(
                    { name: 'Discord', value: player.discordUsername, inline: true },
                    { name: 'Discord ID', value: player.userId, inline: true },
                )
                .addFields(
                    { name: 'UUID', value: player.minecraftUUID },
                )

            if (inserted) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply('You are already linked');
            }
        } else {
            await interaction.reply('That username does not exist');
        }
    },
    chooseColour(house) {
        switch (house) {
            case 'GRIFFIN':
                return "#740001";
            case 'SERPENT':
                return "#1A472A";
            case 'HONEYBADGER':
                return "#FFD800";
            case 'RAVEN':
                return "#0E1A40";
            default:
                return "#000000";
        }
    }
};