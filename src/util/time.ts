// https://discord.com/developers/docs/reference#snowflakes
export const snowflakeToTimestamp = (snowflake: bigint): number => {
    const discordEpoch = 1420070400000;
    const millisecondsSinceDiscordEpoch = Number(snowflake >> 22n);

    return discordEpoch + millisecondsSinceDiscordEpoch;
};
