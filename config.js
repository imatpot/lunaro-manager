const { config } = require('dotenv');

config();

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    PREFIXES: process.env.PREFIXES.split(','),
    OWNERS: process.env.OWNERS.split(','),
    CLIENT_ID: process.env.CLIENT_ID,
    TRACKED_GUILD_ID: process.env.TRACKED_GUILD_ID,
};
