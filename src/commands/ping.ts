import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';
import { snowflakeToTimestamp } from ':util/time.ts';
import { log } from ':util/logger.ts';

import { ApplicationCommandTypes } from 'discordeno';

createCommand({
    name: 'ping',
    description: '🏓 Check connection latency',
    type: ApplicationCommandTypes.ChatInput,

    run: async (_, interaction) => {
        const ping = Date.now() - snowflakeToTimestamp(interaction.id);

        log(interaction.id.toString())
        log(Date.now().toString())

        await replyToInteraction(interaction, {
            content: `🏓  Current ping is ${ping}ms`,
        });

        log(`Ping is ${ping}ms`);
    },
});
