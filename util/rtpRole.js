const { RTP_ROLE_ID } = require('../environment');

module.exports = {
    fetchRTPRole: (guild) =>
        guild.roles.cache.find((role) => role.id === RTP_ROLE_ID),
};
