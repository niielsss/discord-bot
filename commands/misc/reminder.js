const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Set a reminder for yourself!')
        .addStringOption(option => option.setName('time').setDescription('The amount of time to wait before reminding you.').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('The message to remind you with.').setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getString('time');
        const message = interaction.options.getString('message');
        // Check if isNaN or negative
        if (isNaN(ms(time)) || ms(time) < 0) {
            return interaction.reply({ content:'Please enter a valid time!', ephemeral: true });
        }

        const milliseconds = ms(time);
        const timestamp = ((Date.now() + milliseconds) / 1000).toFixed(0);

        const reminder = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Reminder Set!')
                    .setDescription(`I will remind you <t:${timestamp}:R> with the message: ${message}`)
                    .setColor('#0099ff')
                    .setFooter({ text: 'Disclaimer: This reminder will only work if the bot stays online.'})
                    .setTimestamp()
            ]
        });

        const reminderEmbed = new EmbedBuilder()
            .setTitle('Reminder!')
            .setDescription(`You asked me to remind you with the message: ${message}`)
            .setColor('#0099ff')
            .setTimestamp()

        setTimeout(async () => {
            await interaction.member.send({
                embeds: [
                    reminderEmbed,
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('Go to reminder')
                                .setStyle('Link')
                                .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${reminder.id}`)
                        )
                ]
            })

            await interaction.channel.send({
                content: `<@${interaction.member.id}>`,
                embeds: [
                    reminderEmbed,
                ]
            });
        }, milliseconds);
    },
};