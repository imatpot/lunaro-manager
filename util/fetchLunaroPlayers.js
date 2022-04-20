module.exports = {
    fetchLunaroPlayers: async (interaction) =>
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
};
