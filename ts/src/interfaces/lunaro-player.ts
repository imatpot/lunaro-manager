/** Ranked Lunaro player from the rank API. */
export interface LunaroPlayer {
    /** The unique identifier. */
    id: number;

    /** The username. */
    name: string;

    /** The rank. */
    rank: number;
}

/** Request body for creating a new ranked Lunaro player in the rank API. */
export interface NewLunaroPlayer {
    /** The username. */
    name: string;

    /** The rank. */
    rank: number;
}
