// https://stackoverflow.com/a/41407246/11592858

const red = (content: string): string => {
    return `\x1b[31m${content}\x1b[0m`;
};

const green = (content: string): string => {
    return `\x1b[32m${content}\x1b[0m`;
};

const yellow = (content: string): string => {
    return `\x1b[33m${content}\x1b[0m`;
};

const print = (content: string, color: (content: string) => string) => {
    const now = new Date();

    const hh = doubleDigit(now.getHours());
    const mm = doubleDigit(now.getMinutes());
    const ss = doubleDigit(now.getSeconds());

    const time = [hh, mm, ss].join(':');
    const timestamp = color(`${time}`);

    console.log(`${timestamp} | ${content}`);
};

const doubleDigit = (num: number): string => {
    return num.toString().padStart(2, '0');
};

export const log = (content: string) => {
    print(content, green);
};

export const event = (content: string) => {
    print(content, yellow);
};

export const error = (content: string) => {
    print(content, red);
};
