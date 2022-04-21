const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('🎓 Learn how to use Lunaro Tracker'),

    run: async (interaction) => {
        interaction.reply({
            content: 'help',
            ephemeral: true,
        });

        console.log('Member asked for help.');
    },
};
