const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = class TicTacToe {
    constructor(interaction, opponent) {
        this.interaction = interaction;
        this.host = interaction.user;
        this.opponent = opponent;
        this.board = "_________";
        this.turn = interaction.user;
        this.gameOver = false;
        this.winner = null;
    }

    async start() {
        const gameEmbed = new EmbedBuilder()
            .setTitle('Tic Tac Toe')
            .setDescription('Click the buttons below to make your move.')
            .addFields(
                { name: 'Player 1', value: `${ this.interaction.user }`, inline: true },
                { name: 'Player 2', value: `opponent`, inline: true },
                { name: 'Turn', value: `${ this.turn }`, inline: true },
            )
            .setColor('#0099ff')
            .setTimestamp();

        const buttons = await this.createButtons();

        const gameMessage = await this.interaction.channel.send({
            embeds: [gameEmbed],
            components: buttons
        });

        const collector = gameMessage.createMessageComponentCollector();

        collector.on('collect', async i => {

            if (i.user.id !== this.host.id && i.user.id !== this.opponent.id) {
                return i.reply({ content: 'This game is not for you!', ephemeral: true });
            }

            if (this.gameOver) {
                return i.reply({ content: 'The game is over!', ephemeral: true });
            }

            await this.move(i.customId, i);
        });

    }

    async move(place, interaction) {
        if (this.turn.id !== interaction.user.id) {
            return interaction.reply({ content: 'It\'s not your turn!', ephemeral: true });
        }

        if (this.board.charAt(place) != '_') {
            return interaction.reply({ content: 'That spot is already taken!', ephemeral: true });
        }

        const symbol = this.turn.id === this.host.id ? 'X' : 'O';

        this.board = this.board.split('').map((char, i) => i == place ? symbol : char).join('');

        this.turn = this.turn.id === this.host.id ? this.opponent : this.host;

        if (await this.checkWin(interaction)) {
            return;
        }

        const gameEmbed = new EmbedBuilder()
            .setTitle('Tic Tac Toe')
            .setDescription('Click the buttons below to make your move.')
            .addFields(
                { name: 'Player 1', value: `${ this.host }`, inline: true },
                { name: 'Player 2', value: `${ this.opponent }`, inline: true },
                { name: 'Turn', value: `${ this.turn }`, inline: true },
            )
            .setColor('#0099ff')
            .setTimestamp();
        
        const buttons = await this.createButtons();

        await interaction.update({
            embeds: [gameEmbed],
            components: buttons
        });
    }

    async checkWin(interaction) {
        await this.checkRows();
        await this.checkColumns();
        await this.checkDiagonals();
        await this.checkTie();

        if (this.gameOver) {
            const gameEmbed = new EmbedBuilder()
                .setTitle('Tic Tac Toe')
                .setDescription('Click the buttons below to make your move.')
                .addFields(
                    { name: 'Player 1', value: `${ this.host }`, inline: true },
                    { name: 'Player 2', value: `${ this.opponent }`, inline: true },
                    { name: 'Turn', value: `${ this.turn }`, inline: true },
                    { name: 'Winner', value: `${ this.winner ? this.winner : 'Tie' }`, inline: true },
                )
                .setColor('#0099ff')
                .setTimestamp();

            const buttons = await this.createButtons();

            console.log(this.board);

            await interaction.update({
                embeds: [gameEmbed],
                components: buttons
            });

            return true;
        }
    }

    async checkRows() {
        for (let i = 0; i < 3; i++) {
            if (this.board.charAt(i * 3) === this.board.charAt(i * 3 + 1) && this.board.charAt(i * 3 + 1) === this.board.charAt(i * 3 + 2) && this.board.charAt(i * 3) !== '_') {
                this.gameOver = true;
                this.winner = this.board.charAt(i * 3) === 'X' ? this.host : this.opponent;
                return;
            }
        }
    }

    async checkColumns() {
        for (let i = 0; i < 3; i++) {
            if (this.board.charAt(i) === this.board.charAt(i + 3) && this.board.charAt(i + 3) === this.board.charAt(i + 6) && this.board.charAt(i) !== '_') {
                this.gameOver = true;
                this.winner = this.board.charAt(i) === 'X' ? this.host : this.opponent;
                return;
            }
        }
    }

    async checkDiagonals() {
        if (this.board.charAt(0) === this.board.charAt(4) && this.board.charAt(4) === this.board.charAt(8) && this.board.charAt(0) !== '_') {
            this.gameOver = true;
            this.winner = this.board.charAt(0) === 'X' ? this.host : this.opponent;
            return;
        }

        if (this.board.charAt(2) === this.board.charAt(4) && this.board.charAt(4) === this.board.charAt(6) && this.board.charAt(2) !== '_') {
            this.gameOver = true;
            this.winner = this.board.charAt(2) === 'X' ? this.host : this.opponent;
            return;
        }
    }

    async checkTie() {
        if (!this.board.includes('_')) {
            this.gameOver = true;
            this.winner = null;
            return;
        }
    }

    async createButtons() {
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(0) === '_' ? '⬜' : this.board.charAt(0) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('0'),
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(1) === '_' ? '⬜' : this.board.charAt(1) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('1'),
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(2) === '_' ? '⬜' : this.board.charAt(2) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('2')
            )

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(3) === '_' ? '⬜' : this.board.charAt(3) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('3'),
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(4) === '_' ? '⬜' : this.board.charAt(4) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('4'),
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(5) === '_' ? '⬜' : this.board.charAt(5) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('5')
            )

        const buttons3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(6) === '_' ? '⬜' : this.board.charAt(6) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('6'),
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(7) === '_' ? '⬜' : this.board.charAt(7) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('7'),
                new ButtonBuilder()
                    .setEmoji(this.board.charAt(8) === '_' ? '⬜' : this.board.charAt(8) === 'X' ? '❌' : '⭕')
                    .setStyle('Secondary')
                    .setCustomId('8')
            )

        return [buttons, buttons2, buttons3];
    }
}