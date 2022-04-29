const { RTP_ROLE_ID } = require('../environment');
const { readWhitelist } = require('./whitelist');

const localizedLunaro = ['lunaro', 'лунаро'];

module.exports = {
    fetchAvailablePlayers: async (guild) =>
        module.exports
            .fetchLunaroPlayers(guild)
            .concat(await module.exports.fetchRTPMembers(guild))
            .filter((player) => readWhitelist().includes(player.id))
            .filter(unique),

    fetchLunaroPlayers: (guild) =>
        guild.presences.cache
            .filter(
                (presence) =>
                    presence.activities.filter(
                        (activity) =>
                            activity.name.toLowerCase().includes('warframe') &&
                            localizedLunaro.includes(
                                activity.details?.toLowerCase()
                            )
                    ).length
            )
            .map((presence) => presence.member),

    fetchRTPMembers: async (guild) => {
        const guildMembers = await guild.members.fetch();
        return Array.from(guildMembers.values()).filter((member) =>
            member._roles.includes(RTP_ROLE_ID)
        );
    },
};

const unique = (value, index, self) => self.indexOf(value) === index;
