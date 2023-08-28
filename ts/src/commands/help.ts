import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';

import { ApplicationCommandTypes } from 'discordeno';

createCommand({
    name: 'help',
    description: '❓ Learn how to use Lunaro Manager',
    type: ApplicationCommandTypes.ChatInput,

    run: async (interaction) => {
        const helpString = [
            "Swazdo-lah, surah! I'm the Lunaro Manager, and my job is to help you with all things Lunaro.",
            '',
            'Type `/` and use the sidebar to explore my capabilites, or check out the *Usage* section on my GitHub page:',
            'https://github.com/imatpot/lunaro-manager#usage',
        ].join('\n');

        await replyToInteraction(interaction, {
            content: helpString,
        });
    },
});
