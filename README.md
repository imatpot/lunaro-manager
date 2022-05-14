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
    <img src="https://img.shields.io/github/license/imatpot/lunaro-tracking-bot?color=blue&style=flat-square">
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

```php
# Display help message
/help

# Pause or resume tracking of the member's activity
/tracking pause
/tracking resume

# Manually join or leave RTP role
/rtp join
/rtp leave

# Display RTP stats
/rtp info

# Display link to GitHub repository
/contribute

# Display runtime bot stats
/about



### INTENDED FOR ADMINS ONLY, CONFIGURE IN SERVER ACCORDINGLY ###

# Enable or disable activity tracking via [enabled]
/config tracking-enabled [enabled: bool]
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
$ deno task cache
```

Then start the bot

```sh
$ deno task start
```

For development, [`denon`](https://deno.land/x/denon) is highly recommended.

```sh
$ deno task start:watch
```

## Run in Docker

```sh
$ docker-compose up --build -d
```
