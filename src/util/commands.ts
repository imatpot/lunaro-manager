import { ApplicationCommandOptionTypes, Interaction } from 'discordeno';

/**
 * Extracts the name of a subcommand from an interaction.
 * @param interaction of which the subcommand should be extraced.
 * @returns the name of the subcommand, or `null` if no subcommand is specified
 */
export const getSubcommand = (interaction: Interaction): string | null => {
    if (!interaction.data) return null;
    if (!interaction.data.options) return null;
    if (!interaction.data.options[0]) return null;

    if (interaction.data.options[0]?.type !== ApplicationCommandOptionTypes.SubCommand) {
        return null;
    }

    return interaction.data.options[0].name;
};
