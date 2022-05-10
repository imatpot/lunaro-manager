import { SlashCommandPartial, ApplicationCommandInteraction } from 'harmony';

export interface Command {
    slash: SlashCommandPartial;
    run: (interaction: ApplicationCommandInteraction) => Promise<void>;
}
