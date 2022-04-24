const { SlashCommandBuilder } = require('@discordjs/builders');
const { log } = require('../util/logger');
const { fetchRTPRole } = require('../util/rtpRole');
const { addToWhitelist, removeFromWhitelist } = require('../util/whitelist');

const trackingOptionName = 'tracking';
const trackingOptionDescription =
    'Enable or disable tracking. If unset, your tracking options will not change.';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rtp')
        .setDescription('Manually manage RTP status')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('join')
                .setDescription('🟢 Join RTP')
                .addBooleanOption((option) =>
                    option
                        .setName(trackingOptionName)
                        .setDescription(trackingOptionDescription)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('leave')
                .setDescription('🌙 Leave RTP')
                .addBooleanOption((option) =>
                    option
                        .setName(trackingOptionName)
                        .setDescription(trackingOptionDescription)
                )
        ),

    run: async (interaction) => {
        const tracking = interaction.options.getBoolean(trackingOptionName);
        if (tracking !== null) {
            const id = interaction.member.id;
            if (tracking) addToWhitelist(id);
            else removeFromWhitelist(id);
        }

        const subcommandFunctions = {
            join: joinRTP,
            leave: leaveRTP,
        };

        const subcommand = interaction.options.getSubcommand();
        subcommandFunctions[subcommand](interaction);
    },
};

const joinRTP = (interaction) => {
    interaction.member.roles.add(fetchRTPRole(interaction.guild));
    interaction.reply('🟢  You joined RTP.');

    log('Member joined RTP.');
};

const leaveRTP = (interaction) => {
    interaction.member.roles.remove(fetchRTPRole(interaction.guild));
    interaction.reply('🌙  You left RTP.');

    log('Member left RTP.');
};
