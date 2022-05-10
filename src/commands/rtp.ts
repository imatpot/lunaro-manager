import { Command } from ':interfaces/command.ts';
import { ApplicationCommandInteraction, SlashCommandOptionType } from 'harmony';
import { RTP_ROLE_ID } from ':src/env.ts';
import { log } from ':util/logger.ts';

export default class implements Command {
    slash = {
        name: 'rtp',
        description: '🟢 Manage RTP Status',
        options: [
            {
                name: 'join',
                description: '🟢 Join RTP',
                type: SlashCommandOptionType.SUB_COMMAND,
            },
            {
                name: 'leave',
                description: '⭕ Leave RTP',
                type: SlashCommandOptionType.SUB_COMMAND,
            },
        ],
    };

    async run(interaction: ApplicationCommandInteraction) {
        switch (interaction.subCommand) {
            case 'join':
                return await joinRTP(interaction);
            case 'leave':
                return await leaveRTP(interaction);
        }
    }
}

async function joinRTP(interaction: ApplicationCommandInteraction) {
    const member = interaction.member!;
    await member.roles.add(RTP_ROLE_ID);

    const name = member.displayName || member.user.username;
    await interaction.reply(`🟢  ${name} is now available for Lunaro`);

    log('Member added to RTP');
}

async function leaveRTP(interaction: ApplicationCommandInteraction) {
    const member = interaction.member!;
    await member.roles.remove(RTP_ROLE_ID);

    const name = member.displayName || member.user.username;
    await interaction.reply(`⭕  ${name} is no longer available for Lunaro`);

    log('Member removed from RTP');
}
