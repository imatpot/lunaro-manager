import { interactionCreate } from ':events/interactionCreate';
import { BotCommand } from ':interfaces/bot-command';
import { log } from ':util/logger';
import { deployCommands } from 'deploy-commands';
import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
});

const commands = new Collection<string, BotCommand>();
const commandDir = join(__dirname, 'commands');
const commandFiles = readdirSync(commandDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => join(commandDir, file));

for (const file of commandFiles) {
    import(file).then((importee) => {
        const command = new importee.default();
        commands.set(command.config.name, command);
    });
}

client.on('interactionCreate', (interaction) =>
    interactionCreate(interaction, commands)
);

client.once('ready', async () => {
    await deployCommands(commands);
    log('Lunaro Manager is ready');
});

client.login();
