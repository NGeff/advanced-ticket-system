<div align="center">

# 🎫 Discord Ticket System

**A professional, self-hosted ticket management bot for Discord servers**

[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Author](https://img.shields.io/badge/author-Ghostzinn07-ff6b6b?style=flat-square)](https://github.com/NGeff)

</div>

---

## ✨ Features

- **Full ticket lifecycle** — create, claim, close, reopen, and transfer tickets
- **Customizable panels** — deploy a persistent ticket panel in any channel
- **Role-based access** — separate staff, support, and admin role tiers
- **Auto-close** — automatically close tickets after N days of inactivity
- **Full transcripts** — saves complete message history on ticket close
- **Bulk actions** — close all open tickets or purge old closed records at once
- **Per-guild configuration** — every server has its own independent settings
- **Multi-language ready** — built-in i18n with custom message overrides
- **Rate limiting** — per-user command throttling to prevent spam
- **Structured logging** — daily rotating log files with configurable log levels

---

## 📋 Commands

### 🎫 Tickets

| Command | Description |
|---|---|
| `/ticket create` | Redirect to the ticket panel |
| `/ticket close [motivo]` | Close the current ticket |
| `/ticket reopen <id>` | Reopen a previously closed ticket |
| `/ticket claim` | Assign yourself to the current ticket |
| `/ticket unclaim` | Release the current ticket |
| `/ticket add <user>` | Add a user to the ticket channel |
| `/ticket remove <user>` | Remove a user from the ticket channel |
| `/ticket transfer <category>` | Move ticket to another category |
| `/ticket stats` | View server ticket statistics |
| `/ticket list [status]` | List open or closed tickets |
| `/ticket info` | View details of the current ticket |

### ⚙️ Configuration (Admin)

| Command | Description |
|---|---|
| `/config categoria <channel>` | Set the ticket category |
| `/config logs <channel>` | Set the log channel |
| `/config idioma <lang>` | Change server language |
| `/config comandos` | Toggle slash / prefix commands |
| `/config prefix <prefix>` | Set the command prefix |
| `/config cargo-staff <role>` | Add a staff role |
| `/config cargo-suporte <role>` | Add a support role |
| `/config remover-cargo <role>` | Remove a configured role |
| `/config max-tickets <n>` | Set max open tickets per user |
| `/config auto-fechar` | Toggle and configure auto-close |
| `/config transcripts` | Toggle transcript saving |
| `/config ping-staff` | Toggle staff mentions on new tickets |
| `/config ver` | View all current settings |
| `/config resetar` | Reset all settings to default |

### 🚀 Utilities

| Command | Description |
|---|---|
| `/setup` | Quick first-time server setup |
| `/panel [channel]` | Deploy the ticket panel |
| `/actions fechar-todos` | Close all open tickets |
| `/actions deletar-fechados` | Purge all closed ticket records |
| `/actions limpar-inativos <days>` | Close tickets inactive for N days |
| `/ping` | Check bot and API latency |
| `/help` | Show all available commands |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22 or higher
- A [Discord Application](https://discord.com/developers/applications) with a bot token
- Bot permissions: `Manage Channels`, `Manage Messages`, `Send Messages`, `Embed Links`, `Read Message History`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NGeff/advanced-ticket-system.git
cd advanced-ticket-system

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here
OWNER_ID=your_discord_user_id_here

NODE_ENV=production
LOG_LEVEL=INFO
```

```bash
# 4. Start the bot
npm start
```

### First-time Setup (Discord)

1. Invite the bot to your server with the required permissions
2. Run `/setup` — this creates the ticket category and log channel automatically
3. Run `/config cargo-staff @YourStaffRole` to grant staff access
4. Run `/panel` in the channel where users should open tickets

---

## 📁 Project Structure

```
advanced-ticket-system/
├── src/
│   ├── commands/
│   │   ├── ticket.js       # All ticket & config slash commands
│   │   └── utility.js      # /help and /ping
│   ├── events/
│   │   ├── interactionCreate.js  # Buttons, modals, select menus
│   │   ├── messageCreate.js      # Activity tracking & prefix commands
│   │   └── ready.js              # Auto-close loop, cache cleanup
│   ├── utils/
│   │   ├── database.js     # JSON-based persistence layer
│   │   └── logger.js       # Logger, I18n, RateLimiter, helpers
│   └── index.js            # Entry point & bot bootstrap
├── data/                   # Auto-generated persistent data (gitignored)
├── logs/                   # Auto-generated daily logs (gitignored)
├── config.json             # i18n messages and default settings
├── .env.example            # Environment variable template
└── package.json
```

---

## ⚙️ Configuration

All per-server settings are stored automatically in `data/guilds.json`. The main `config.json` file holds the i18n message strings and shared defaults — you don't need to edit it manually.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BOT_TOKEN` | ✅ | Your Discord bot token |
| `CLIENT_ID` | ✅ | Your application's client ID |
| `OWNER_ID` | ✅ | Your Discord user ID |
| `NODE_ENV` | — | `production` or `development` |
| `LOG_LEVEL` | — | `DEBUG`, `INFO`, `WARN`, or `ERROR` (default: `INFO`) |

---

## 🗂️ Data Storage

advanced-ticket-system uses a lightweight JSON-based persistence layer — no database server required. All data is stored in the `data/` directory:

| File | Contents |
|---|---|
| `guilds.json` | Per-server configuration |
| `tickets.json` | All ticket records |
| `transcripts.json` | Closed ticket transcripts |
| `translations.json` | Translation cache |

> **Tip:** Add `data/` and `logs/` to your `.gitignore` to avoid committing sensitive data.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Ghostzinn07](https://github.com/NGeff)

</div>
