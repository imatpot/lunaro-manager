use chrono::{DateTime, Utc};
use poise::{command, CreateReply};
use serde::Deserialize;

use crate::{
    env::Environment,
    traits::config_file::ConfigFile,
    types::{error::Error, poise::PoiseContext},
    util::lunaro_tracking,
};

/// Commit data from GitHub's API.
#[derive(Deserialize)]
struct GitHubCommit {
    /// The actual commit.
    commit: Commit,

    /// The URL to the commit on GitHub.
    html_url: String,
}

/// A Git commit.
#[derive(Deserialize)]
struct Commit {
    /// The commit's author.
    committer: Committer,
}

/// Git commit author information.
#[derive(Deserialize)]
struct Committer {
    /// The timestamp at which the commit was made.
    date: DateTime<Utc>,
}

/// 💡 View details about Lunaro Manager
#[command(slash_command, rename = "about")]
pub async fn run(context: PoiseContext<'_>) -> Result<(), Error> {
    let env = Environment::instance();

    let tracking_config = lunaro_tracking::Config::instance().await;
    let member_count = context
        .partial_guild()
        .await
        .unwrap()
        .members(context, None, None)
        .await?
        .len();

    let tracked_member_count = member_count - tracking_config.blocklist.len();

    let rustc_version = rustc_version_runtime::version().to_string();

    let bot_version = match env.cargo.get("lunaro_manager") {
        Some(pkg) => format!("v{}", pkg.version),
        None => "[unknown version]".to_string(),
    };

    let serenity_version = match env.cargo.get("serenity") {
        Some(pkg) => format!("v{}", pkg.version),
        None => "[unknown version]".to_string(),
    };

    let poise_version = match env.cargo.get("poise") {
        Some(pkg) => format!("v{}", pkg.version),
        None => "[unknown version]".to_string(),
    };

    let http = reqwest::Client::new();

    let latest_commit = http
        .get("https://api.github.com/repos/imatpot/lunaro-manager/commits?sha=main&per_page=1")
        .header("User-Agent", format!("lunaro-manager/{bot_version}"))
        .send()
        .await?
        .text()
        .await?;

    let latest_commits: Vec<GitHubCommit> = serde_json::from_str(&latest_commit)?;

    let latest_commit = match latest_commits.first() {
        Some(commit) => commit,
        None => return Err("No commits found".into()),
    };

    let commit_date = format!("<t:{}:R>", latest_commit.commit.committer.date.timestamp());
    let commit_url = &latest_commit.html_url;

    let uptime = format!("<t:{}:R>", context.data().started_at.timestamp());

    context
        .send(
            CreateReply::default().content(
                [
                    format!("🔎  Tracking Lunaro activity for {tracked_member_count} members"),
                    String::new(),
                    format!("📦  [Bot](<https://github.com/imatpot/lunaro-manager>) {bot_version}"),
                    format!("🦀  [Rust](<https://www.rust-lang.org/>) v{rustc_version}"),
                    format!("⚙️  [Serenity](<https://github.com/serenity-rs/serenity>) {serenity_version} / [Poise](<https://github.com/serenity-rs/poise>) {poise_version}"),
                    format!("🚧  [Last updated](<{commit_url}>) {commit_date}",),
                    String::new(),
                    format!("⏱️  Started online {uptime}"),
                ]
                .join("\n"),
            ),
        )
        .await?;

    Ok(())
}
