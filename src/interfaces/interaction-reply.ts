/** Data to reply to an interaction with. */
export interface InteractionReply {
    /** The content of the text message. */
    content: string;

    /** Whether the message is ephemeral. */
    ephemeral?: boolean;
}
