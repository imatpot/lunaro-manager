const { RTP_ROLE_ID } = require('../environment');
const { fetchLunaroPlayers, fetchRTPMembers } = require('./lunaroPlayers');

module.exports = {
    fetchRTPRole: (guild) =>
        guild.roles.cache.find((role) => role.id === RTP_ROLE_ID),

    updateRTP: async (guild) => {
        const whitelist = readWhitelist();

        const lunaroPlayers = await fetchLunaroPlayers(guild);
        for (const player of lunaroPlayers) {
            if (whitelist.includes(player.id)) {
                player.roles.add(module.exports.fetchRTPRole(guild));
            }
        }

        const rtpMembers = await fetchRTPMembers(guild);
        for (const member of rtpMembers) {
            if (whitelist.includes(member.id)) {
                if (!lunaroPlayers.includes(member)) {
                    member.roles.remove(module.exports.fetchRTPRole(guild));
                }
            }
        }

        log('Updated RTP.');
    },
};
