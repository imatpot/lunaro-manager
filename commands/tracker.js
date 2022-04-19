const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tracker')
        .setDescription('tracker'),

    execute: async (interaction) => {
        await interaction.reply('tracker');
    },
};
