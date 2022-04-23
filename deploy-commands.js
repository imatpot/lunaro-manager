const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, DISCORD_TOKEN, TRACKED_GUILD_ID } = require('./environment');
const { log } = require('./util/logger');

module.exports = {
    deployCommands: async (client) => {
        const request = new REST().setToken(DISCORD_TOKEN);
        const commands = client.commands.map((command) =>
            command.data.toJSON()
        );

        await request
            .put(Routes.applicationGuildCommands(CLIENT_ID, TRACKED_GUILD_ID), {
                body: commands,
            })
            .then(() => log('Deployed application commands.'))
            .catch(log);
    },
};
