<p align="center">
  <img src="assets/lunaro-manager.png" height="100px">
</p>

<h1 align="center">Lunaro Manager</h1>

<p align="center">
  <i>
    Discord bot for managing <a href="https://warframe.fandom.com/wiki/Lunaro">Lunaro</a>
    related ideas, targeted at the <a href="https://discord.gg/mUjGHEw">Lunaro Revival Discord Server</a>
  </i>
</p>

<p align="center">
  <a href="https://deno.land" style="text-decoration: none">
    <img src="https://img.shields.io/badge/built%20with-deno-black?logo=deno&style=flat-square">
  </a>
  <a href="LICENSE.md" style="text-decoration: none">
    <img src="https://img.shields.io/github/license/imatpot/lunaro-manager?color=blue&style=flat-square">
  </a>
</p>

---

## Invite

This bot is readily available in the [Lunaro Revival Discord Server](https://discord.gg/mUjGHEw).

<a href="https://discord.gg/mUjGHEw" style="text-decoration: none">
  <img src="https://img.shields.io/badge/join-Lunaro%20Revival%20Server-%237289da?logo=discord&style=flat-square">
</a>

<br />

In case you want to add this bot to a different server, use the following link:

https://discord.com/api/oauth2/authorize?permissions=277293894656&scope=bot%20applications.commands&client_id=123

while inserting your client ID and keeping the scopes. Remember that the bot is
designed to *only be active in 1 server at a time.*

Please also make sure the bot's personal role is ranked *above* the managed RTP role!

---

## Usage

This section explains all functionality which Lunaro Manager offers. Every
action will be replied to with a (selectively ephemeral) message.

### `❓ /help`

Guides to the Discord command explorer to discover all commands, and also links
to this GitHub section.

### `🏓 /ping`

Check if Lunaro Manager is online and how long it took to receive the ping. This
value is calculated from the system time, and may thus be inaccurate.

### `🟢 /rtp join`

Adds the configured RTP role to your profile.

### `⭕ /rtp leave`

Removes the configured RTP role from your profile.

### `👀 /rtp info`

Lists the number of members with the RTP role.

### `⛔ /tracking pause`

Disables activity tracking for your account. This is useful because the activity
tracker will otherwise override your manually set RTP status.

### `⚡ /tracking resume`

Resumes activity tracking for your account.

### `🏅 /ranked view`

Displays the ranking data of a specific player.

### `🏆 /ranked top`

Displays a certain number of top-ranked players.

### `✍ /ranked register`

Signs you up to the ranking system.

### `🥍 /ranked submit`

Lets you submit a ranked match. Requires approval from the opponent.

### `💡 /about`

Displays details about Lunaro Manager, including

- Number of members whose activity is being tracked
- Deno, TypeScript and discordeno versions
- Time of last update (based on last commit to `main` branch)
- Current uptime

### `🤝 /contribute`

Displays a link to this GitHub page, encouraging the creation of issues and
pull requests.

### `🔎 /config activity-tracking [enabled: boolean]`

Globally enables or disabled activity tracking based on the `enabled` option.
*This Command is supposed to be admin-only. Please configure accordingly.*

---

## Setup

1. Create a bot on https://discord.com/developers

2. Enable `PRESENCE` & `SERVER MEMBERS` intents in the Bot section

3. Create a `.env` file following the example of [.env.example](.env.example)

4. Run the bot (see next sections)

## Running the bot

### Run locally

You need to have [Deno](https://deno.land) installed. Cache the dependencies to
make compilation faster later on.

```sh
$ deno cache src/**/*.ts   # deno task does not currently support globs
$ deno task start
```

During development, installing [`denon`](https://deno.land/x/denon) is highly
recommended for convenience.

```sh
$ deno task start:watch
```

### Run in Docker

```sh
$ docker-compose up --build -d
```
