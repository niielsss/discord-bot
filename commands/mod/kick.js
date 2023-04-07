const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server')
        .addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for kicking the member').setRequired(true)),

    permissions: 'KICK_MEMBERS',
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permissions to kick members.', ephemeral: true });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot kick yourself.', ephemeral: true });
        }

        if (!interaction.guild.members.cache.get(target.id).kickable) {
            return interaction.reply({ content: 'You cannot kick this member.', ephemeral: true });
        }


        const dmEmbed = new EmbedBuilder()
            .setTitle('You have been kicked')
            .setDescription(`You have been kicked from ${interaction.guild.name}`)
            .addFields(
                { name: 'Reason', value: reason },
            )
            .setColor('#0099ff')
            .setTimestamp();
        try {
            await target.send({ embeds: [dmEmbed] });
        } catch (error) {
            await interaction.reply({ content: 'I was unable to send a dm to the member.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Member Kicked')
            .setDescription(`${target} was kicked by ${interaction.user}`)
            .addFields(
                { name: 'Reason', value: reason },
            )
            .setColor('#0099ff')
            .setTimestamp();

        await interaction.guild.members.kick(target);
        await interaction.channel.send({ embeds: [embed] });
    }
}