const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, DISCORD_TOKEN, TRACKED_GUILD_ID } = require('./config');

module.exports = {
    deployCommands: async (client) => {
        const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

        await rest
            .put(Routes.applicationGuildCommands(CLIENT_ID, TRACKED_GUILD_ID), {
                body: client.commands.map(command => command.data.toJSON()),
            })
            .then(() => console.log('Deployed application commands.'))
            .catch(console.error);
    },
};
