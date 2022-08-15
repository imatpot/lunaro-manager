import { bot } from ':src/bot.ts';
import { BOT_ID } from ':src/env.ts';
import { event } from ':util/logger.ts';
import {
    addApproval,
    addBoycott,
    cancelSubmission,
    finalizeSubmission,
    pendingMatchOfMessage
} from ':util/match-approval.ts';

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

    event(`Reaction ${reaction.emoji.name} added to ${reaction.messageId}`);

    const linkedMatch = pendingMatchOfMessage(
        reaction.channelId.toString(),
        reaction.messageId.toString()
    );

    if (!linkedMatch) {
        // No match linked to this message
        return;
    }

    if (reaction.emoji.name === '✅') {
        const approvedMatch = addApproval(linkedMatch, reaction.userId.toString());

        if (
            approvedMatch.status.required.every((requiredApproval) =>
                approvedMatch.status.approved.includes(requiredApproval)
            )
        ) {
            // Received all required approvals
            await finalizeSubmission(approvedMatch);
        }
    }

    if (reaction.emoji.name === '❌') {
        const boycottedMatch = addBoycott(linkedMatch, reaction.userId.toString());

        if (
            reaction.userId.toString() === linkedMatch.submitter ||
            boycottedMatch.status.required.every((requiredApproval) =>
                boycottedMatch.status.boycotted.includes(requiredApproval)
            )
        ) {
            // Submitter cancelled or all required approvals boycotted
            await cancelSubmission(linkedMatch);
        }
    }
};
