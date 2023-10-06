use chrono::{DateTime, Utc};
use poise::command;
use serde::Deserialize;

use crate::{
    env::Environment,
    traits::config_file::ConfigFile,
    types::{error::Error, poise::PoiseContext},
    util::activity_tracking,
};

/// Commit data from GitHub's API.
#[derive(Deserialize)]
struct GitHubCommit {
    /// The actual commit.
    commit: Commit,
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

    let tracking_config = activity_tracking::Config::instance().await;
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

    let latest_commit_date = match latest_commits.first() {
        Some(commit) => format!("<t:{}:R>", commit.commit.committer.date.timestamp()),
        None => "[unknown date]".to_string(),
    };

    let uptime = format!("<t:{}:R>", context.data().started_at.timestamp());

    context
        .send(|reply| {
            reply.content(
                [
                    format!("🔎  Tracking activity of {tracked_member_count} members"),
                    String::new(),
                    format!("📦  Bot {bot_version}"),
                    format!("🦀  Rust Compiler {rustc_version}"),
                    format!("⚙️  Serenity {serenity_version} + Poise {poise_version}"),
                    format!("🚧  Last updated {latest_commit_date}",),
                    format!("⏱️  Instance went online {uptime}"),
                ]
                .join("\n"),
            )
        })
        .await?;

    Ok(())
}
