import { HttpError } from ':error/http-error.ts';
import { InvocationError } from ':error/invocation-error.ts';
import { UnimplementedError } from ':error/unimplemented-error.ts';
import { SubcommandMap } from ':interfaces/command.ts';
import { DiscordUser } from ':interfaces/discord-user.ts';
import { NewLunaroPlayer } from ':interfaces/lunaro-player.ts';
import { bot } from ':src/bot.ts';
import { HOME_GUILD_ID } from ':src/env.ts';
import { getSubcommand } from ':util/commands.ts';
import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';
import {
    createPlayer,
    getAllPlayers,
    getPlayerByNameOrId,
    leagueNameToRank,
    rankToLeagueName
} from ':util/rank-api.ts';
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    Attachment,
    Interaction
} from 'discordeno';

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
                    description: 'The amount of players to show. Defaults to 10, maxes out at 30',
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
            options: [
                {
                    name: 'player-a',
                    description: 'Player A',
                    type: ApplicationCommandOptionTypes.User,
                    required: true,
                },
                {
                    name: 'player-b',
                    description: 'Player B',
                    type: ApplicationCommandOptionTypes.User,
                    required: true,
                },
                {
                    name: 'player-a-ping',
                    description: 'Average ping of player A. For host, input 0',
                    type: ApplicationCommandOptionTypes.Number,
                    required: true,
                },
                {
                    name: 'player-b-ping',
                    description: 'Average ping of player B. For host, input 0',
                    type: ApplicationCommandOptionTypes.Number,
                    required: true,
                },
                {
                    name: 'player-a-score',
                    description: 'Scored points of the host',
                    type: ApplicationCommandOptionTypes.Number,
                    required: true,
                },
                {
                    name: 'player-b-score',
                    description: 'Scored points of the client',
                    type: ApplicationCommandOptionTypes.Number,
                    required: true,
                },
                {
                    name: 'evidence',
                    description: 'Screenshot of the match result',
                    type: ApplicationCommandOptionTypes.Attachment,
                    required: false,
                },
            ],
        },
    ],

    run: async (interaction) => {
        const subcommand = getSubcommand(interaction);

        if (!subcommand) {
            throw new InvocationError('Cannot execute /rtp without a subcommand');
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
        const nick = player.nick || interaction.user.username;
        const user = DiscordUser.parse(nick);

        username = user.username;
    }

    const playerData = await getPlayerByNameOrId(username);
    const allPlayerData = await getAllPlayers();

    const locationInAllPlayerData = allPlayerData.find((a) => a.name == playerData.name)!;
    const index = allPlayerData.indexOf(locationInAllPlayerData);

    const placement = generatePlacementString(index + 1, 2);
    placement.replace('#0', 'Unknown placement');

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
        throw new RangeError('Parameter `players` must be at least 1');
    }

    if (playerCount > 30) {
        throw new RangeError('Parameter `players` must be less than 30');
    }

    if (offset < 0) {
        throw new RangeError('Parameter `offset` cannot be negative');
    }

    const allPlayers = await getAllPlayers();

    allPlayers.splice(0, offset);

    const topPlayers = allPlayers.splice(0, playerCount);

    if (!allPlayers) {
        throw new InvocationError('No list of players match given criteria');
    }

    const output: string[] = [];

    for (const [index, player] of topPlayers.entries()) {
        const placement = index + offset + 1;
        const placementString = generatePlacementString(placement);

        output.push(`${placementString} \`${player.name}\` with ${player.rank} points`);

        if (placement === 3) {
            output.push('');
        }
    }

    await replyToInteraction(interaction, {
        content: output.join('\n'),
    });
};

/** Function for `/ranked register`. */
const rankedRegister = async (interaction: Interaction) => {
    const user = await bot.helpers.getMember(HOME_GUILD_ID, interaction.user.id);
    const discordUser = DiscordUser.parse(user.nick || interaction.user.username);
    const username = discordUser.username;

    let exists = true;

    try {
        await getPlayerByNameOrId(username);
    } catch (error) {
        if (error instanceof HttpError && error.code === 404) {
            exists = false;
        } else {
            throw new InvocationError(
                `Failed to check for existing players with the name "${username}"`
            );
        }
    }

    if (exists) {
        await replyToInteraction(interaction, {
            content: '🏆  You are already signed up for ranked gameplay',
            ephemeral: true,
        });

        return;
    }

    let points = -1;

    const guild = await bot.helpers.getGuild(HOME_GUILD_ID);

    for (const roleId of user.roles) {
        const role = guild.roles.get(roleId);
        const rolePoints = leagueNameToRank(role?.name || '');

        if (rolePoints > points) {
            points = rolePoints;
        }
    }

    if (points === -1) {
        points = leagueNameToRank('neophyte');
    }

    const newPlayer = new NewLunaroPlayer(username, points);

    await createPlayer(newPlayer);

    await replyToInteraction(interaction, {
        content: '🏆  Successfully signed you up to ranked gameplay',
    });
};

/** Function for `/ranked submit`. */
const rankedSubmit = async (interaction: Interaction) => {
    const playerAId = interaction.data?.options
        ?.find((option) => option.name === 'submit')
        ?.options?.find((option) => option.name === 'player-a')?.value as string;

    const playerBId = interaction.data?.options
        ?.find((option) => option.name === 'submit')
        ?.options?.find((option) => option.name === 'player-b')?.value as string;

    const playerAPing = interaction.data?.options
        ?.find((option) => option.name === 'submit')
        ?.options?.find((option) => option.name === 'player-a-ping')?.value as number;

    const playerBPing = interaction.data?.options
        ?.find((option) => option.name === 'submit')
        ?.options?.find((option) => option.name === 'player-b-ping')?.value as number;

    const playerAScore = interaction.data?.options
        ?.find((option) => option.name === 'submit')
        ?.options?.find((option) => option.name === 'player-a-score')?.value as number;

    const playerBScore = interaction.data?.options
        ?.find((option) => option.name === 'submit')
        ?.options?.find((option) => option.name === 'player-b-score')?.value as number;

    const evidenceId = interaction.data?.options
        ?.find((option) => option.name === 'submit')
        ?.options?.find((option) => option.name === 'evidence')?.value as string;

    if (playerAId === undefined) {
        throw new InvocationError('Missing option `player-a`');
    }

    if (playerBId === undefined) {
        throw new InvocationError('Missing option `player-b`');
    }

    if (playerAPing === undefined) {
        throw new InvocationError('Missing option `player-a-ping`');
    }

    if (playerBPing === undefined) {
        throw new InvocationError('Missing option `player-b-ping`');
    }

    if (playerAScore === undefined) {
        throw new InvocationError('Missing option `player-a-score`');
    }

    if (playerBScore === undefined) {
        throw new InvocationError('Missing option `player-b-score`');
    }

    if (playerAId === playerBId) {
        throw new InvocationError('A match must be played between two distinct players');
    }

    if (playerAPing === 0 && playerBPing === 0) {
        throw new RangeError('A match cannot have two hosts (ping == 0)');
    }

    if (playerAScore === 0 || playerBScore === 0) {
        throw new RangeError(
            'Due to limitations of the way ranking is calculates, you cannot submit a match result where either player scored 0 points'
        );
    }

    let evidence: Attachment | undefined;

    if (evidenceId !== undefined) {
        evidence = interaction.data?.resolved?.attachments?.get(BigInt(evidenceId));

        if (evidence === undefined) {
            throw new InvocationError('Failed to fetch submitted attachment');
        }
    }

    throw new UnimplementedError('Command `/ranked submit` is not yet ready');
};
