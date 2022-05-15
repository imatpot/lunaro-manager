import { HOME_GUILD_ID } from ':src/env.ts';
import { createCommand } from ':util/creators.ts';
import { readActivityTrackerData } from ':util/data.ts';
import { replyToInteraction } from ':util/interactions.ts';
import { snowflakeToTimestamp } from ':util/time.ts';
import { readyTimestamp } from ':events/ready.ts';

import { ApplicationCommandTypes, DISCORDENO_VERSION } from 'discordeno';
import {
    formatDuration,
    intervalToDuration,
    formatDistanceToNow,
} from 'date-fns';

createCommand({
    name: 'about',
    description: '💡 View details about Lunaro Manager',
    type: ApplicationCommandTypes.ChatInput,

    run: async (bot, interaction) => {
        const trackingData = readActivityTrackerData();
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
