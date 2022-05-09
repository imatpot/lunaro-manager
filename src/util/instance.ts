import { HOME_GUILD_ID, RTP_ROLE_ID } from 'environment';
import { client as indexClient } from 'index';

export const client = indexClient;
export const guild = await client.guilds.fetch(HOME_GUILD_ID);
export const rtpRole = await guild.roles.fetch(RTP_ROLE_ID);
