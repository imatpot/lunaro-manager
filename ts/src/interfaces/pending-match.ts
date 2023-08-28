import { NewLunaroMatch } from ':interfaces/lunaro-match.ts';

/** Reference to a bot's Discord message. */
interface MessageReference {
    /** ID of the message. */
    id: string;

    /** ID of the message's channel. */
    channelId: string;
}

/** Tracks the approval of users. */
interface ApprovalStatus {
    /** User IDs which must approve. */
    required: string[];

    /** User IDs which have approved. */
    approved: string[];

    /** User IDs which have boycotted. */
    boycotted: string[];
}

/** Represents a pending match which has not been fully approved yet. */
export interface PendingMatch {
    /** The message containing the match details. */
    message: MessageReference;

    /** The approval progress. */
    status: ApprovalStatus;

    /** The pending match. */
    match: NewLunaroMatch;

    /** User ID of the person who submitted the match. */
    submitter: string;
}
