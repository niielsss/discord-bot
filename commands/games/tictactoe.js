const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const TicTacToe = require('../../util/tictactoe.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Play Tic Tac Toe with a friend!')
        .addUserOption(option => option.setName('opponent').setDescription('The user you want to play against').setRequired(true)),
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');

        // Check if the opponent is the same as the user
        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: 'You can\'t play against yourself!', ephemeral: true });
        }

        const invite = new EmbedBuilder()
            .setTitle('Tic Tac Toe')
            .setDescription(`${interaction.user} has challenged you to a game of Tic Tac Toe!`)
            .addFields(
                { name: 'Accept', value: 'Click the checkmark to accept the challenge.' },
                { name: 'Decline', value: 'Click the cross to decline the challenge.' }
            )
            .setFooter({ text: 'This invite will expire in 30 seconds.'})
            .setColor('#0099ff')
            .setTimestamp();

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    // Checkmark emoji
                    .setLabel('\u2705')
                    .setStyle('Secondary')
                    .setCustomId('accept'),
                new ButtonBuilder()
                    // Cross emoji
                    .setLabel('\u274C')
                    .setStyle('Secondary')
                    .setCustomId('decline')
            );

        const inviteMessage = await interaction.reply({
            //content: `<@${opponent.id}>`,
            embeds: [invite],
            components: [buttons]
        });

        const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });
        
        collector.on('collect', async i => {
            if (i.user.id !== opponent.id) {
                return i.reply({ content: 'This invite is not for you!', ephemeral: true });
            }
            
            if (i.customId === 'accept') {
                await inviteMessage.delete();

                await interaction.channel.send(`${interaction.user} vs opponent!`);

                const game = new TicTacToe(interaction, opponent);

                game.start();
            } else if (i.customId === 'decline') {
                await inviteMessage.delete();

                await interaction.channel.send(`${opponent} declined the game!`);
            }
        });

        // If the opponent doesn't respond in time
        collector.on('end', async collected => {
            collected = collected.filter(c => c.user.id === opponent.id);
            if (collected.size > 0) return;

            // Check if the invite message still exists
            const msg = await interaction.channel.messages.fetch(inviteMessage.id).catch(() => null);
            if (!msg) return;

            await inviteMessage.delete();

            await interaction.channel.send(`opponent didn't respond in time!`);
        });

        
    },
}