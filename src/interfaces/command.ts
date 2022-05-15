import { DiscordBot } from ':interfaces/discord-bot.ts';
import {
    ApplicationCommandOption,
    ApplicationCommandTypes,
    Interaction,
} from 'discordeno';

export interface Command {
    name: string;
    description: string;
    type: ApplicationCommandTypes;
    options?: ApplicationCommandOption[];

    run: (bot: DiscordBot, interaction: Interaction) => Promise<void>;
}

export type SubcommandMap = {
    [subcommand: string]:
        (bot: DiscordBot, interaction: Interaction) => Promise<void>;
};
