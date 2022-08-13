/** Ranked Lunaro match from the rank API. */
export interface LunaroMatch {
    /** The unique identifier. */
    id: number;

    /** Submission timestamp. */
    epoch: number;

    /** Unique identifier of player A. */
    player_a: number;

    /** Final score of player A. */
    score_a: number;

    /** Rank delta of player A. */
    delta_a: number;

    /** Unique identifier of player B. */
    player_b: number;

    /** Final score of player B. */
    score_b: number;

    /** Rank delta of player B. */
    delta_b: number;
}

/** Request body for creating a new ranked Lunaro player in the rank API. */
export interface NewLunaroMatch {
    /** Username of player A. */
    player_a: string;

    /** Final score of player A. */
    score_a: number;

    /** Ping of player A. A ping of `0` means the player was the host of the match. */
    a_ping: number;

    /** Username of player B. */
    player_b: string;

    /** Final score of player B. */
    score_b: number;

    /** Ping of player B. A ping of `0` means the player was the host of the match. */
    b_ping: number;
}
