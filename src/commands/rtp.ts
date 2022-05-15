import { createCommand } from ':util/creators.ts';
import { getSubcommand } from ':util/commands.ts';
import { replyToInteraction } from ':util/interactions.ts';
import {
    getRTPMembers,
    addMemberToRTP,
    removeMemberFromRTP,
} from ':util/rtp.ts';
import { DiscordBot } from ':interfaces/discord-bot.ts';
import { SubcommandMap } from ':interfaces/command.ts';
import {
    ApplicationCommandTypes,
    ApplicationCommandOptionTypes,
    Interaction,
} from 'discordeno';

createCommand({
    name: 'rtp',
    description: '🥍 Manage RTP status',
    type: ApplicationCommandTypes.ChatInput,

    options: [
        {
            name: 'join',
            description: '🟢 Join RTP',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
        },
        {
            name: 'leave',
            description: '⭕ Leave RTP',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
        },
        {
            name: 'info',
            description: "👀 Check out who's available",
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
            join: rtpJoin,
            leave: rtpLeave,
            info: rtpInfo,
        };

        await subcommands[subcommand](bot, interaction);
    },
});

const rtpJoin = async (_: DiscordBot, interaction: Interaction) => {
    const member = interaction.member!;
    await addMemberToRTP(member);

    const name = member.nick || interaction.user.username;

    await replyToInteraction(interaction, {
        content: `🟢  ${name} is now available for Lunaro`,
    });
};

const rtpLeave = async (_: DiscordBot, interaction: Interaction) => {
    const member = interaction.member!;
    await removeMemberFromRTP(member);

    const name = member.nick || interaction.user.username;

    await replyToInteraction(interaction, {
        content: `⭕  ${name} is no longer available for Lunaro`,
    });
};

const rtpInfo = async (_: DiscordBot, interaction: Interaction) => {
    const rtpMembers = await getRTPMembers();
    const rtpMemberCount = rtpMembers.length;

    const rtpMemberCountText =
        rtpMemberCount === 1
            ? 'There is 1 member'
            : `There are ${rtpMemberCount} members`;

    await replyToInteraction(interaction, {
        content: `👀  ${rtpMemberCountText} available for Lunaro`,
    });
};
