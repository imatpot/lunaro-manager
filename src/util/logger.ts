import { format } from 'date-fns';

export function log(content: string) {
    const timestamp = format(new Date(), '[HH:mm:ss]');
    console.log(`${timestamp} ${content}`);
}
