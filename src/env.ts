import { config } from 'dotenv';

const environment = config();

/**
 * Token for connecting to the Discord API and client.
 * Contains the value of the `DISCORD_TOKEN` environment variable.
 */
export const DISCORD_TOKEN: string = environment.DISCORD_TOKEN;

/**
 * ID of the bot's client account.
 * Contains the value of the `BOT_ID` environment variable.
 */
export const BOT_ID = BigInt(environment.BOT_ID);

/**
 * ID of the guild in which the bot is supposed to be active.
 * Contains the value of the `HOME_GUILD_ID` environment variable.
 */
export const HOME_GUILD_ID = BigInt(environment.HOME_GUILD_ID);

/**
 * ID of the role to give to users who enter the RTP (ready-to-play) state.
 * Contains the value of the `RTP_ROLE_ID` environment variable.
 */
export const RTP_ROLE_ID = BigInt(environment.RTP_ROLE_ID);

/**
 * URL of the Lunaro ranking API.
 * Contains the value of the `RANK_API_URL` environment variable.
 */
export const RANK_API_URL = environment.RANK_API_URL;

/**
 * Token to access POST-endpoints in the Lunaro ranking API.
 * Contains the value of the `RANK_API_TOKEN` environment variable.
 */
export const RANK_API_TOKEN = environment.RANK_API_TOKEN;
