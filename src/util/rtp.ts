import { bot } from ':src/bot.ts';
import { HOME_GUILD_ID, RTP_ROLE_ID } from ':src/env.ts';
import { log } from ':util/logger.ts';
import { Member } from 'discordeno';

/**
 * Checks for all home guild's members with the configured ready-to-play role.
 * @returns an array of all members with the role
 */
export const getRTPMembers = async (): Promise<Member[]> => {
    const allMembers = await bot.helpers.getMembers(HOME_GUILD_ID, {});
    const rtpMembers = allMembers
        .array()
        .filter((member) => member.roles.includes(RTP_ROLE_ID));

    return rtpMembers;
};

/**
 * Adds the configured ready-to-play role to a given member.
 * @param member to add the role to
 */
export const addMemberToRTP = async (member: Member) => {
    await bot.helpers.addRole(HOME_GUILD_ID, member.id, RTP_ROLE_ID);
    log('Added member to RTP');
};

/**
 * Removes the configured ready-to-play role from a given member.
 * @param member to remove the role from
 */
export const removeMemberFromRTP = async (member: Member) => {
    await bot.helpers.removeRole(HOME_GUILD_ID, member.id, RTP_ROLE_ID);
    log('Removed member from RTP');
};
