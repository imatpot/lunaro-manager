/** Represents an error while invoking a bot command. */
export class InvocationError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }

    toString = () => `InvocationError: ${this.message}`;
}
