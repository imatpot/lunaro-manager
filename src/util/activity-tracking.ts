import {
    readActivityTrackerData,
    writeActivityTrackingData,
} from ':util/data.ts';
import { log } from ':util/logger.ts';
import { Member, Activity } from 'discordeno';

const localizedLunaroName = ['lunaro', 'лунаро', '루나로'];

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

    if (!data.blocklist.includes(member.id.toString())) {
        data.blocklist.push(member.id.toString());
        writeActivityTrackingData(data);

        log('Member added to activity tracking blocklist');
    }
};

export const removeMemberFromTrackingBlocklist = (member: Member) => {
    const data = readActivityTrackerData();

    if (data.blocklist.includes(member.id.toString())) {
        data.blocklist = data.blocklist.filter(
            (entry) => entry !== member.id.toString()
        );
        writeActivityTrackingData(data);

        log('Member removed from activity tracking blocklist');
    }
};
