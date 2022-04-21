const { SlashCommandBuilder } = require('@discordjs/builders');
const { RTP_ROLE_ID } = require('../environment');
const { fetchRTPRole } = require('../util/rtpRole');
const {
    addToWhitelist,
    removeFromWhitelist,
    readWhitelist,
} = require('../util/whitelist');
const {
    fetchAvailablePlayers,
    fetchLunaroPlayers,
    fetchRTPMembers,
} = require('../util/lunaroPlayers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tracker')
        .setDescription('Manage permissions and runtime of Lunaro Tracker')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('enable')
                .setDescription('⚡ Turn on Lunaro Tracker')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('disable')
                .setDescription('🛑 Turn off Lunaro Tracker')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('scan')
                .setDescription('🔎 Force scan for Lunaro players')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('allow')
                .setDescription('✅ Allow Lunaro Tracker to read your activity')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('deny')
                .setDescription(
                    '⛔ Deny Lunaro Tracker from reading your activity'
                )
        ),

    run: async (interaction) => {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'enable':
                return enableTracker(interaction);
            case 'disable':
                return disableTracker(interaction);
            case 'scan':
                return scanForPlayers(interaction);
            case 'allow':
                return allowTracking(interaction);
            case 'deny':
                return denyTracking(interaction);
        }
    },
};

const enableTracker = (interaction) => {};

const disableTracker = (interaction) => {};

const scanForPlayers = async (interaction) => {
    const lunaroPlayers = await fetchLunaroPlayers(interaction);
    for (const player of lunaroPlayers) {
        if (readWhitelist().includes(interaction.member.id)) {
            player.roles.add(fetchRTPRole(interaction));
        }
    }

    const rtpMembers = await fetchRTPMembers(interaction);
    for (const member of rtpMembers) {
        if (readWhitelist().includes(interaction.member.id)) {
            if (!lunaroPlayers.includes(member)) {
                member.roles.remove(fetchRTPRole(interaction));
            }
        }
    }

    const availablePlayers = (await fetchAvailablePlayers(interaction)).length;

    interaction.reply(
        `🔎 Found a total of ${availablePlayers} Lunaro players.`
    );
    console.log('Member scanned for players.');
};

const allowTracking = async (interaction) => {
    addToWhitelist(interaction.member.id);
    interaction.reply({
        content: '✅ You are now being tracked.',
        ephemeral: true,
    });
    console.log('Member enabled tracking.');
};

const denyTracking = async (interaction) => {
    removeFromWhitelist(interaction.member.id);
    interaction.reply({
        content: '⛔ You are no longer being tracked.',
        ephemeral: true,
    });
    console.log('Member disabled tracking.');
};
