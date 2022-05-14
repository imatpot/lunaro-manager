import { DISCORD_TOKEN, BOT_ID } from ':src/env.ts';
import { createDiscordBot } from ':util/creators.ts';
import { Collection } from 'discordeno';

export const bot = createDiscordBot({
    botId: BigInt(BOT_ID),
    token: DISCORD_TOKEN,
    intents: ['Guilds', 'GuildMembers', 'GuildPresences'],

    commands: new Collection(),
    events: {},
});
