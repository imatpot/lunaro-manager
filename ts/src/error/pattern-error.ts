/** Represents an error in a given pattern. */
export class PatternError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }

    toString = () => `PatternError: ${this.message}`;
}
