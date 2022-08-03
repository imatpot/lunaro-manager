import {
    ApplicationCommandOption,
    ApplicationCommandTypes,
    Interaction
} from 'discordeno';

/** Configuration for a slash command. */
export interface Command {
    /** The name of the command. */
    name: string;

    /** The description of the command. */
    description: string;

    /** The type of the command. */
    type: ApplicationCommandTypes;

    /** The options of the command. */
    options?: ApplicationCommandOption[];

    /**
     * The function to be executed when the command is called.
     * @param interaction the command invocation
     */
    run: (interaction: Interaction) => Promise<void>;
}

/** Maps subcommand names to corresponding functions. */
export type SubcommandMap = {
    [subcommand: string]: (interaction: Interaction) => Promise<void>;
};
