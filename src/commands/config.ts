import { createCommand } from ':util/creators.ts';
import { getSubcommand } from ':util/commands.ts';
import { replyToInteraction } from ':util/interactions.ts';
import {
    enableActivityTracking,
    disableActivityTracking,
} from ':util/activity-tracking.ts';
import { SubcommandMap } from ':interfaces/command.ts';
import {
    ApplicationCommandTypes,
    ApplicationCommandOptionTypes,
    Interaction,
} from 'discordeno';

createCommand({
    name: 'config',
    description: '🤔 Configure Lunaro Manager',
    type: ApplicationCommandTypes.ChatInput,

    options: [
        {
            name: 'activity-tracking',
            description: '🔎 Enable or disable activity tracking',
            type: ApplicationCommandOptionTypes.SubCommand,
            required: false,
            options: [
                {
                    name: 'enabled',
                    description: 'Whether tracking should be enabled',
                    type: ApplicationCommandOptionTypes.Boolean,
                    required: true,
                },
            ],
        },
    ],

    run: async (interaction) => {
        const subcommand = getSubcommand(interaction);

        if (!subcommand) {
            throw new Error('Cannot execute /config without a subcommand');
        }

        const subcommands: SubcommandMap = {
            'activity-tracking': configActivityTracking,
        };

        await subcommands[subcommand](interaction);
    },
});

/** Function for `/config activity-tracking`. */
const configActivityTracking = async (interaction: Interaction) => {
    const shouldEnable = interaction.data?.options
        ?.find((option) => option.name === 'activity-tracking')
        ?.options?.find((option) => option.name === 'enabled')
        ?.value as boolean;

    if (shouldEnable === undefined) {
        throw new Error('Missing option `enabled`');
    }

    if (shouldEnable) {
        enableActivityTracking();

        await replyToInteraction(interaction, {
            content: `🔎  Activity tracking is now enabled`,
        });
    } else {
        disableActivityTracking();

        await replyToInteraction(interaction, {
            content: `🛑  Activity tracking is now disabled`,
        });
    }
};
