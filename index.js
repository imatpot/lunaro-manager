const { Client, Collection, Intents } = require('discord.js');
const { readdirSync } = require('node:fs');
const { DISCORD_TOKEN } = require('./environment');
const { deployCommands } = require('./deploy-commands');
const { interactionCreate } = require('./events/interactionCreate');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
});

client.commands = new Collection();

const commandFiles = readdirSync('./commands').filter((file) =>
    file.endsWith('.js')
);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on(
    'interactionCreate',
    async (interaction) => await interactionCreate(interaction, client)
);

client.once('ready', async () => {
    await deployCommands(client);
    console.log('Lunaro Tracker is ready.');
});

client.login(DISCORD_TOKEN);
