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
                    type: ApplicationCommandOptionTypes.String,
                    required: false,
                },
            ],
        },
        {
            name: 'top',
            description: '🏆 View the top rankings',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
            options: [
                {
                    name: 'players',
                    description: 'The amount of players to show. Defaults to 5, maxes out at 30',
                    type: ApplicationCommandOptionTypes.Number,
                    required: false,
                },
                {
                    name: 'offset',
                    description: 'The amount of players to skip. Defaults to 0',
                    type: ApplicationCommandOptionTypes.Number,
                    required: false,
                },
            ],
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

const generatePlacementString = (placement: number, spaces = 1): string => {
    const medals: {
        [place: number]: string;
    } = {
        1: '🥇',
        2: '🥈',
        3: '🥉',
    };

    let gap = '';

    for (let i = 0; i < spaces; i++) {
        gap += ' ';
    }

    const medal: string = medals[placement] || '🏅';
    const placementString = [1, 2, 3].includes(placement)
        ? `${medal}`
        : `${medal}${gap}#${placement}`;

    return placementString;
};

/** Function for `/ranked view`. */
const rankedView = async (interaction: Interaction) => {
    let username = interaction.data?.options
        ?.find((option) => option.name === 'view')
        ?.options?.find((option) => option.name === 'player')?.value as string;

    if (username === undefined) {
        const player = await bot.helpers.getMember(HOME_GUILD_ID, interaction.user.id);
        const nick = player.nick;
        const user = DiscordUser.parse(nick);

        username = user.username;
    }

    const playerData = await getPlayerByNameOrId(username);
    const allPlayerData = await getAllPlayers();

    const locationInAllPlayerData = allPlayerData.find((a) => a.name == playerData.name)!;
    const index = allPlayerData.indexOf(locationInAllPlayerData);

    const placement = generatePlacementString(index + 1, 2);
    placement.replace('#0', '#?');

    await replyToInteraction(interaction, {
        content: [
            `👤  \`${playerData.name}\``,
            `🏆  ${rankToLeagueName(playerData.rank)}`,
            `${placement} with ${playerData.rank} points`,
        ].join('\n'),
    });
};

/** Function for `/ranked top`. */
const rankedTop = async (interaction: Interaction) => {
    const playerCount =
        (interaction.data?.options
            ?.find((option) => option.name === 'top')
            ?.options?.find((option) => option.name === 'players')?.value as number) || 10;

    const offset =
        (interaction.data?.options
            ?.find((option) => option.name === 'top')
            ?.options?.find((option) => option.name === 'offset')?.value as number) || 0;

    if (playerCount < 1) {
        throw new Error('Parameter `players` must be at least 1');
    }

    if (playerCount > 30) {
        throw new Error('Parameter `players` must be less than 30');
    }

    if (offset < 0) {
        throw new Error('Offset cannot be negative');
    }

    const allPlayers = await getAllPlayers();

    allPlayers.splice(0, offset);

    const topPlayers = allPlayers.splice(0, playerCount);
    const output: string[] = [];

    for (const [index, player] of topPlayers.entries()) {
        const placement = index + offset + 1;
        const placementString = generatePlacementString(placement);

        output.push(`${placementString} \`${player.name}\` with ${player.rank} points`);

        if (placement === 3) output.push('');
    }

    await replyToInteraction(interaction, {
        content: output.join('\n'),
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
