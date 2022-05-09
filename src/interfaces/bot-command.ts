import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface BotCommand {
    slashCommand: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}
