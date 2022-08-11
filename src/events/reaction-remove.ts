import { bot } from ':src/bot.ts';
import { event } from ':util/logger.ts';

bot.events.reactionRemove = async (_, reaction) => {
    event(`Reaction ${reaction.emoji.name} removed from ${reaction.messageId}`);
    await null;
};
