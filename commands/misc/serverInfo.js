const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Replies with server info!'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Server Info')
            .setDescription('Some info about the server')
            .addFields(
                { name: 'Server name', value: interaction.guild.name, inline: true },
                { name: 'Total members', value: interaction.guild.memberCount.toString(), inline: true },
                { name: 'Server created at', value: interaction.guild.createdAt.toDateString(), inline: true },
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor('#0099ff')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
