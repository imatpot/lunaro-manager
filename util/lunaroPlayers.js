const { RTP_ROLE_ID } = require('../environment');
const { log } = require('./logger');
const { fetchRTPRole } = require('./rtpRole');
const { readWhitelist } = require('./whitelist');

module.exports = {
    fetchAvailablePlayers: async (guild) =>
        module.exports
            .fetchLunaroPlayers(guild)
            .concat(await module.exports.fetchRTPMembers(guild))
            .filter(unique),

    fetchLunaroPlayers: (guild) =>
        guild.presences.cache
            .filter(
                (presence) =>
                    presence.activities.filter(
                        (activity) =>
                            activity.name.toLowerCase().includes('warframe') &&
                            (activity.details
                                ?.toLowerCase()
                                .includes('lunaro') ||
                            activity.details
                                ?.toLowerCase()
                                .includes('лунаро'))
                    ).length
            )
            .map((presence) => presence.member),

    fetchRTPMembers: async (guild) => {
        const guildMembers = await guild.members.fetch();
        return Array.from(guildMembers.values()).filter((member) =>
            member._roles.includes(RTP_ROLE_ID)
        );
    },

    updateRTP: async (guild) => {
        const whitelist = readWhitelist();

        const lunaroPlayers = await module.exports.fetchLunaroPlayers(guild);
        for (const player of lunaroPlayers) {
            if (whitelist.includes(player.id)) {
                player.roles.add(fetchRTPRole(guild));
            }
        }

        const rtpMembers = await module.exports.fetchRTPMembers(guild);
        for (const member of rtpMembers) {
            if (whitelist.includes(member.id)) {
                if (!lunaroPlayers.includes(member)) {
                    member.roles.remove(fetchRTPRole(guild));
                }
            }
        }

        log('Updated RTP.');
    },
};

const unique = (value, index, self) => self.indexOf(value) === index;
