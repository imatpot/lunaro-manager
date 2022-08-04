import { SubcommandMap } from ':interfaces/command.ts';
import { DiscordUser } from ':interfaces/discord-user.ts';
import { bot } from ':src/bot.ts';
import { HOME_GUILD_ID } from ':src/env.ts';
import { getSubcommand } from ':util/commands.ts';
import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';
import { getAllPlayers, getPlayerByNameOrId, rankToLeagueName } from ':util/rank-api.ts';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, Interaction } from 'discordeno';

createCommand({
    name: 'ranked',
    description: '🏆 Submit and view ranking data',
    type: ApplicationCommandTypes.ChatInput,

    options: [
        {
            name: 'view',
            description: "🏅 View a player's ranking",
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
            options: [
                {
                    name: 'player',
                    description: 'The player whose ranking you want to view. Defaults to yourself',
                    type: ApplicationCommandOptionTypes.User,
                    required: false,
                },
            ],
        },
        {
            name: 'top',
            description: '🏆 View the top rankings',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
        },
        {
            name: 'register',
            description: '✍ Register for ranked matches',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
        },
        {
            name: 'submit',
            description: '🥍 Submit a ranked match',
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
            view: rankedView,
            top: rankedTop,
            register: rankedRegister,
            submit: rankedSubmit,
        };

        await subcommands[subcommand](interaction);
    },
});

/** Function for `/ranked view`. */
const rankedView = async (interaction: Interaction) => {
    let userIdAsString = interaction.data?.options
        ?.find((option) => option.name === 'view')
        ?.options?.find((option) => option.name === 'player')?.value as string;

    if (userIdAsString === undefined) {
        userIdAsString = interaction.user.id.toString();
    }

    const userId = BigInt(userIdAsString);
    const player = await bot.helpers.getMember(HOME_GUILD_ID, userId);
    const name = player.nick;
    const user = DiscordUser.parse(name);

    if (!user) {
        return await replyToInteraction(interaction, {
            content: '❌  Sorry, I failed to infer the in-game name from the Discord alias.',
            ephemeral: true,
        });
    }

    const playerData = await getPlayerByNameOrId(user.username);

    if (!playerData) {
        return await replyToInteraction(interaction, {
            content:
                "❌  Sorry, looks like you aren't signed up to ranked gameplay. Please run `/ranked register`.",
            ephemeral: true,
        });
    }

    const allPlayerData = await getAllPlayers();
    let place: string;

    if (allPlayerData) {
        const locationInAllPlayerData = allPlayerData.find((a) => a.name == playerData.name)!;
        const index = allPlayerData.indexOf(locationInAllPlayerData);

        place = index == -1 ? '?' : (index + 1).toString();
    } else {
        place = '?';
    }

    await replyToInteraction(interaction, {
        content: [
            `👤  <@${player.id}>`,
            `🏅  ${rankToLeagueName(playerData.rank)}`,
            `🏆  #${place} with ${playerData.rank} points`,
        ].join('\n'),
    });
};

/** Function for `/ranked top`. */
const rankedTop = async (interaction: Interaction) => {
    await replyToInteraction(interaction, {
        content: '/ranked top',
        ephemeral: true,
    });
};

/** Function for `/ranked register`. */
const rankedRegister = async (interaction: Interaction) => {
    await replyToInteraction(interaction, {
        content: '/ranked register',
        ephemeral: true,
    });
};

/** Function for `/ranked submit`. */
const rankedSubmit = async (interaction: Interaction) => {
    await replyToInteraction(interaction, {
        content: '/ranked submit',
        ephemeral: true,
    });
};
