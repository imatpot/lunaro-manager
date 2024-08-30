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
  <a href="https://rust-lang.org" style="text-decoration: none">
    <img src="https://img.shields.io/badge/built%20with-Rust-orange?logo=rust&style=flat-square">
  </a>
  <a href="LICENSE.md" style="text-decoration: none">
    <img src="https://img.shields.io/github/license/imatpot/lunaro-manager?color=blue&style=flat-square">
  </a>
</p>

---

## Invite

This bot is readily available in the [Lunaro Revival Discord Server](https://discord.gg/mUjGHEw).

<a href="https://discord.gg/mUjGHEw" style="text-decoration: none">
  <img src="https://img.shields.io/badge/Join-Lunaro%20Revival%20Server-%237289da?logo=discord&style=flat-square">
</a>

<br />

In case you want to add this bot to a different server, use the following link:

https://discord.com/api/oauth2/authorize?permissions=277293894656&scope=bot%20applications.commands&client_id=123

while inserting your client ID and keeping the scopes. Remember that the bot is
designed to *only be active in 1 server at a time.*

Please also make sure the bot's personal role is ranked *above* the managed playing role!

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

### `🟢 /play now`

Adds the configured playing role to your profile.
You can optionally disable Lunaro tracking for your account at the same time.

### `⭕ /play later`

Removes the configured playing role from your profile.
You can optionally re-enable Lunaro tracking for your account at the same time.

### `👀 /play info`

Lists the number of members with the playing role.

### `💤 /tracking pause`

Disables Lunaro tracking for your account. This is useful because the Lunaro
tracker will otherwise override your manually set playing status.

### `👁️ /tracking resume`

Enables Lunaro tracking for your account. Now you don't have to manually set
your playing status anymore.

### `💡 /about`

Displays details about Lunaro Manager, including amount of actively tracked
members as well as stats and metadata about the bot.

### `🤝 /contribute`

Displays a link to this GitHub page, encouraging the creation of issues and
pull requests.

---

## Setup

1. Create a bot on https://discord.com/developers

2. Enable `PRESENCE` & `SERVER MEMBERS` intents in the Bot section

3. Create a `.env` file following the example of [.env.example](.env.example)

4. Run the bot (see next sections)

## Running the bot

### Run locally

You need to have [Rust](https://rust-lang.org) installed.

```sh
$ cargo run
```

### Run using Nix

If you have the [Nix](https://nixos.org) package manager installed, and enabled
[Flakes](https://nixos.wiki/wiki/Flakes), you have several ways to build and run
this bot.

As a reminder:

- `nix build` builds the package binary
- `nix run` builds the package binary and immediately executes it
- `nix shell` builds the package binary and makes it available in your shell

I will use `nix run` as the example, but you can use any of the above.

```sh
# run from local repository. make sure Cargo.lock is available!
$ nix run

# run latest using remote repository
$ nix run github:imatpot/lunaro-manager

# run specific version using remote repository
$ nix run github:imatpot/lunaro-manager/2.0.0
```

### Run in Docker

```sh
$ docker-compose up --build -d
```
