import { bot } from ':src/bot.ts';
import { BOT_ID } from ':src/env.ts';
import { event } from ':util/logger.ts';
import { addApproval, addBoycott, pendingMatchOfMessage } from ':util/match-approval.ts';

bot.events.reactionAdd = async (_, reaction) => {
    if (reaction.userId === BOT_ID) {
        // Ignore reactions the bot adds
        return;
    }

    const message = await bot.helpers.getMessage(reaction.channelId, reaction.messageId);
    const messageAuthor = message.authorId;

    if (messageAuthor !== BOT_ID) {
        // Ignore reactions to other users' messages
        return;
    }

    const linkedMatch = pendingMatchOfMessage(
        reaction.channelId.toString(),
        reaction.messageId.toString()
    );

    if (!linkedMatch) {
        // No match linked to this message
        return;
    }

    if (reaction.emoji.name === '✅') {
        addApproval(linkedMatch, reaction.userId.toString());
        // TODO: check if fully approved
    } else if (reaction.emoji.name === '❌') {
        addBoycott(linkedMatch, reaction.userId.toString());
        // TODO: check if cancelled
    }

    event(`Reaction ${reaction.emoji.name} added to ${reaction.messageId}`);
    await null;
};
