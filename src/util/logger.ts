// https://stackoverflow.com/a/41407246/11592858

function green(content: string): string {
    return `\x1b[32m${content}\x1b[0m`;
}

function blue(content: string): string {
    return `\x1b[34m${content}\x1b[0m`;
}

function red(content: string): string {
    return `\x1b[31m${content}\x1b[0m`;
}

function print(content: string, color: (content: string) => string) {
    const now = new Date();

    const hh = doubleDigit(now.getHours());
    const mm = doubleDigit(now.getMinutes());
    const ss = doubleDigit(now.getSeconds());

    const time = [hh, mm, ss].join(':');
    const timestamp = color(`${time}`);

    console.log(`${timestamp} | ${content}`);
}

function doubleDigit(num: number): string {
    return num.toString().padStart(2, '0');
}

export function log(content: string) {
    print(content, green);
}

export function event(content: string) {
    print(content, blue);
}

export function error(content: string) {
    print(content, red);
}
