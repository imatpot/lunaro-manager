import { bot } from ':src/bot.ts';
import { CreateMessage, Message } from 'discordeno';

/**
 * Sends a text message in a given channel.
 * @param channelId of the channel the message should be sent in
 * @param message to be sent
 * @returns the sent message
 */
export const sendMessageInChannel = async (channelId: string | bigint, message: CreateMessage): Promise<Message> => {
    return await bot.helpers.sendMessage(BigInt(channelId), message);
};
