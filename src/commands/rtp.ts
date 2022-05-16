import { createCommand } from ':util/creators.ts';
import { getSubcommand } from ':util/commands.ts';
import { replyToInteraction } from ':util/interactions.ts';
import {
    getRTPMembers,
    addMemberToRTP,
    removeMemberFromRTP,
} from ':util/rtp.ts';
import { log } from ':util/logger.ts';
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

    run: async (interaction) => {
        const subcommand = getSubcommand(interaction);

        if (!subcommand) {
            throw new Error('Cannot execute /rtp without a subcommand');
        }

        const subcommands: SubcommandMap = {
            join: rtpJoin,
            leave: rtpLeave,
            info: rtpInfo,
        };

        await subcommands[subcommand](interaction);
    },
});

/** Function for `/rtp join`. */
const rtpJoin = async (interaction: Interaction) => {
    const member = interaction.member!;
    await addMemberToRTP(member);

    const name = member.nick || interaction.user.username;

    await replyToInteraction(interaction, {
        content: `🟢  ${name} is now available for Lunaro`,
    });
};

/** Function for `/rtp leave`. */
const rtpLeave = async (interaction: Interaction) => {
    const member = interaction.member!;
    await removeMemberFromRTP(member);

    const name = member.nick || interaction.user.username;

    await replyToInteraction(interaction, {
        content: `⭕  ${name} is no longer available for Lunaro`,
    });
};

/** Function for `/rtp info`. */
const rtpInfo = async (interaction: Interaction) => {
    const rtpMembers = await getRTPMembers();
    const rtpMemberCount = rtpMembers.length;

    const rtpMemberCountString =
        rtpMemberCount === 1
            ? 'There is 1 member'
            : `There are ${rtpMemberCount} members`;

    await replyToInteraction(interaction, {
        content: `👀  ${rtpMemberCountString} available for Lunaro`,
    });

    log(`${rtpMemberCountString} with the RTP role`);
};
