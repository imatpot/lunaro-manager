import { log } from ':util/logger';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Collection } from 'discord.js';
import { CLIENT_ID, DISCORD_TOKEN, TRACKED_GUILD_ID } from './environment';
import { BotCommand } from './interfaces/bot-command';

export async function deployCommands(commands: Collection<string, BotCommand>) {
    const request = new REST().setToken(DISCORD_TOKEN);
    const commandsJSON = commands.map((command) => command.config.toJSON());

    await request
        .put(Routes.applicationGuildCommands(CLIENT_ID, TRACKED_GUILD_ID), {
            body: commandsJSON,
        })
        .then(() => log('Deployed application commands'))
        .catch(log);
}
