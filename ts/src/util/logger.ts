/**
 * Turns text red.
 * @param content to be turned red.
 * @returns the same text, but red.
 */
const red = (content: string): string => {
    return `\x1b[31m${content}\x1b[0m`;
};

/**
 * Turns text green.
 * @param content to be turned green.
 * @returns the same text, but green.
 */
const green = (content: string): string => {
    return `\x1b[32m${content}\x1b[0m`;
};

/**
 * Turns text yellow.
 * @param content to be turned yellow.
 * @returns the same text, but yellow.
 */
const yellow = (content: string): string => {
    return `\x1b[33m${content}\x1b[0m`;
};

/**
 * Prints a string with timestamp in the following format: `hh:mm:ss | string`.
 * @param content to be printed
 * @param color is a function which returns a colored string
 */
const print = (content: string, color: (content: string) => string) => {
    const now = new Date();

    const hh = doubleDigit(now.getHours());
    const mm = doubleDigit(now.getMinutes());
    const ss = doubleDigit(now.getSeconds());

    const time = [hh, mm, ss].join(':');
    const timestamp = color(`${time}`);

    console.log(`${timestamp} | ${content}`);
};

/**
 * Convert a number to a string with two digits, adding a leading `0`.
 * @param num to be converted
 * @returns the number as a two-digit string
 */
const doubleDigit = (num: number): string => {
    return num.toString().padStart(2, '0');
};

/**
 * Log a string to the console.
 * @param content to be logged.
 */
export const log = (content: string) => {
    print(content, green);
};

/**
 * Log a string to the console, and format it as an event.
 * @param content to be logged.
 */
export const event = (content: string) => {
    print(content, yellow);
};

/**
 * Log a string to the console, and format it as an error.
 * @param content to be logged.
 */
export const error = (content: string) => {
    print(content, red);
};
