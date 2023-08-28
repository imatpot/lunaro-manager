/**
 * Extracts the unix timestamp from a snowflake.
 * Snowflake spec: https://discord.com/developers/docs/reference#snowflakes
 *
 * @param snowflake containing the timestamp
 * @returns the unix timestamp
 */
export const snowflakeToTimestamp = (snowflake: bigint): number => {
    const discordEpoch = 1420070400000;
    const millisecondsSinceDiscordEpoch = Number(snowflake >> 22n);

    return discordEpoch + millisecondsSinceDiscordEpoch;
};
