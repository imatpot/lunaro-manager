/** Ranked Lunaro player from the rank API. */
export interface LunaroPlayer {
    /** The unique identifier. */
    id: number;

    /** The normalized username. */
    name: string;

    /** The rank. */
    rank: number;
}

/** Request body for creating a new ranked Lunaro player in the rank API. */
export class NewLunaroPlayer {
    /** The normalized username. */
    name: string;

    /** The rank. */
    rank: number;

    constructor(name: string, rank: number = 1250) {
        this.name = name.toLocaleLowerCase();
        this.rank = rank;
    }
}
