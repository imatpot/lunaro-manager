import { PatternError } from ':error/pattern-error.ts';

/** Regex matching a Lunaro Revival Server username (formatted as `<username> [<platform>]`). */
const usernamePattern = /([A-Za-z0-9_.-]{4,24})\s\[(PC|XB1|PS4|SWI)\]/;

/** Represents a platform Warframe can be played on. */
type Platform = 'PC' | 'XB1' | 'PS4' | 'SWI';

/** A Lunaro Revival Server Discord user. */
export interface DiscordUser {
    /** The username / in-game name. */
    username: string;

    /** The player's primary platform. */
    platform: Platform;
}

/**
 * Parses a Lunaro Revival Server username.
 *
 * @param discordName the name to be parsed
 * @returns the corresponding user or null if the name cannot be parsed
 * @throws if the name cannot be parsed
 */
export const parseDiscordUsername = (name?: string): DiscordUser => {
    const matchGroups = name?.match(usernamePattern);
    const username = matchGroups?.[1];
    const platform = matchGroups?.[2];

    if (!username || !platform) {
        throw new PatternError(`Could not infer in-game username from display name "${name}"`);
    }

    return {
        username,
        platform: platform as Platform,
    };
};
