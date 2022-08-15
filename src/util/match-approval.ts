import { PendingMatch } from ':interfaces/pending-match.ts';
import { bot } from ':src/bot.ts';
import { readPendingMatches, removePendingMatch, updatePendingMatch } from ':util/data.ts';
import { editMessageInChannel } from ':util/messages.ts';
import { createMatch } from ':util/rank-api.ts';

export const matchApprovedMessage = '✅  This match has been approved';
export const matchCancelledMessage = '❌  This match has been cancelled';
export const pendingMatchApprovalMessage =
    '⏳  This match is pending approval. Both players are requested to react with  ✅  to approve and finalize this match submission, or ract with  ❌  to boycott or cancel it';

/**
 * Checks for a pending match linked to a given message.
 *
 * @param channelId the message's channel's ID
 * @param messageId the message's ID
 * @returns the linked pending match or `undefined` if no match is linked
 */
export const pendingMatchOfMessage = (
    channelId: string,
    messageId: string
): PendingMatch | undefined => {
    const pendingMatches = readPendingMatches();

    return pendingMatches.find(
        (match) => match.message.channelId === channelId && match.message.id === messageId
    );
};

/**
 * Adds an user's approval to a match.
 *
 * @param match to be approved
 * @param approverId who approved the match
 */
export const addApproval = (match: PendingMatch, approverId: string): PendingMatch => {
    match.status.approved.push(approverId);

    updatePendingMatch(match);

    return match;
};

/**
 * Removes an user's approval from a match.
 *
 * @param match to be approved
 * @param approverId who approved the match
 */
export const removeApproval = (match: PendingMatch, approverId: string): PendingMatch => {
    match.status.approved = match.status.approved.filter((approver) => approver !== approverId);

    updatePendingMatch(match);

    return match;
};

/**
 * Adds an user's boycott to a match.
 *
 * @param match to be approved
 * @param boycotterId who boycotted the match
 */
export const addBoycott = (match: PendingMatch, boycotterId: string): PendingMatch => {
    match.status.boycotted.push(boycotterId);

    updatePendingMatch(match);

    return match;
};

/**
 * Removes an user's boycott from a match.
 *
 * @param match to be approved
 * @param boycotterId who approved the match
 */
export const removeBoycott = (match: PendingMatch, boycotterId: string): PendingMatch => {
    match.status.boycotted = match.status.boycotted.filter(
        (boycotter) => boycotter !== boycotterId
    );

    updatePendingMatch(match);

    return match;
};

/**
 * Finalized a submission and uploads the match to the API when all players
 * approve the match.
 *
 * @param match to be submitted
 */
export const finalizeSubmission = async (match: PendingMatch): Promise<void> => {
    const createdMatch = await createMatch(match.match);

    const message = await bot.helpers.getMessage(
        BigInt(match.message.channelId),
        BigInt(match.message.id)
    );

    let content = message.content.replace(pendingMatchApprovalMessage, matchApprovedMessage);

    content += [
        '\n',
        generateDeltaString(match.match.player_a, createdMatch.delta_a),
        generateDeltaString(match.match.player_b, createdMatch.delta_b),
    ].join('\n');

    await editMessageInChannel(BigInt(match.message.channelId), BigInt(match.message.id), {
        content,
    });

    removePendingMatch(match);
};

/**
 * Cancel a submission.
 * @param match to be cancelled
 */
export const cancelSubmission = async (match: PendingMatch): Promise<void> => {
    const message = await bot.helpers.getMessage(
        BigInt(match.message.channelId),
        BigInt(match.message.id)
    );

    const content = message.content.replace(pendingMatchApprovalMessage, matchCancelledMessage);

    await editMessageInChannel(BigInt(match.message.channelId), BigInt(match.message.id), {
        content,
    });

    removePendingMatch(match);
};

const generateDeltaString = (player: string, delta: number): string => {
    if (delta > 0) {
        return `🔺  ${player} gained ${delta} points`;
    } else if (delta < 0) {
        return `🔻  ${player} lost ${-delta} points`;
    } else {
        const possessiveS = player.endsWith('s') ? "'" : "'s";
        return `🔸  ${player}${possessiveS} rank did not change`;
    }
};
