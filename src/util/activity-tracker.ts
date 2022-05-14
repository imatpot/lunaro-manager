import { RTP_ROLE_ID, HOME_GUILD_ID } from ':src/env.ts';
import { bot } from ':src/bot.ts';
import {
    readActivityTrackerData,
    writeActivityTrackingData,
} from ':util/fs.ts';
import { log } from ':util/logger.ts';
import { Member, Activity } from 'discordeno';

const localizedLunaroName = ['lunaro', 'лунаро', '루나로'];

export const getRTPMembers = async (): Promise<Member[]> => {
    const allMembers = await bot.helpers.getMembers(BigInt(HOME_GUILD_ID), {});
    const rtpMembers = allMembers
        .array()
        .filter((member) => member.roles.includes(BigInt(RTP_ROLE_ID)));

    return rtpMembers;
};

export const doActivitiesIncludeLunaro = (activities: Activity[]) => {
    const lunaroActivities = activities.filter(
        (activity) =>
            activity.name.toLowerCase() === 'warframe' &&
            localizedLunaroName.includes(activity.details?.toLowerCase() || '')
    );

    return lunaroActivities.length > 0;
};

export const enableActivityTracking = () => {
    const data = readActivityTrackerData();
    data.enabled = true;
    writeActivityTrackingData(data);

    log('Enabled activity tracker');
};

export const disableActivityTracking = () => {
    const data = readActivityTrackerData();
    data.enabled = false;
    writeActivityTrackingData(data);

    log('Disabled activity tracker');
};

export const addMemberToTrackingBlocklist = (member: Member) => {
    const data = readActivityTrackerData();

    if (!data.blocklist.includes(member.id)) {
        data.blocklist.push(member.id);
        writeActivityTrackingData(data);

        log('Member added to activity tracking blocklist');
    }
};

export const removeMemberFromTrackingBlocklist = (member: Member) => {
    const data = readActivityTrackerData();

    if (data.blocklist.includes(member.id)) {
        data.blocklist = data.blocklist.filter((entry) => entry !== member.id);
        writeActivityTrackingData(data);

        log('Member removed from activity tracking blocklist');
    }
};
