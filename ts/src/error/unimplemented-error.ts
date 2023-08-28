/** Represents an HTTP error. */
export class UnimplementedError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }

    toString = () => `UnimplementedError: ${this.message}`;
}
