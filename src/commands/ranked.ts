import { SubcommandMap } from ':interfaces/command.ts';
import { getSubcommand } from ':util/commands.ts';
import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';
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
    await replyToInteraction(interaction, {
        content: '/ranked view',
        ephemeral: true,
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
