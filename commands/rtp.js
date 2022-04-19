const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rtp')
        .setDescription('Manually manage RTP status')
        .addSubcommand((subcommand) =>
            subcommand.setName('join').setDescription('🟢 Join RTP')
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('leave').setDescription('🌙 Leave RTP')
        ),

    execute: async (interaction) => {
        await interaction.reply('rtp ' + interaction.options.getSubcommand());
    },
};
