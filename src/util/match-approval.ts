import { PendingMatch } from ':interfaces/pending-match.ts';
import { readPendingMatches } from ':util/data.ts';

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
    const deboycottedMatch = removeBoycott(match, approverId);

    deboycottedMatch.approval.approved.push(approverId);
    return deboycottedMatch;
};

/**
 * Removes an user's approval from a match.
 *
 * @param match to be approved
 * @param approverId who approved the match
 */
export const removeApproval = (match: PendingMatch, approverId: string): PendingMatch => {
    match.approval.approved = match.approval.approved.filter((approver) => approver !== approverId);
    return match;
};

/**
 * Adds an user's boycott to a match.
 *
 * @param match to be approved
 * @param boycotterId who boycotted the match
 */
export const addBoycott = (match: PendingMatch, boycotterId: string): PendingMatch => {
    const disapprovedMatch = removeApproval(match, boycotterId);

    disapprovedMatch.approval.boycotted.push(boycotterId);
    return disapprovedMatch;
};

/**
 * Removes an user's boycott from a match.
 *
 * @param match to be approved
 * @param boycotterId who approved the match
 */
export const removeBoycott = (match: PendingMatch, boycotterId: string): PendingMatch => {
    match.approval.boycotted = match.approval.boycotted.filter(
        (boycotter) => boycotter !== boycotterId
    );

    return match;
};
