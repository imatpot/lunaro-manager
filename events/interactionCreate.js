module.exports = {
    interactionCreate: async (interaction, client) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.run(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Failed to run the command.\n```\n' + error + '\n```',
                ephemeral: true,
            });
        }
    },
};
