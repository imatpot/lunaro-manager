import { rtpRole } from ':util/instance';
import { GuildMember } from 'discord.js';

export async function addMemberToRTP(member: GuildMember) {
    member.roles.add(rtpRole);
}

export async function removeMemberFromRTP(member: GuildMember) {
    member.roles.remove(rtpRole);
}
