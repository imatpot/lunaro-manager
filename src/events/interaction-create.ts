import { bot } from ':src/bot.ts';
import { getSubcommand } from ':util/commands.ts';
import { replyToInteraction } from ':util/interactions.ts';
import { error, event } from ':util/logger.ts';
import { InteractionTypes } from 'discordeno';

bot.events.interactionCreate = async (_, interaction) => {
    if (!interaction.data) return;

    if (interaction.type === InteractionTypes.ApplicationCommand) {
        const commandName = interaction.data.name;
        const subCommandName = getSubcommand(interaction);

        event(`Member ran /${commandName} ${subCommandName || ''}`);

        try {
            bot.commands.get(commandName)?.run(interaction);
        } catch (err) {
            await replyToInteraction(interaction, {
                content:
                    '❌  Sorry, something went wrong.\n```\n' + err + '\n```',
                ephemeral: true,
            });

            error(err.stack || err.message);
        }
    }
};
