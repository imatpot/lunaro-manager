/** Represents an HTTP error. */
export class HttpError extends Error {
    /** HTTP error code. */
    code: number;

    constructor(code: number, message: string) {
        super();
        this.message = message;
        this.code = code;
    }

    toString = () => `HttpError: ${this.code}: ${this.message}`;
}
