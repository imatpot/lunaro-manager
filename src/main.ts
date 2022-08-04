import { bot } from ':src/bot.ts';
import { HOME_GUILD_ID } from ':src/env.ts';
import { log } from ':util/logger.ts';
import { startBot } from 'discordeno';

for await (const entry of Deno.readDir('src/events')) {
    if (entry.isFile && entry.name.endsWith('.ts')) {
        log('Loading file src/events/' + entry.name);
        await import(':events/' + entry.name);
    }
}

for await (const entry of Deno.readDir('src/commands')) {
    if (entry.isFile && entry.name.endsWith('.ts')) {
        log('Loading file src/commands/' + entry.name);
        await import(':commands/' + entry.name);
    }
}

log('Deploying application commands');
await bot.helpers.upsertApplicationCommands(bot.commands.array(), HOME_GUILD_ID);

log('Logging in');
await startBot(bot);
