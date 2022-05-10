import { config } from 'dotenv';

const environment = config();

export const DISCORD_TOKEN: string = environment.DISCORD_TOKEN;
export const CLIENT_ID: string = environment.CLIENT_ID;
export const HOME_GUILD_ID: string = environment.HOME_GUILD_ID;
export const RTP_ROLE_ID: string = environment.RTP_ROLE_ID;
