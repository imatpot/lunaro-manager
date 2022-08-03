import { BOT_ID, DISCORD_TOKEN } from ':src/env.ts';
import { createDiscordBot } from ':util/creators.ts';
import { Collection } from 'discordeno';

/** Primary instance of the bot, shared across the project. */
export const bot = createDiscordBot({
    botId: BOT_ID,
    token: DISCORD_TOKEN,
    intents: ['Guilds', 'GuildMembers', 'GuildPresences'],

    commands: new Collection(),
    events: {},
});
