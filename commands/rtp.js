const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName('rtp').setDescription('rtp'),

    execute: async (interaction) => {
        await interaction.reply('rtp');
    },
};
