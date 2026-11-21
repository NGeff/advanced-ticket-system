# Discord Ticket System

A self-hosted ticket management bot for Discord servers, built with discord.js.

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord)](https://discord.js.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Description

A complete ticket lifecycle system for Discord: create, claim, close, reopen, and transfer tickets. Includes per-guild configuration, automatic closing after inactivity, full message transcripts, rate limiting, and structured logging. Data is persisted to JSON files under `data/`.

## Features

- Ticket lifecycle: create, claim, close, reopen, transfer
- Ticket panel deployable in any channel
- Role-based access: staff, support, and admin tiers
- Auto-close after configurable days of inactivity
- Full transcripts saved on ticket close
- Bulk actions: close all tickets, purge closed records, clean inactive tickets
- Per-guild independent configuration
- Multi-language support (pt-BR, en-US, es-ES)
- Rate limiting per user and command
- Daily rotating log files

## Requirements

- Node.js >= 22
- A Discord Application with bot token
- Bot permissions: `Manage Channels`, `Manage Messages`, `Send Messages`, `Embed Links`, `Read Message History`

## Installation

```bash
git clone https://github.com/NGeff/advanced-ticket-system.git
cd advanced-ticket-system
npm install
cp .env.example .env
```

Edit `.env`:

```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here
OWNER_ID=your_discord_user_id_here

DEFAULT_PREFIX=/
NODE_ENV=production
LOG_LEVEL=INFO
```

Start the bot:

```bash
npm start
```

## Usage

Invite the bot to your server, then run:

```bash
/setup
```

This creates the ticket category and log channel. Next:

```bash
/config cargo-staff @YourStaffRole
/panel
```

Deploy the panel in the channel where users should open tickets.

## Commands

### Tickets

| Command | Description |
|---------|-------------|
| `/ticket create` | Open the ticket panel |
| `/ticket close [reason]` | Close the current ticket |
| `/ticket reopen <id>` | Reopen a closed ticket |
| `/ticket claim` | Assign yourself to the current ticket |
| `/ticket unclaim` | Release the current ticket |
| `/ticket add <user>` | Add a user to the ticket |
| `/ticket remove <user>` | Remove a user from the ticket |
| `/ticket transfer <category>` | Move ticket to another category |
| `/ticket stats` | View server ticket statistics |
| `/ticket list [status]` | List open or closed tickets |
| `/ticket info` | View details of the current ticket |

### Configuration (Administrator)

| Command | Description |
|---------|-------------|
| `/config categoria <channel>` | Set ticket category |
| `/config logs <channel>` | Set log channel |
| `/config idioma <lang>` | Change server language |
| `/config comandos` | Toggle slash/prefix commands |
| `/config prefix <prefix>` | Set command prefix |
| `/config cargo-staff <role>` | Add staff role |
| `/config cargo-suporte <role>` | Add support role |
| `/config remover-cargo <role>` | Remove configured role |
| `/config max-tickets <n>` | Max open tickets per user |
| `/config auto-fechar` | Toggle auto-close |
| `/config transcripts` | Toggle transcript saving |
| `/config ping-staff` | Toggle staff mentions on new tickets |
| `/config ver` | View current settings |
| `/config resetar` | Reset settings to default |

### Utilities

| Command | Description |
|---------|-------------|
| `/setup` | Quick first-time server setup |
| `/panel [channel]` | Deploy the ticket panel |
| `/actions fechar-todos` | Close all open tickets |
| `/actions deletar-fechados` | Purge closed ticket records |
| `/actions limpar-inativos <days>` | Close inactive tickets |
| `/ping` | Check bot and API latency |
| `/help` | Show available commands |

## Project Structure

```
advanced-ticket-system/
├── .env.example
├── config.json
├── package.json
├── data/            # Auto-generated persistent data (gitignored)
├── logs/            # Auto-generated daily logs (gitignored)
└── src/
    ├── index.js
    ├── commands/
    │   ├── ticket.js
    │   └── utility.js
    ├── events/
    │   ├── interactionCreate.js
    │   ├── messageCreate.js
    │   └── ready.js
    └── utils/
        ├── database.js
        └── logger.js
```

> Add `data/` and `logs/` to your `.gitignore`.

## License

MIT © NGeff
