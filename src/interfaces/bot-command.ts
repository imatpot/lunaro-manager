import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface BotCommand {
    config: SlashCommandBuilder;
    run: (interaction: CommandInteraction) => Promise<void>;
}
