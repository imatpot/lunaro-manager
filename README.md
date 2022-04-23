<p align="center">
  <img src="assets/lunaro-tracker.png" height="100px">
</p>

<h1 align="center">Lunaro Tracker</h1>

<p align="center">
  <i>
    Discord bot for periodic tracking of <a href="https://warframe.fandom.com/wiki/Lunaro">Lunaro</a>
    players in the <a href="https://discord.gg/mUjGHEw">Lunaro Revival Server</a>
  </i>
</p>

<p align="center">
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/Built%20with-NodeJS-darkgreen?logo=node.js&style=flat-square">
  </a>
  <a href="LICENSE.md">
    <img src="https://img.shields.io/github/license/imatpot/lunaro-tracking-bot?style=flat-square">
  </a>
</p>

---

## Invite

Replace your client ID and keep the scopes. The bot is designed to only be active in 1 server at a time.

https://discord.com/api/oauth2/authorize?permissions=277293894656&scope=bot%20applications.commands&client_id=123

Please make sure the bot's personal role is ranked *above* the managed RTP role!

---

## Usage

```r
# Enable / disable Lunaro Tracker
# (1 min interval, disabled by default, admin only)
/tracker enable
/tracker disable

# Force-run Lunaro Tracking
/tracker scan

# Allow / deny Lunaro Tracking
# (denied by default)
/tracker allow
/tracker deny

# Join / leave "Ready To Play"
# Option `tracking` is optional to enable/disable future tracking
/rtp join [tracking: boolean]
/rtp leave [tracking: boolean]

# Request help
/help

# Request source code
/source
```

---

## Local Setup

1. Create a bot on https://discord.com/developers

2. Enable `PRESENCE` & `SERVER MEMBERS` intents in the Bot section

3. Create a `.env` file following the example of [.env.example](.env.example)

4. Run the bot

## Run directly

You need to have [NodeJS](https://nodejs.org) installed. Install the dependencies

```sh
npm ci
```

Start the bot

```sh
npm start
npm run watch   # for development
```

## Run in Docker

```sh
docker-compose up -d
```

## Development

For missing features, see [TODO.md](TODO.md)
