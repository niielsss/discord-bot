const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPlayer } = require('../../util/potterworld/getPlayer');
const { findUser } = require('../../database/findUser');
const Menu = require('../../util/menu.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('friends')
        .setDescription('Replies with a list of your friends!')
        .addStringOption(option => option.setName('user').setDescription('The user to get the friends of. Leave blank to get your own friends.')),
    async execute(interaction) {
        // Fetch the user from the options and show their friends in embed, 10 friends per page
        // you can find an array of friends in data.player.friends (array of objects)
        // you can find the username in data.player.friends.minecraft_username
        // make sure underscores do not get replaced by anything
        let data;
        if (!interaction.options.getString('user')) {
            data = await findUser({ userId: interaction.user.id });
            if (!data) {
                await interaction.reply('You are not linked. Use /link to link your account.');
                return;
            }
            data = await getPlayer(data.minecraftUsername);
        } else {
            data = await getPlayer(interaction.options.getString('user'));
        }

        if (!data) {
            await interaction.reply('That username does not exist');
            return;
        }

        if (!data.player.friends) {
            await interaction.reply('That user has no friends');
            return;
        }

        const friends = [];
        let temp = [];
        for (let i = 0; i < data.player.friends.length; i++) {
            temp.push(data.player.friends[i].minecraft_username);
            if (temp.length === 10) {
                friends.push(temp);
                temp = [];
            }
        }
        if (temp.length !== 0) {
            friends.push(temp);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: data.player.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('Friends')

        // Show 10 friends per page
        const menu = new Menu(interaction, {
            embed: embed,
            pages: friends.map(friend => "```\n" + friend.join('\n') + "\n```" || 'No friends'),
        });

        await menu.send();
    }
};

