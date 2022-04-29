import { log } from ':util/logger';
import { Collection, Interaction } from 'discord.js';
import { BotCommand } from '../interfaces/bot-command';

export async function interactionCreate(
    interaction: Interaction,
    commands: Collection<string, BotCommand>
) {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.run(interaction);
    } catch (error) {
        await interaction.reply({
            content: '❌  Failed to run the command.\n```\n' + error.stack + '\n```',
            ephemeral: true,
        });

        log(error.stack);
    }
}
