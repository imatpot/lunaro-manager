const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    isTrackerEnabled,
    enableTracker,
    disableTracker,
} = require('../util/state');
const {
    addToWhitelist,
    removeFromWhitelist,
    readWhitelist,
} = require('../util/whitelist');
const { fetchAvailablePlayers, updateRTP } = require('../util/lunaroPlayers');
const { Permissions, version: djsVersion } = require('discord.js');
const { log } = require('../util/logger');
const {
    formatDuration,
    intervalToDuration,
    getTime,
    formatDistanceToNow,
} = require('date-fns');

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
                .setName('info')
                .setDescription('💡 See runtime details about Lunaro Tracker')
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
        const subcommandFunctions = {
            enable: enableTrackerGlobally,
            disable: disableTrackerGlobally,
            scan: scanForPlayers,
            info: displayTrackerInfo,
            allow: allowTracking,
            deny: denyTracking,
        };

        const subcommand = interaction.options.getSubcommand();
        subcommandFunctions[subcommand](interaction);
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

    interaction.reply(
        `🔎  Found ${playerCount} Lunaro player${playerCount !== 1 ? 's' : ''}.`
    );

    log('Member scanned for players.');
};

const displayTrackerInfo = async (interaction) => {
    const enabled = isTrackerEnabled();
    const enabledString = enabled ? 'enabled' : 'disabled';
    const enabledEmoji = enabled ? '⚡' : '🛑';

    const trackedPlayers = readWhitelist().length;
    const trackedPlayersEmoji = '🔎';

    const now = new Date();
    const uptime = formatDuration(
        intervalToDuration({
            start: new Date(getTime(now) - interaction.client.uptime),
            end: now,
        })
    );
    const uptimeEmoji = '⏱';

    const latestCommit = (
        await fetch(
            'https://api.github.com/repos/imatpot/lunaro-tracking-bot/commits?per_page=1'
        ).then((commits) => commits.json())
    )[0];
    const lastUpdated = formatDistanceToNow(
        Date.parse(latestCommit.committer.date),
        { locale: require('date-fns/locale/en-GB'), addSuffix: true }
    );
    const lastUpdatedEmoji = '🚧';

    const engine = `Node ${process.version} w/ discord.js ${djsVersion}`;
    const engineEmoji = '⚙';

    const message =
        `${enabledEmoji}  Tracker is ${enabledString}\n` +
        `${trackedPlayersEmoji}  Tracking ${trackedPlayers} players\n` +
        `${uptimeEmoji}  Current uptime is ${uptime}\n` +
        `${lastUpdatedEmoji}  Last updated ${lastUpdated}\n` +
        `${engineEmoji}  Running via ${engine}\n`;

    interaction.reply(message);
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
