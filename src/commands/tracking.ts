import { SubcommandMap } from ':interfaces/command.ts';
import {
    addMemberToTrackingBlocklist,
    removeMemberFromTrackingBlocklist
} from ':util/activity-tracking.ts';
import { getSubcommand } from ':util/commands.ts';
import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, Interaction } from 'discordeno';

createCommand({
    name: 'tracking',
    description: '🔎 Manage your tracking permissions',
    type: ApplicationCommandTypes.ChatInput,

    options: [
        {
            name: 'pause',
            description: '⛔ Pause activity tracking on your account',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
        },
        {
            name: 'resume',
            description: '⚡ Resume activity tracking on your account',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
        },
    ],

    run: async (interaction) => {
        const subcommand = getSubcommand(interaction);

        if (!subcommand) {
            throw new Error('Cannot execute /rtp without a subcommand');
        }

        const subcommands: SubcommandMap = {
            pause: trackingPause,
            resume: trackingResume,
        };

        await subcommands[subcommand](interaction);
    },
});

/** Function for `/tracking pause`. */
const trackingPause = async (interaction: Interaction) => {
    const member = interaction.member!;
    addMemberToTrackingBlocklist(member);

    await replyToInteraction(interaction, {
        content: '⛔  Paused activity tracking for your account',
        ephemeral: true,
    });
};

/** Function for `/tracking resume`. */
const trackingResume = async (interaction: Interaction) => {
    const member = interaction.member!;
    removeMemberFromTrackingBlocklist(member);

    await replyToInteraction(interaction, {
        content: '⚡  Resumed activity tracking for your account',
        ephemeral: true,
    });
};
