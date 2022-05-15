import { createCommand } from ':util/creators.ts';
import { replyToInteraction } from ':util/interactions.ts';

import { ApplicationCommandTypes } from 'discordeno';

createCommand({
    name: 'contribute',
    description: "🤝 Let's work together",
    type: ApplicationCommandTypes.ChatInput,

    run: async (_, interaction) => {
        const contributionString = [
            `🤝  Feel like helping out? Create an issue or pull request on GitHub:`,
            'https://github.com/imatpot/lunaro-manager',
        ].join('\n');

        await replyToInteraction(interaction, {
            content: contributionString,
        });
    },
});
