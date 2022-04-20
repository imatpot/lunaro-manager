const { SlashCommandBuilder } = require('@discordjs/builders');
const { fetchRTPRole } = require('../util/fetchRTPRole');

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

    run: async (interaction) => {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'join':
                return joinRTP(interaction);
            case 'leave':
                return leaveRTP(interaction);
        }
    },
};

const joinRTP = (interaction) => {
    interaction.member.roles.add(fetchRTPRole(interaction));
    interaction.reply("*You joined RTP.*\nTime to show 'em what you can do!");
};

const leaveRTP = (interaction) => {
    interaction.member.roles.remove(fetchRTPRole(interaction));
    interaction.reply("*You left RTP.*\nYou'll come back eventually, right?");
};
