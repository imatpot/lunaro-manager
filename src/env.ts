import { config } from 'dotenv';

const environment = config();

export const DISCORD_TOKEN: string = environment.DISCORD_TOKEN;
export const BOT_ID = BigInt(environment.BOT_ID);
export const HOME_GUILD_ID = BigInt(environment.HOME_GUILD_ID);
export const RTP_ROLE_ID = BigInt(environment.RTP_ROLE_ID);
