# Daily Play — WhatsApp Bot

A WhatsApp chatbot for Daily Play that lets players find games, create sessions, check in, earn XP, and see stats — all without installing an app.

---

## What the bot does

Players interact entirely through WhatsApp messages. The bot handles:

- **Registration** — multi-step profile creation (name, city, sports)
- **Find sessions** — browse open sessions in the player's city
- **Create sessions** — host a new game with guided multi-step flow
- **Join sessions** — join a session by number from the list
- **Check-in** — mark arrival at a session and earn XP + streaks
- **Stats** — view career card (level, XP, streak, achievements)
- **Venues** — list partner turfs and courts in the player's city
- **Tournaments** — browse upcoming tournaments and register a team
- **Leaderboard** — see top players in the city
- **Scheduled broadcasts** — weekly leaderboard (Monday 9AM) and daily challenge (8AM)

---

## Prerequisites

1. **Node.js** v18+ and **npm**
2. A **Twilio account** with WhatsApp Sandbox access
3. **ngrok** (or any tunnel) to expose your local server for Twilio webhooks

---

## Twilio WhatsApp Sandbox setup

1. Log in to [Twilio Console](https://console.twilio.com)
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. Follow the instructions to join the sandbox (send the join code from your phone)
4. Set the **When a message comes in** webhook URL to:
   ```
   https://<your-ngrok-subdomain>.ngrok.io/webhook
   ```
5. Make sure the method is **HTTP POST**

---

## Environment setup

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
PORT=3000
DB_PATH=./db.json
```

- `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` — from your [Twilio Console dashboard](https://console.twilio.com)
- `TWILIO_WHATSAPP_FROM` — the sandbox number (default: `whatsapp:+14155238886`)
- `DB_PATH` — path to the JSON database file (created automatically on first run)

---

## Running locally

### Install dependencies

```bash
cd whatsapp-bot
npm install
```

### Development (hot reload)

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

---

## Exposing via ngrok

In a separate terminal:

```bash
ngrok http 3000
```

Copy the HTTPS forwarding URL (e.g. `https://abc123.ngrok.io`) and set it as your Twilio webhook:

```
https://abc123.ngrok.io/webhook
```

---

## Command reference

| User says | What happens |
|-----------|-------------|
| `hi` / `hello` / `start` | Welcome message or profile check |
| `register` | Start multi-step registration |
| `play` / `sessions` | List open sessions in your city |
| `create` | Host a new session (guided flow) |
| `join 2` | Join session #2 from the list |
| `checkin` | Check in at today's session + earn XP |
| `stats` | View your career card |
| `venues` | Partner turfs in your city |
| `tournaments` | List upcoming tournaments |
| `register tournament 1` | Register a team for tournament #1 |
| `leaderboard` | Top players in your city |
| `help` | Full command list |

---

## Data storage

The bot uses a simple JSON file (`db.json`) for storage — no database setup required.

**Schema:**
- `players[]` — registered players with XP, streak, level, and session history
- `sessions[]` — created sessions with current players and check-in records

---

## XP system

| Action | XP |
|--------|-----|
| Session check-in (base) | +75 |
| 3+ day streak | +25 |
| 7+ day streak | +50 |
| 4+ players in session | +25 (social bonus) |
| Before 7 AM | +25 (early bird) |
| Achievement unlock | varies (+100 to +2000) |

Levels: `floor(totalXP / 200) + 1`, capped at 50. Titles progress from Rookie → Newcomer → Regular → Club Player → Dedicated → Enthusiast → Veteran → Elite → Master → Legend → GOAT.

---

## Scheduled broadcasts

The scheduler (`src/scheduler/index.ts`) sends two types of automated messages:

- **Weekly leaderboard** — every Monday at 9 AM to all registered players in each city
- **Daily challenge** — every day at 8 AM to all registered players

These require the bot to be running continuously and Twilio credentials to be configured.

---

## Connecting to the web app (future)

The bot and the React web app (`/src`) currently share the same data shapes (venues, tournaments, achievement definitions) but use separate storage. To connect them:

1. Move `db.json` to a shared location or migrate to a real database (PostgreSQL, Supabase, etc.)
2. The web app's Zustand store (`/src/store`) would need to be replaced with API calls to a shared backend
3. Players registered via WhatsApp would instantly appear in the web app leaderboard and vice versa

---

## File structure

```
whatsapp-bot/
  src/
    index.ts              — Express server entry point
    webhook.ts            — POST /webhook handler
    commands/
      index.ts            — Message router
      register.ts         — Multi-step registration
      sessions.ts         — List open sessions
      create.ts           — Create session flow
      join.ts             — Join a session
      checkin.ts          — Check in + XP award
      stats.ts            — Career stats card
      venues.ts           — Partner venues list
      tournaments.ts      — Tournament listing + team registration
      leaderboard.ts      — City leaderboard with seeded players
      help.ts             — Command list
    store/
      db.ts               — JSON file read/write + typed CRUD
      players.ts          — Player creation + XP helpers
      sessions.ts         — Session queries
    data/
      venues.ts           — Seeded partner venues
      tournaments.ts      — Seeded tournaments
      achievements.ts     — Achievement definitions
    utils/
      xp.ts               — XP, level, streak calculations
      twilio.ts           — sendMessage helper
      formatter.ts        — WhatsApp text formatting utilities
      parser.ts           — Natural language command parser + date parser
    scheduler/
      index.ts            — node-cron scheduled broadcasts
```
