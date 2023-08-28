import { bot } from ':src/bot.ts';
import { BOT_ID } from ':src/env.ts';
import { event } from ':util/logger.ts';
import { pendingMatchOfMessage, removeApproval, removeBoycott } from ':util/match-approval.ts';

bot.events.reactionRemove = async (_, reaction) => {
    if (reaction.userId === BOT_ID) {
        // Ignore reactions the bot removes
        return;
    }

    const message = await bot.helpers.getMessage(reaction.channelId, reaction.messageId);
    const messageAuthor = message.authorId;

    if (messageAuthor != BOT_ID) {
        // Ignore reactions to other users' messages
        return;
    }

    event(`Reaction ${reaction.emoji.name} removed from ${reaction.messageId}`);

    const linkedMatch = pendingMatchOfMessage(
        reaction.channelId.toString(),
        reaction.messageId.toString()
    );

    if (!linkedMatch) {
        // No match linked to this message
        return;
    }

    if (reaction.emoji.name === '✅') {
        removeApproval(linkedMatch, reaction.userId.toString());
    } else if (reaction.emoji.name === '❌') {
        removeBoycott(linkedMatch, reaction.userId.toString());
    }

    await null;
};
