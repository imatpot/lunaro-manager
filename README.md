<p align="center">
  <img src="assets/lunaro-manager.png" height="100px">
</p>

<h1 align="center">Lunaro Manager</h1>

<p align="center">
  <i>
    Discord bot for managing <a href="https://warframe.fandom.com/wiki/Lunaro">Lunaro</a>
    related ideas, targeted at the <a href="https://discord.gg/mUjGHEw">Lunaro Revival Server</a>
  </i>
</p>

<p align="center">
  <a href="https://deno.land" style="text-decoration: none">
    <img src="https://img.shields.io/badge/built%20with-deno-black?logo=deno&style=flat-square">
  </a>
  <a href="LICENSE.md" style="text-decoration: none">
    <img src="https://img.shields.io/github/license/imatpot/lunaro-tracking-bot?color=blue&style=flat-square">
  </a>
</p>

---

## Invite

Replace your client ID and keep the scopes. The bot is designed to only be active in 1 server at a time.

https://discord.com/api/oauth2/authorize?permissions=277293894656&scope=bot%20applications.commands&client_id=123

Please make sure the bot's personal role is ranked *above* the managed RTP role!

---

## Usage

```php
# Display help message to author
/help

# Force-run tracker and show how many players are active
/tracker scan

# Pause or resume tracking of the author's activity
/tracker pause
/tracker resume

# Manually join or leave RTP role
/rtp join
/rtp leave

# Display link to GitHub repository
/contribute

# Display runtime bot stats
/about



### INTENDED FOR ADMINS ONLY, CONFIGURE IN SERVER ACCORDINGLY ###

# Enable or disable tracker via [enabled]
/config tracker-enabled [enabled: bool]

# Configure interval in [seconds] in which tracker should scan automatically.
# Minimum is 5.
/config tracker-interval [seconds: int]
```

---

## Local Setup

1. Create a bot on https://discord.com/developers

2. Enable `PRESENCE` & `SERVER MEMBERS` intents in the Bot section

3. Create a `.env` file following the example of [.env.example](.env.example)

4. Run the bot

## Run directly

You need to have [Deno](https://deno.land) installed. Cache the dependencies to
make compilation faster later on.

```sh
$ deno cache deps.ts
```

Then start the bot

```sh
$ deno task start
$ deno task start:watch   # during development
```

## Run in Docker

```sh
$ docker-compose up --build -d
```
