import { LunaroMatch, NewLunaroMatch } from ':interfaces/lunaro-match.ts';
import { LunaroPlayer, NewLunaroPlayer } from ':interfaces/lunaro-player.ts';
import { RANK_API_TOKEN, RANK_API_URL } from ':src/env.ts';

/**
 * Fetches all players.
 * @returns the list of players or `null` if an error occured
 */
export const getAllPlayers = async (): Promise<LunaroPlayer[] | null> => {
    const resource = RANK_API_URL + '/api/players';
    const response = await fetch(resource);

    if (response.status !== 200) return [];

    const players: LunaroPlayer[] = JSON.parse(await response.text());

    return players;
};

/**
 * Fetches the player with the given username or ID.
 *
 * @param nameOrId username or ID of the player
 * @returns the requested player or `null` if an error occured
 */
export const getPlayerByNameOrId = async (nameOrId: string): Promise<LunaroPlayer | null> => {
    const resource = RANK_API_URL + '/api/players/' + nameOrId;
    const response = await fetch(resource);

    if (response.status !== 200) return null;

    const player: LunaroPlayer = JSON.parse(await response.text());

    return player;
};

/**
 * Fetches all matches.
 * @returns the list of matches or `null` if an error occured
 */
export const getAllMatches = async (): Promise<LunaroMatch[] | null> => {
    const resource = RANK_API_URL + '/api/matches';
    const response = await fetch(resource);

    if (response.status !== 200) return null;

    const matches: LunaroMatch[] = JSON.parse(await response.text());

    return matches;
};

/**
 * Fetches the match with the given username or ID.
 *
 * @param id ID of the match
 * @returns the requested match or `null` if an error occured
 */
export const getMatchById = async (id: string): Promise<LunaroMatch | null> => {
    const resource = RANK_API_URL + '/api/matches/' + id;
    const response = await fetch(resource);

    if (response.status !== 200) return null;

    const match: LunaroMatch = JSON.parse(await response.text());

    return match;
};

/**
 * Creates a player in the database.
 *
 * @param player player to be created
 * @returns whether the creation was a success
 */
export const createPlayer = async (player: NewLunaroPlayer): Promise<boolean> => {
    const resource = RANK_API_URL + '/api/players/add';

    const body = { ...player, token: RANK_API_TOKEN };

    const response = await fetch(resource, {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (response.status !== 201) return false;

    return true;
};

/**
 * Creates a match in the database.
 *
 * @param match match to be created
 * @returns whether the creation was a success
 */
export const createMatch = async (match: NewLunaroMatch): Promise<boolean> => {
    const resource = RANK_API_URL + '/api/matches/add';

    const body = { ...match, token: RANK_API_TOKEN };

    const response = await fetch(resource, {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (response.status !== 201) return false;

    return true;
};
