import {
    readActivityTrackingConfig,
    writeActivityTrackingConfig
} from ':util/data.ts';
import { log } from ':util/logger.ts';
import { Activity, Member } from 'discordeno';

/**
 * Checks for Lunaro in a list of activities. Looks for both Warframe itself and
 * [PyLunaroRPC](https://github.com/kozabrada123/PyLunaroRPC)
 *
 * @param activities to be checked
 * @returns whether any of the activities is Lunaro
 */
export const doActivitiesIncludeLunaro = (activities: Activity[]) => {
    const localizedLunaroName = ['lunaro', 'лунаро', '루나로'];

    const lunaroActivities = activities.filter((activity) => {
        const isWarframeLunaro =
            activity.name.toLowerCase() === 'warframe' &&
            localizedLunaroName.includes(activity.details?.toLowerCase() || '');

        const isPyLunaroRPC =
            activity.name.toLowerCase() === 'warframe: lunaro';

        return isWarframeLunaro || isPyLunaroRPC;
    });

    return lunaroActivities.length > 0;
};

/** Updates the activity tracking config to allow tracking globally. */
export const enableActivityTracking = () => {
    const data = readActivityTrackingConfig();
    data.enabled = true;
    writeActivityTrackingConfig(data);

    log('Enabled activity tracker');
};

/** Updates the activity tracking config to deny tracking globally. */
export const disableActivityTracking = () => {
    const data = readActivityTrackingConfig();
    data.enabled = false;
    writeActivityTrackingConfig(data);

    log('Disabled activity tracker');
};

/**
 * Adds a member to the activity tracking blocklist to disable tracking for
 * their account's activity.
 *
 * @param member to be blocklisted
 */
export const addMemberToTrackingBlocklist = (member: Member) => {
    const data = readActivityTrackingConfig();

    if (!data.blocklist.includes(member.id.toString())) {
        data.blocklist.push(member.id.toString());
        writeActivityTrackingConfig(data);

        log('Member added to activity tracking blocklist');
    }
};

/**
 * Removes a member to the activity tracking blocklist to resume tracking for
 * their account's activity.
 *
 * @param member to be blocklisted
 */
export const removeMemberFromTrackingBlocklist = (member: Member) => {
    const data = readActivityTrackingConfig();

    if (data.blocklist.includes(member.id.toString())) {
        data.blocklist = data.blocklist.filter(
            (entry) => entry !== member.id.toString()
        );
        writeActivityTrackingConfig(data);

        log('Member removed from activity tracking blocklist');
    }
};
