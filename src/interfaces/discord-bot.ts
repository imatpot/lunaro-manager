import { Command } from ':interfaces/command.ts';
import { Collection, CreateBotOptions, Bot } from 'discordeno';
// import { BotWithCache } from 'discordeno/plugins';

export interface DiscordBot extends Bot {
    commands: Collection<string, Command>;
}

export interface DiscordBotOptions extends CreateBotOptions {
    commands: Collection<string, Command>;
}
