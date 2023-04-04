const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = class Menu {
    constructor(interaction, options) {
        this.interaction = interaction;
        this.options = options;
        this.arrowLeft = new ButtonBuilder().setEmoji('⬅️').setStyle('Primary').setCustomId('arrowLeft');
        this.arrowRight = new ButtonBuilder().setEmoji('➡️').setStyle('Primary').setCustomId('arrowRight');
        this.startArrow = new ButtonBuilder().setEmoji('⏮️').setStyle('Primary').setCustomId('startArrow');
        this.endArrow = new ButtonBuilder().setEmoji('⏭️').setStyle('Primary').setCustomId('endArrow');
        this.index = 0;
    }

    setButtons() {
        this.arrowLeft.setDisabled(this.index === 0);
        this.arrowRight.setDisabled(this.index === this.options.pages.length - 1);
        this.startArrow.setDisabled(this.index === 0);
        this.endArrow.setDisabled(this.index === this.options.pages.length - 1);
    }

    async send() {
        this.setButtons();

        const message = await this.interaction.reply({
            embeds: [
                this.options.embed
                    .setFooter({ text: `Page ${this.index + 1} of ${this.options.pages.length}` })
                    .setDescription(this.options.pages[this.index])
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(this.startArrow, this.arrowLeft, this.arrowRight, this.endArrow)
            ],
            fetchReply: true
        });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async button => {
            button.deferUpdate();
            if (button.user.id !== this.interaction.user.id) {
                this.interaction.editReply('You cannot use this menu', true);
                return;
            }

            if (button.customId === 'arrowLeft') {
                this.index--;
            } else if (button.customId === 'arrowRight') {
                this.index++;
            } else if (button.customId === 'startArrow') {
                this.index = 0;
            } else if (button.customId === 'endArrow') {
                this.index = this.options.pages.length - 1;
            }

            this.setButtons();

            await this.interaction.editReply({
                embeds: [
                    this.options.embed
                        .setFooter({ text: `Page ${this.index + 1} of ${this.options.pages.length}` })
                        .setDescription(this.options.pages[this.index])
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(this.startArrow, this.arrowLeft, this.arrowRight, this.endArrow)
                ]
            });
        });

        collector.on('end', async () => {
            await this.interaction.editReply({
                components: []
            });
        });
    }
}