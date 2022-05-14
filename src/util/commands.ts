import { Interaction, ApplicationCommandOptionTypes } from 'discordeno';

export const getSubcommand = (interaction: Interaction): string | null => {
    if (!interaction.data) return null;
    if (!interaction.data.options) return null;
    if (!interaction.data.options[0]) return null;

    if (
        interaction.data.options[0]?.type !==
        ApplicationCommandOptionTypes.SubCommand
    ) {
        return null;
    }

    return interaction.data.options[0].name;
};
