import { bot } from ':src/bot.ts';
import { Command } from ':interfaces/command.ts';
import { DiscordBot, DiscordBotOptions } from ':interfaces/discord-bot.ts';
import { createBot } from 'discordeno';

export const createDiscordBot = (options: DiscordBotOptions): DiscordBot => {
    const newBot = createBot(options) as DiscordBot;
    newBot.commands = options.commands;

    return newBot;
};

export const createCommand = (command: Command) => {
    bot.commands.set(command.name, command);
};
