import { Command } from ':interfaces/command.ts';
import { Interaction, Collection } from 'harmony';
import { error, event } from ':util/logger.ts';

export async function interactionCreate(
    interaction: Interaction,
    commands: Collection<string, Command>
) {
    if (!interaction.isApplicationCommand()) return;

    const command = commands.get(interaction.data.name);
    if (!command) return;

    try {
        let requestedCommand = command.slash.name;

        if (interaction.subCommand) {
            requestedCommand += ` ${interaction.subCommand}`;
        }

        event(`Member ran ${requestedCommand}`);

        await command.run(interaction);
    } catch (error) {
        handleError(interaction, error);
    }
}

async function handleError(interaction: Interaction, err: Error) {
    await interaction.respond({
        content: '❌  Failed to run the command.\n```\n' + err + '\n```',
        ephemeral: true,
    });

    error(err.stack || err.message);
}
