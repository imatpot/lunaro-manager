import { RTP_ROLE_ID, HOME_GUILD_ID } from ':src/env.ts';
import { bot } from ':src/bot.ts';
import { log } from ':util/logger.ts';
import { Member } from 'discordeno';

export const addMemberToRTP = async (member: Member) => {
    await bot.helpers.addRole(HOME_GUILD_ID, member.id, RTP_ROLE_ID);
    log('Added member to RTP');
};

export const removeMemberFromRTP = async (member: Member) => {
    await bot.helpers.removeRole(HOME_GUILD_ID, member.id, RTP_ROLE_ID);
    log('Removed member from RTP');
};
