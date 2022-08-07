import { InteractionReply } from ':interfaces/interaction-reply.ts';
import { bot } from ':src/bot.ts';
import { Interaction, InteractionResponseTypes, Message } from 'discordeno';

/**
 * Replies to an interaction with a text message.
 * @param interaction to be replied to
 * @param reply to be replied with
 */
export const replyToInteraction = async (interaction: Interaction, reply: InteractionReply): Promise<Message | undefined> => {
    return await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
            content: reply.content,

            // https://discord.com/developers/docs/change-log#march-5-2021
            flags: reply.ephemeral ? 64 : undefined,
        },
    });
};
