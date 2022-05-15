import { bot } from ':src/bot.ts';
import { event } from ':util/logger.ts';
import { ActivityTypes } from 'discordeno';

export let readyTimestamp: number;

bot.events.ready = (_, __) => {
    readyTimestamp = Date.now();

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
