import { RTP_ROLE_ID } from ':src/env.ts';
import { bot } from ':src/bot.ts';
import { doActivitiesIncludeLunaro } from ':util/activity-tracking.ts';
import { addMemberToRTP, removeMemberFromRTP } from ':util/rtp.ts';
import { readActivityTrackingConfig } from ':util/data.ts';
import { event } from ':util/logger.ts';

bot.events.presenceUpdate = async (_, presence) => {
    const activityTrackerData = readActivityTrackingConfig();

    if (!activityTrackerData.enabled) return;

    if (activityTrackerData.blocklist.includes(presence.user.id.toString())) {
        return;
    }

    const member = await bot.helpers.getMember(
        presence.guildId,
        presence.user.id
    );

    if (doActivitiesIncludeLunaro(presence.activities)) {
        event('Member started playing Lunaro');
        await addMemberToRTP(member);
    } else if (member.roles.includes(RTP_ROLE_ID)) {
        event('Member stopped playing Lunaro');
        await removeMemberFromRTP(member);
    }
};
