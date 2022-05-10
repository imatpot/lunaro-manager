import { Command } from ':interfaces/command.ts';
import { Interaction } from 'harmony';
import { log } from ":util/logger.ts";

export default class implements Command {
    slash = { name: 'ping', description: '🏓 Check latency of Lunaro Manager' };

    async run(interaction: Interaction) {
        const ping = interaction.client.gateway.ping;
        await interaction.reply(`🏓  Current ping is ${ping}ms`);

        log(`Ping was ${ping}ms`);
    }
}
