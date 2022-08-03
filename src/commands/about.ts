import { readyTimestamp } from ':events/ready.ts';
import { bot } from ':src/bot.ts';
import { HOME_GUILD_ID } from ':src/env.ts';
import { createCommand } from ':util/creators.ts';
import { readActivityTrackingConfig } from ':util/data.ts';
import { replyToInteraction } from ':util/interactions.ts';

import {
    formatDistanceToNow, formatDuration,
    intervalToDuration
} from 'date-fns';
import { ApplicationCommandTypes, DISCORDENO_VERSION } from 'discordeno';

createCommand({
    name: 'about',
    description: '💡 View details about Lunaro Manager',
    type: ApplicationCommandTypes.ChatInput,

    run: async (interaction) => {
        const trackingData = readActivityTrackingConfig();
        const members = await bot.helpers.getMembers(HOME_GUILD_ID, {});
        const trackedMemberCount = members.size - trackingData.blocklist.length;

        const trackingString = trackingData.enabled
            ? `🔎  Tracking activity of ${trackedMemberCount} members`
            : '🛑  Activity tracking disabled';

        const engineString =
            '⚙  Deno v' +
            Deno.version.deno +
            ' + TypeScript v' +
            Deno.version.typescript +
            ' + discordeno v' +
            DISCORDENO_VERSION;

        const commits = await fetch(
            'https://api.github.com/repos/imatpot/lunaro-manager/commits?per_page=1'
        ).then((commits) => commits.json());

        const lastUpdatedString =
            '🛠  Last updated ' +
            formatDistanceToNow(Date.parse(commits[0].commit.committer.date), {
                addSuffix: true,
            });

        const uptimeString =
            '⏱  Running for ' +
            formatDuration(
                intervalToDuration({
                    start: readyTimestamp,
                    end: Date.now(),
                })
            );

        const aboutString = [
            trackingString,
            '',
            engineString,
            lastUpdatedString,
            '',
            uptimeString,
        ].join('\n');

        await replyToInteraction(interaction, {
            content: aboutString,
        });
    },
});
