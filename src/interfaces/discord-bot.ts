import { Command } from ':interfaces/command.ts';
import { Bot, Collection, CreateBotOptions } from 'discordeno';

/** Extension of discordeno's `Bot` class with a collection of commands. */
export interface DiscordBot extends Bot {
    commands: Collection<string, Command>;
}

/**
 * Extension of discordeno's `CreateBotOptions` class with a collection of
 * commands.
 */
export interface DiscordBotOptions extends CreateBotOptions {
    commands: Collection<string, Command>;
}
