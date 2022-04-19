const { config } = require('dotenv');

config();

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    TRACKED_GUILD_ID: process.env.TRACKED_GUILD_ID,
};
