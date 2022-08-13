import { HttpError } from ':error/http-error.ts';
import { LunaroMatch, NewLunaroMatch } from ':interfaces/lunaro-match.ts';
import { LunaroPlayer, NewLunaroPlayer } from ':interfaces/lunaro-player.ts';
import { RANK_API_TOKEN, RANK_API_URL } from ':src/env.ts';

/**
 * Sorts a list of players first by their rank, and then by their name.
 *
 * @param players unsorted list
 * @returns a sorted list
 */
const sortByRankAndName = (players: LunaroPlayer[]): LunaroPlayer[] => {
    const compareRank = (a: LunaroPlayer, b: LunaroPlayer) => (a.rank < b.rank ? 1 : -1);

    const compareName = (a: LunaroPlayer, b: LunaroPlayer) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;

    return players.sort((a, b) => {
        return a.rank == b.rank ? compareName(a, b) : compareRank(a, b);
    });
};

/** Converts a number to a league name. */
export const rankToLeagueName = (rank: number): string => {
    if (rank < 1500) {
        return 'Neophyte';
    }

    if (rank < 1750) {
        return 'Padawan';
    }

    if (rank < 2000) {
        return 'Amateur';
    }

    if (rank < 2250) {
        return 'Skilled';
    }

    if (rank < 2500) {
        return 'Pro';
    }

    if (rank < 2750) {
        return 'Master';
    }

    return 'Champion';
};

/** Converts a leagze name to a number. */
export const leagueNameToRank = (league: string): number => {
    switch (league.toLowerCase()) {
        case 'champion':
            return 2875;
        case 'master':
            return 2625;
        case 'pro':
            return 2375;
        case 'skilled':
            return 2125;
        case 'amateur':
            return 1875;
        case 'padawan':
            return 1625;
        case 'neophyte':
            return 1250;
        default:
            return -1;
    }
};

/**
 * Fetches all players.
 * @returns the list of players
 * @throws if the request results in an error
 */
export const getAllPlayers = async (): Promise<LunaroPlayer[]> => {
    const resource = RANK_API_URL + '/api/players';
    const response = await fetch(resource);

    if (response.status !== 200) {
        throw new HttpError(response.status, await response.text());
    }

    const players: LunaroPlayer[] = JSON.parse(await response.text());

    return sortByRankAndName(players);
};

/**
 * Fetches the player with the given username or ID.
 *
 * @param nameOrId username or ID of the player
 * @returns the requested player
 * @throws if the request results in an error
 */
export const getPlayerByNameOrId = async (nameOrId: string): Promise<LunaroPlayer> => {
    const resource = RANK_API_URL + '/api/players/' + nameOrId;
    const response = await fetch(resource);

    if (response.status !== 200) {
        throw new HttpError(response.status, await response.text());
    }

    const player: LunaroPlayer = JSON.parse(await response.text());

    return player;
};

/**
 * Fetches all matches.
 * @returns the list of matches
 * @throws if the request results in an error
 */
export const getAllMatches = async (): Promise<LunaroMatch[]> => {
    const resource = RANK_API_URL + '/api/matches';
    const response = await fetch(resource);

    if (response.status !== 200) {
        throw new HttpError(response.status, await response.text());
    }

    const matches: LunaroMatch[] = JSON.parse(await response.text());

    return matches;
};

/**
 * Fetches the match with the given username or ID.
 *
 * @param id ID of the match
 * @returns the requested match
 * @throws if the request results in an error
 */
export const getMatchById = async (id: string): Promise<LunaroMatch> => {
    const resource = RANK_API_URL + '/api/matches/' + id;
    const response = await fetch(resource);

    if (response.status !== 200) {
        throw new HttpError(response.status, await response.text());
    }

    const match: LunaroMatch = JSON.parse(await response.text());

    return match;
};

/**
 * Creates a player in the database.
 *
 * @param player player to be created
 * @returns the created player
 * @throws if the request results in an error
 */
export const createPlayer = async (player: NewLunaroPlayer): Promise<LunaroPlayer> => {
    const resource = RANK_API_URL + '/api/players/add';

    const body = { ...player, token: RANK_API_TOKEN };

    const response = await fetch(resource, {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (response.status !== 201) {
        throw new HttpError(response.status, await response.text());
    }

    const createdPlayer: LunaroPlayer = JSON.parse(await response.text());

    return createdPlayer;
};

/**
 * Creates a match in the database.
 *
 * @param match match to be created
 * @returns the created match
 * @throws if the request results in an error
 */
export const createMatch = async (match: NewLunaroMatch): Promise<LunaroMatch> => {
    const resource = RANK_API_URL + '/api/matches/add';

    const body = { ...match, token: RANK_API_TOKEN };

    const response = await fetch(resource, {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (response.status !== 201) {
        throw new HttpError(response.status, await response.text());
    }

    const createdMatch: LunaroMatch = JSON.parse(await response.text());

    return createdMatch;
};
