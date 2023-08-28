import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';
import { log } from ':util/logger.ts';
import { snowflakeToTimestamp } from ':util/time.ts';

import { ApplicationCommandTypes } from 'discordeno';

createCommand({
    name: 'ping',
    description: '🏓 Check connection latency',
    type: ApplicationCommandTypes.ChatInput,

    run: async (interaction) => {
        const ping = Date.now() - snowflakeToTimestamp(interaction.id);

        await replyToInteraction(interaction, {
            content: `🏓  Current ping is ${ping}ms`,
        });

        log(`Ping is ${ping}ms`);
    },
});
