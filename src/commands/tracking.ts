import { createCommand } from ':util/creators.ts';
import { getSubcommand } from ':util/commands.ts';
import { replyToInteraction } from ':util/interactions.ts';
import {
    addMemberToTrackingBlocklist,
    removeMemberFromTrackingBlocklist,
} from ':util/activity-tracking.ts';
import { DiscordBot } from ':interfaces/discord-bot.ts';
import { SubcommandMap } from ':interfaces/command.ts';
import {
    ApplicationCommandTypes,
    ApplicationCommandOptionTypes,
    Interaction,
} from 'discordeno';

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

    run: async (bot, interaction) => {
        const subcommand = getSubcommand(interaction);

        if (!subcommand) {
            throw new Error('Cannot execute /rtp without a subcommand');
        }

        const subcommands: SubcommandMap = {
            pause: trackingPause,
            resume: trackingResume,
        };

        await subcommands[subcommand](bot, interaction);
    },
});

const trackingPause = async (_: DiscordBot, interaction: Interaction) => {
    const member = interaction.member!;
    addMemberToTrackingBlocklist(member);

    await replyToInteraction(interaction, {
        content: '⛔  Paused activity tracking for your account',
        ephemeral: true,
    });
};

const trackingResume = async (_: DiscordBot, interaction: Interaction) => {
    const member = interaction.member!;
    removeMemberFromTrackingBlocklist(member);

    await replyToInteraction(interaction, {
        content: '⚡  Resumed activity tracking for your account',
        ephemeral: true,
    });
};
