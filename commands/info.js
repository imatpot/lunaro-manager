const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    formatDuration,
    intervalToDuration,
    getTime,
    formatDistanceToNow,
} = require('date-fns');
const { log } = require('../util/logger');
const { isTrackerEnabled } = require('../util/state');
const { readWhitelist } = require('../util/whitelist');
const { version: djsVersion } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('💡 View runtime details about Lunaro Tracker'),

    run: async (interaction) => {
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

        log('Member viewed stats.');
    },
};
