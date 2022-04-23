const { Client, Collection, Intents } = require('discord.js');
const { readdirSync } = require('node:fs');
const { DISCORD_TOKEN, TRACKED_GUILD_ID } = require('./environment');
const { deployCommands } = require('./deploy-commands');
const { interactionCreate } = require('./events/interactionCreate');
const {
    isTrackerEnabled,
    enableTracker,
    enablePeriodicTracking,
    disableTracker,
} = require('./util/state');
const { log } = require('./util/logger');

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

    if (isTrackerEnabled()) {
        enableTracker(client.guilds.cache.get(TRACKED_GUILD_ID), client);
        log('Lunaro Tracker will launch enabled.');
    } else {
        disableTracker(client);
        log('Lunaro Tracker will launch disabled.');
    }

    log('Lunaro Tracker is ready.');
});

client.login(DISCORD_TOKEN);
