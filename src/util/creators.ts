import { Command } from ':interfaces/command.ts';
import { DiscordBot, DiscordBotOptions } from ':interfaces/discord-bot.ts';
import { bot } from ':src/bot.ts';
import { createBot } from 'discordeno';

/**
 * Creates and configures a Discord bot instance.
 * @param options for bot configuration
 * @returns the created instance
 */
export const createDiscordBot = (options: DiscordBotOptions): DiscordBot => {
    const newBot = createBot(options) as DiscordBot;
    newBot.commands = options.commands;

    return newBot;
};

/**
 * Adds a slash command to the global primary bot instance.
 * @param command to be created
 */
export const createCommand = (command: Command) => {
    bot.commands.set(command.name, command);
};
