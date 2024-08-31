<p align="center">
  <img src="assets/lunaro-manager.png" height="100px">
</p>

<h1 align="center">Lunaro Manager</h1>

<p align="center">
  <i>
    Discord bot for managing everything <a href="https://warframe.fandom.com/wiki/Lunaro">Lunaro</a> for the <a href="https://discord.gg/rFBzmpEQxc">Academia Lunaris Discord Server</a>
  </i>
</p>

<p align="center">
  <a href="https://rust-lang.org" style="text-decoration: none">
    <img src="https://img.shields.io/badge/built%20with-Rust-orange?logo=rust&style=flat-square">
  </a>
  <a href="LICENSE.md" style="text-decoration: none">
    <img src="https://img.shields.io/github/license/imatpot/lunaro-manager?color=blue&style=flat-square">
  </a>
  <a href="https://discord.gg/rFBzmpEQxc" style="text-decoration: none">
    <img src="https://img.shields.io/badge/Join-Academia%20Lunaris-%237289da?logo=discord&style=flat-square">
  </a>
</p>

## Usage

> [!NOTE]
> Lunaro tracking is **enabled** for every server member by default.
>
> Lunaro Manager will react to changes in your Discord rich presence.
> It will automatically set your playing status to "Playing Lunaro" when you are playing Lunaro, and remove it with a small delay when you are not.
>
> You can disable Lunaro tracking for your account at any time using the [`/tracking pause`](#-tracking-pause) command.

### `❓ /help`

Guides to the Discord command explorer to discover all commands, and also links to this GitHub section.

### `🏓 /ping`

Check if Lunaro Manager is online and how long it took to receive the ping.
This value is calculated from the system time, and may thus be inaccurate.

### `🟢 /play now`

Adds the playing role to your profile.
You can optionally disable Lunaro tracking for your account at the same time.

### `⭕ /play later`

Removes the playing role from your profile.
You can optionally re-enable Lunaro tracking for your account at the same time.

### `👀 /play info`

Lists the number of members playing Lunaro.

### `💤 /tracking pause`

Disables Lunaro tracking for your account.

The bot will no longer react to changes in your Discord rich presence.
This is useful because the Lunaro tracker will otherwise override your manually set playing status.

### `👁️ /tracking resume`

Enables Lunaro tracking for your account.

The bot will now react to changes in your Discord rich presence.
Now you don't have to manually set your playing status anymore, as the bot will automatically check if you are playing Lunaro.

### `💡 /about`

Displays details about Lunaro Manager, including amount of actively tracked members as well as stats and metadata about the bot.

### `🤝 /contribute`

Displays a link to this GitHub page, encouraging the creation of issues and pull requests.

## Development setup

1. Create a bot on https://discord.com/developers

2. Enable `PRESENCE` & `SERVER MEMBERS` intents in the Bot section

3. Invite the bot to your server, giving the following permissions:
   - Manage Roles
   - Send Messages

4. Create a `.env` file following the schema in [.env.schema](.env.schema)

5. Run the bot using one of the methods below

## Running the bot

You can run the bot in several ways, depending on your preference and use case.

### Run locally

You need to have [Rust](https://rust-lang.org) installed.
This is the recommended way to run the bot during development.

```sh
$ cargo run
```

### Run in Docker

You need to have [Docker](https://docker.com) installed.
This is the recommended way to run the bot in production.

```sh
$ docker compose up --build -d
```

### Run using Nix

If you have the [Nix](https://nixos.org) package manager installed with [Flakes](https://nixos.wiki/wiki/Flakes) enabled, you have several ways to build and run this bot.

As a reminder:

- `nix build` builds the package binary
- `nix shell` builds the package binary and makes it available in your `$PATH`
- `nix run` builds the package binary and immediately executes it

I will use `nix run` as the example, but you can use any of the above.

```sh
# run from local repository. make sure Cargo.lock is available!
$ nix run

# run latest using remote repository
$ nix run github:imatpot/lunaro-manager

# run specific version using remote repository
$ nix run github:imatpot/lunaro-manager/2.1.0
```
