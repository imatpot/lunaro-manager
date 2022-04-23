const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    isTrackerEnabled,
    enableTracker,
    disableTracker,
} = require('../util/state');
const { addToWhitelist, removeFromWhitelist } = require('../util/whitelist');
const { fetchAvailablePlayers, updateRTP } = require('../util/lunaroPlayers');
const { Permissions } = require('discord.js');
const { log } = require('../util/logger');

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
                return enableTrackerGlobally(interaction);
            case 'disable':
                return disableTrackerGlobally(interaction);
            case 'scan':
                return scanForPlayers(interaction);
            case 'allow':
                return allowTracking(interaction);
            case 'deny':
                return denyTracking(interaction);
        }
    },
};

const enableTrackerGlobally = (interaction) => {
    if (!isModerator(interaction)) {
        interaction.reply({
            content: '❌  Permission denied.',
            ephemeral: true,
        });

        log('Member was denied permission to enable tracker.');
        return;
    }

    enableTracker(interaction.guild, interaction.client);
    interaction.reply('⚡  Lunaro tracker has been enabled.');

    log('Member enabled tracker.');
};

const disableTrackerGlobally = (interaction) => {
    if (!isModerator(interaction)) {
        interaction.reply({
            content: '❌  Permission denied.',
            ephemeral: true,
        });

        log('Member was denied permission to disable tracker.');
        return;
    }

    disableTracker(interaction.client);
    interaction.reply('🛑  Lunaro tracker has been disabled.');

    log('Member disabled tracker.');
};

const scanForPlayers = async (interaction) => {
    if (!isTrackerEnabled()) {
        interaction.reply({
            content: '❌  Tracker is disabled.',
        });

        log('Member tried to scan for players, but tracker is disabled.');
        return;
    }

    await updateRTP(interaction.guild);

    const playerCount = (await fetchAvailablePlayers(interaction.guild)).length;

    interaction.reply(`🔎  Found ${playerCount} Lunaro players.`);

    log('Member scanned for players.');
};

const allowTracking = async (interaction) => {
    addToWhitelist(interaction.member.id);
    interaction.reply({
        content: '✅  Your activity is now being tracked.',
        ephemeral: true,
    });

    log('Member enabled tracking.');
};

const denyTracking = async (interaction) => {
    removeFromWhitelist(interaction.member.id);
    interaction.reply({
        content: '⛔  Your activity is no longer being tracked.',
        ephemeral: true,
    });

    log('Member disabled tracking.');
};

const isModerator = (interaction) =>
    interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
