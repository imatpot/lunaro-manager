import { bot } from ':src/bot.ts';
import { InteractionReply } from ':interfaces/interaction-reply.ts';
import { Interaction, InteractionResponseTypes } from 'discordeno';

export const replyToInteraction = async (
    interaction: Interaction,
    reply: InteractionReply
) => {
    await bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: reply.content,

                // https://discord.com/developers/docs/change-log#march-5-2021
                flags: reply.ephemeral ? 64 : undefined,
            },
        }
    );
};
