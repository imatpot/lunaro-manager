import { log } from ':util/logger';
import { Collection, CommandInteraction, Interaction } from 'discord.js';
import { BotCommand } from '../interfaces/bot-command';

export async function interactionCreate(
    interaction: Interaction,
    commands: Collection<string, BotCommand>
) {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try { await command.execute(interaction); }
    catch (error) { handleError(interaction, error); }
}

async function handleError(interaction: CommandInteraction, error: Error) {
    await interaction.reply({
        content: '❌  Failed to run the command.\n```\n' + error + '\n```',
        ephemeral: true,
        fetchReply: true
    });

    log(error.stack);
}
