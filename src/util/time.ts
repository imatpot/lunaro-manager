// https://discord.com/developers/docs/reference#snowflakes
export const snowflakeToTimestamp = (snowflake: bigint): number => {
    const discordEpoch = 1420070400000n;
    const millisecondsSinceDiscordEpoch = snowflake >> 22n;

    return Number(discordEpoch + millisecondsSinceDiscordEpoch);
};
