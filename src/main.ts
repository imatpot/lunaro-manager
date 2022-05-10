import { Client, GatewayIntents, Interaction, Collection } from 'harmony';
import { Command } from ':interfaces/command.ts';
import { DISCORD_TOKEN, CLIENT_ID, HOME_GUILD_ID } from ':src/env.ts';
import { interactionCreate } from ':events/interaction-create.ts';
import { log } from ':util/logger.ts';
import { ready } from ':events/ready.ts';

const client = new Client({
    id: CLIENT_ID,
    token: DISCORD_TOKEN,
    intents: [GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_PRESENCES],
});

log('Loading commands');
const commands = new Collection<string, Command>();

for await (const entry of Deno.readDir('src/commands')) {
    if (entry.isFile && entry.name.endsWith('.ts')) {
        const importedFile = await import(':commands/' + entry.name);
        const command: Command = new importedFile.default();

        commands.set(command.slash.name, command);
    }
}

log('Deploying commands');
for (const command of commands.values()) {
    client.interactions.commands.create(command.slash, HOME_GUILD_ID);
}

log('Deploying events');
client.once('ready', () => ready());
client.on('interactionCreate', (interaction: Interaction) =>
    interactionCreate(interaction, commands)
);

log('Connecting');
await client.connect();
