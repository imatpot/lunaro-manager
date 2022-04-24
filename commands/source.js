const { SlashCommandBuilder } = require('@discordjs/builders');
const { log } = require('../util/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('source')
        .setDescription("💾 View Luanro Tracker's source code"),

    run: async (interaction) => {
        interaction.reply('https://github.com/imatpot/lunaro-tracking-bot');

        log('Member requested source code.');
    },
};
