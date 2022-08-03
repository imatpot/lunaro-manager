/** Ranked Lunaro match from the rank API. */
export interface LunaroMatch {
    /** The unique identifier. */
    id: number;

    /** Submission timestamp. */
    epoch: number;

    /** Unique identifier of player A. */
    player_a: number;

    /** Final score of player A. */
    a_score: number;

    /** Rank delta of player A. */
    a_delta: number;

    /** Unique identifier of player B. */
    player_b: number;

    /** Final score of player B. */
    b_score: number;

    /** Rank delta of player B. */
    b_delta: number;
}

/** Request body for creating a new ranked Lunaro player in the rank API. */
export class NewLunaroMatch {
    /** Unique identifier of player A. */
    player_a: number;

    /** Final score of player A. */
    a_score: number;

    /** Ping of player A. A ping of `0` means the player was the host of the match. */
    a_ping: number;

    /** Unique identifier of player B. */
    player_b: number;

    /** Final score of player B. */
    b_score: number;

    /** Ping of player B. A ping of `0` means the player was the host of the match. */
    b_ping: number;

    constructor(
        player_a: number,
        a_score: number,
        a_ping: number,
        player_b: number,
        b_score: number,
        b_ping: number
    ) {
        this.player_a = player_a;
        this.a_score = a_score;
        this.a_ping = a_ping;
        this.player_b = player_b;
        this.b_score = b_score;
        this.b_ping = b_ping;
    }
}
