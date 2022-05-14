import { bot } from ':src/bot.ts';
import { event } from ':util/logger.ts';
import { ActivityTypes } from 'discordeno';

bot.events.ready = (_, __) => {
    bot.helpers.editBotStatus({
        status: 'online',
        activities: [
            {
                type: ActivityTypes.Competing,
                createdAt: Date.now(),
                name: 'Lunaro',
            },
        ],
    });

    event('Lunaro Manager is online');
};
