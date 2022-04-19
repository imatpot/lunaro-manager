<p align="center">
  <img src="assets/lunaro-tracker.png" height="100px">
</p>

<h1 align="center">Lunaro Tracker</h1>

<p align="center">
  <i>
    Discord bot for tracking <a href="https://warframe.fandom.com/wiki/Lunaro">Lunaro</a>
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

https://discord.com/api/oauth2/authorize?permissions=277293828096&scope=bot%20applications.commands&client_id=123

---

## Usage

todo

---

## Local Setup

Create a `.env` file following the example of [.env.example](.env.example)

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
