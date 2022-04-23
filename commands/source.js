const { SlashCommandBuilder } = require('@discordjs/builders');
const { log } = require('../util/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('source')
        .setDescription("💾 View Luanro Tracker's source code"),

    run: async (interaction) => {
        interaction.reply({
            content: 'https://github.com/imatpot/lunaro-tracking-bot',
            ephemeral: true,
        });

        log('Member requested source code.');
    },
};
