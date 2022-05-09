import { BotCommand } from ':interfaces/bot-command';
import { addMemberToRTP, removeMemberFromRTP } from ':util/rtp-role';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';

export default class implements BotCommand {
    slashCommand = new SlashCommandBuilder()
        .setName('rtp')
        .setDescription('Manually manage RTP status')
        .addSubcommand((subcommand) =>
            subcommand.setName('join').setDescription('🟢 Join RTP')
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('leave').setDescription('⭕ Leave RTP')
        );

    async execute(interaction: CommandInteraction) {
        const subcommands = {
            join: joinRTP,
            leave: leaveRTP,
        };

        const subcommand = interaction.options.getSubcommand();
        await subcommands[subcommand](interaction);
    }
}

async function joinRTP(interaction: CommandInteraction) {
    addMemberToRTP(interaction.member as GuildMember);
}

async function leaveRTP(interaction: CommandInteraction) {
    removeMemberFromRTP(interaction.member as GuildMember);
}
