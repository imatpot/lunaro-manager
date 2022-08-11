import { bot } from ':src/bot.ts';
import { event } from ':util/logger.ts';

bot.events.reactionAdd = async (_, reaction) => {
    event(`Reaction ${reaction.emoji.name} added to ${reaction.messageId}`);
    await null;
};
