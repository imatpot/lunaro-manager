import { interactionCreate } from ':events/interactionCreate';
import { BotCommand } from ':interfaces/bot-command';
import { log } from ':util/logger';
import { deployCommands } from 'deploy-commands';
import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { join, resolve } from 'path';

log('Starting Lunaro Manager');

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
});

const commands = new Collection<string, BotCommand>();
const commandDir = resolve('./dist/commands');
const commandFiles = readdirSync(commandDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => join(commandDir, file));

log(JSON.stringify(commandFiles));

for (const file of commandFiles) {
    const importedFile = await import(file);
    const command: BotCommand = new importedFile.default();
    commands.set(command.slashCommand.name, command);
}

client.on('interactionCreate', (interaction) =>
    interactionCreate(interaction, commands)
);

client.once('ready', async () => {
    await deployCommands(commands);
    log('Lunaro Manager is ready');
});

await client.login();
