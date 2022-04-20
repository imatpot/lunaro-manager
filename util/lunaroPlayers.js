const { RTP_ROLE_ID } = require('../environment');

module.exports = {
    fetchAvailablePlayers: async (interaction) =>
        module.exports
            .fetchLunaroPlayers(interaction)
            .concat(await module.exports.fetchRTPMembers(interaction))
            .filter(unique),

    fetchLunaroPlayers: (interaction) =>
        interaction.guild.presences.cache
            .filter(
                (presence) =>
                    presence.activities.filter(
                        (activity) =>
                            activity.name.toLowerCase().includes('warframe') &&
                            activity.details?.toLowerCase().includes('lunaro')
                    ).length
            )
            .map((presence) => presence.member),

    fetchRTPMembers: async (interaction) => {
        const guildMembers = await interaction.guild.members.fetch();
        return Array.from(guildMembers.values()).filter((member) =>
            member._roles.includes(RTP_ROLE_ID)
        );
    },
};

const unique = (value, index, self) => self.indexOf(value) === index;
