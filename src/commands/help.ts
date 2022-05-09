import { BotCommand } from ':interfaces/bot-command';
import { log } from ':util/logger';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default class implements BotCommand {
    slashCommand = new SlashCommandBuilder()
        .setName('help')
        .setDescription('🎓 Learn how to use Lunaro Manager');

    async execute(interaction: CommandInteraction) {
        await interaction.reply({
            content: '👋  Welcome to Lunaro Manager',
            ephemeral: true,
        });

        log('Author asked for help');
    }
}
