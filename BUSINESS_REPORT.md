# Daily Play — Business Report
**Version 1.0 | May 2026**

---

## 1. Executive Summary

Daily Play is a gamified offline sports platform for India's urban recreational athletes. We sit at the intersection of social sport, community, and local commerce — turning every colony cricket match, office badminton game, and gym session into a tracked, ranked, rewarding career.

**The core insight:** Millions of Indians play sports daily at local turfs, parks, and courts. None of it is tracked, rewarded, or connected. We build the layer that makes recreational sport feel like a career.

**Three-layer flywheel:**
1. **App** — gamified career tracking (XP, levels, achievements)
2. **Communities** — WhatsApp groups per sport, per locality
3. **Venues** — turf & ground partnerships as the offline anchor

Revenue flows through venue transactions and brand deals. Communities drive retention. The app drives identity.

---

## 2. The Problem

| Pain Point | Who Feels It |
|---|---|
| No record of your sporting life — wins, streaks, progress | Recreational players |
| No community connecting local players | Casual athletes |
| Turfs have no loyalty/engagement layer | Turf owners |
| Brands have no channel to reach active recreational players | Sports brands |
| No one organises local tournaments at scale | Players + turfs |

---

## 3. Product Suite

### 3.1 Daily Play App (Web + Mobile)
A gamified sports career tracker for Cricket, Badminton, and Pickleball (expanding to Gym, Football, PS5 Tournaments).

**Core loops:**
- **Daily:** Set scene → Play offline → Record result → Earn XP
- **Weekly:** Complete challenges → Climb leaderboard → Unlock achievements
- **Seasonal:** Accumulate records → Level up → Reach new title

**Gamification system:**
- 50 levels: Rookie → Apprentice → Amateur → Club Player → Semi-Pro → Pro → All-Star → Elite → Champion → Legend
- XP for every match, win bonuses, streak multipliers
- 20+ achievements with collectible badges
- Per-sport skill ratings (0–100)
- Daily seeded challenges
- Season records and career archives

**Sports supported (V1):** Cricket, Badminton, Pickleball
**Roadmap (V2):** Football, Table Tennis, Gym (PRs/sessions), Chess, PS5 Tournaments

---

### 3.2 WhatsApp Bot
Frictionless match logging via chat — no app needed. Key for users who won't install but will message.

**Commands:**
| User types | Bot does |
|---|---|
| `Register me as Rahul 🏏` | Creates profile, sends career link |
| `Cricket T20 won 145/3 vs 132` | Logs match, returns XP earned |
| `My stats` | Returns career card (level, W/L, streak) |
| `Challenge today?` | Returns today's daily challenge |
| `Leaderboard` | Returns top 5 in their community |
| `Find turf near me` | Returns partner turfs in their city |

**Tech stack:** Node.js + Twilio WhatsApp API / Meta Cloud API
**Integration:** Shares same database as app — XP and career sync across both

---

### 3.3 WhatsApp Communities (The Core Distribution Engine)

We build and manage hyper-local sports WhatsApp communities. One community per sport per locality.

**Community types:**

| Community | What happens inside |
|---|---|
| 🏏 Colony Cricket | Match scheduling, scorecards, player of the week |
| 🏸 Office Badminton | League tables, challenge posts, turf bookings |
| 🥒 Pickleball Hub | Player matching, session organising |
| 💪 Gym Squad | PR tracking, workout streaks, gym buddy matching |
| 🎮 PS5 Crew | Tournament brackets, game sessions |

**Growth model:**
- Seed 3–5 communities per city with 20–30 engaged players
- Bot auto-posts daily challenges, leaderboard updates, turf deals
- Organic spread through friends inviting friends
- Each community becomes a loyal, engaged micro-market

**Metro rollout order:**
1. Bangalore (tech-savvy, high disposable income, turf density)
2. Pune (college + corporate mix, high sports activity)
3. Mumbai (volume play, premium turfs)
4. Hyderabad (growing sports culture, large IT workforce)
5. Delhi NCR (massive market, cricket-heavy)
6. Chennai (badminton stronghold)
7. Kolkata (cricket-obsessed)

---

## 4. Turf & Ground Partnerships

Turfs are the physical backbone of Daily Play. Every partner turf becomes a community hub and a revenue source.

### 4.1 What Turfs Get
- **Free listing** on Daily Play venue directory
- **QR check-in kit** — poster + QR code for their ground; players scan to auto-start sessions
- **Venue leaderboard** — ranked players who've played at their turf
- **Analytics dashboard** — sessions per day, peak hours, sport breakdown
- **Featured placement** in app + WhatsApp communities
- **Official partner status** — co-branded Instagram posts, reels

### 4.2 What We Get
- Commission on every booking made through our platform (10–15%)
- Exclusive turf deals to offer our community (drives bookings through us)
- Physical presence — our QR and branding at the ground
- Word-of-mouth from turf staff recommending the app

### 4.3 Partnership Tiers

| Tier | Monthly fee | What they get |
|---|---|---|
| **Listed Partner** | Free | Directory listing, basic analytics |
| **Active Partner** | ₹999/mo | QR check-in, venue leaderboard, WhatsApp community posts |
| **Premium Partner** | ₹2,499/mo | All above + featured placements, priority in search, custom tournament hosting, dedicated account manager |

### 4.4 Target Turf Count
- Month 1–3: 10 turfs per city × 3 cities = 30 turfs
- Month 4–6: Expand to 7 cities = 150+ turfs
- Year 1 end: 500 partner turfs nationally

---

## 5. Revenue Streams

### Primary Revenue

**1. Turf Booking Commissions** *(10–15% per transaction)*
- Players book turfs through Daily Play
- We take 10–15% commission
- Average turf booking: ₹800–2,000
- At 500 turfs × 5 bookings/day × ₹1,200 avg × 12% = **₹1.3 Cr/month at scale**

**2. Premium Turf Partner Subscriptions** *(₹999–2,499/month)*
- SaaS fees from turf owners for analytics, branding, tournament tools
- 200 paying turfs × ₹1,500 avg = **₹30L/month**

### Secondary Revenue

**3. Brand Deals & Sponsorships**
- Sports brands: Yonex, SS Bat, Cosco, Nivia, Decathlon
- FMCG: Energy drinks (Monster, Sting), protein supplements
- Fintech: Fantasy sports apps (Dream11, MPL) — CPA deals
- Structure: Fixed deal + performance commission on app downloads/sign-ups
- Target: ₹5–25L per brand campaign

**4. Equipment Marketplace** *(affiliate + inventory)*
- Curated gear shop inside the app (bats, rackets, shoes, accessories)
- Affiliate model first (10–15% commission via partner stores)
- Transition to direct inventory once volume justifies it
- Potential: ₹50L+ GMV year 1

**5. Premium Subscription** *(₹99–199/month)*
- Advanced career analytics, private leaderboard for your group
- Tournament creation tools (bracket generator, prize pool manager)
- Custom achievement packs, profile themes
- Target: 5% of active users converting

**6. Tournament Organisation**
- We host city-level tournaments at partner turfs
- Entry fee: ₹200–500 per player
- Prize pool funded by brand sponsors
- We take 20% of entry fee pool + full sponsorship amount
- 1 tournament × 100 players × ₹300 = ₹6,000 per event (scales with frequency)

**7. Coaching Marketplace**
- Connect players with certified local coaches
- Coaches list availability; players book sessions
- We take 20% commission per booking
- Average coaching session: ₹500–1,500

**8. Corporate Packages**
- Office sport tournament organiser — we set it up end-to-end
- Target: Tech companies, large corporates for team-building events
- Package: ₹15,000–50,000 per corporate event
- Includes app accounts for all employees, tournament bracket, trophies

**9. Data & Insights** *(B2B, Year 2)*
- Aggregated, anonymised insights sold to sports brands and real estate developers
- "Where do 18–30 year olds play cricket in Bangalore?" — valuable data
- Minimum viable: ₹2–10L per insight report to a brand

**10. Merchandise**
- Daily Play branded gear (jerseys with player name + level, caps, kitbags)
- Personalised with your career stats (e.g. "Level 24 Pro Player")
- Print-on-demand, no inventory risk
- Strong aspirational product tied to gamification identity

---

## 6. Instagram Marketing Campaign

### Campaign Concept: *"Your Colony Has a Champion"*
Targeting: 18–35, male/female, metros, interests in cricket/badminton/fitness/sports games

### Content Pillars

| Pillar | Format | Cadence |
|---|---|---|
| **Career moments** — "POV: Your Daily Play level just hit Pro" | Reel | 3×/week |
| **Turf culture** — shots at partner turfs, local heroes | Carousel + Story | 2×/week |
| **Daily challenges** — today's challenge reveal | Story | Daily |
| **Community wins** — WhatsApp community scorecards, banter | Screenshots/Reels | 2×/week |
| **Brand collabs** — gear reviews, giveaways | Dedicated post | 1×/week |
| **UGC reposts** — players sharing career cards | Story reposts | Daily |

### City-Specific Hooks
- **Bangalore:** Office badminton league, tech park turfs
- **Mumbai:** Building society cricket, Marine Drive runs
- **Delhi:** Colony cricket tournaments, parks
- **Chennai:** Badminton temple — skill-level content heavy
- **Pune:** College tournaments, hostel match culture
- **Hyderabad:** HITEC City office sport scene

### Growth Tactics
- **Hashtag strategy:** #DailyPlay #ColonyCricket #OfficeLeague #[CityName]Sports
- **Micro-influencer seeding:** Local sports enthusiasts (10K–100K followers) in each city — barter deals
- **Instagram → WhatsApp funnel:** "Join your city's community → link in bio"
- **Streak content:** "Day 47 of my cricket streak" — aspirational narrative
- **Turf partner reposts:** Each partner turf posts from their page, tagging us

---

## 7. Go-to-Market Plan

### Phase 1: Seed (Month 1–3)
- Launch in **Bangalore** only
- Onboard 30 partner turfs
- Seed 10 WhatsApp communities (3 cricket, 3 badminton, 2 pickleball, 1 gym, 1 PS5)
- Target: 1,000 active users, 500 match sessions logged
- Instagram: 5,000 followers, 3 micro-influencer partnerships

### Phase 2: Expand (Month 4–6)
- Add **Pune + Hyderabad**
- WhatsApp bot live
- First brand deal signed (sports brand or energy drink)
- First city tournament (Bangalore)
- Target: 10,000 active users, 150 partner turfs

### Phase 3: Scale (Month 7–12)
- All 7 metro cities live
- Booking commission live on all partner turfs
- Corporate packages sold to 10 companies
- Target: 50,000 active users, 500 partner turfs, ₹20L+ monthly revenue

---

## 8. Key Metrics to Track

| Metric | Target (Month 6) | Target (Year 1) |
|---|---|---|
| Active users (WAU) | 5,000 | 50,000 |
| Partner turfs | 150 | 500 |
| Monthly sessions logged | 25,000 | 200,000 |
| WhatsApp community members | 10,000 | 100,000 |
| Monthly booking GMV | ₹15L | ₹1.5Cr |
| Monthly revenue | ₹3L | ₹30L+ |
| Day-30 retention | 40% | 50%+ |
| Avg sessions per active user/month | 8 | 12 |

---

## 9. Competitive Landscape

| Competitor | What they do | Our edge |
|---|---|---|
| Playo | Turf booking only | We add gamification + community + career |
| Hudle | Turf booking + sports profiles | We go deeper on gamification + WhatsApp |
| Dream11 | Fantasy sports | We track real offline play |
| Sportz Interactive | Data/tech for pro sports | We own the grassroots/recreational layer |
| None | Gamified offline career tracker | **This is our unique position** |

---

## 10. Team & What We Need

### To build now
- React/TypeScript developer (app is scaffolded — needs V2 features)
- Node.js developer (WhatsApp bot backend)
- Community manager (seed WhatsApp groups, manage daily content)
- Business development (turf outreach)

### To hire for scale
- City leads (each metro city)
- Brand partnerships manager
- Growth/performance marketer
- Data analyst

---

## 11. Roadmap

```
Q1 2026 (Now)
├── App V1 live (Cricket/Badminton/Pickleball career tracking)
├── WhatsApp bot V1 (match logging, stats)
├── Bangalore turf outreach (target 30 partners)
└── Instagram seeded (10 posts, 3 micro-influencers)

Q2 2026
├── Venue directory + QR check-in
├── WhatsApp communities seeded (Bangalore, Pune, Hyderabad)
├── Gym + Football added to app
├── First brand deal
└── Tournament hosting feature

Q3 2026
├── Booking commission live
├── All 7 metro cities
├── Corporate packages
├── Coaching marketplace beta
└── Premium subscription launch

Q4 2026
├── Equipment marketplace
├── City-level tournaments (prize pools)
├── Merchandise store
├── Data insights product (B2B)
└── Series A raise
```

---

## 12. The Vision

In 5 years, Daily Play is the **career OS for recreational sport in India**.

Every person who plays any sport — at any level — has a Daily Play career. Turfs run on our platform. Brands reach athletes through us. Local champions have identity, community, and recognition.

We don't compete with Dream11's fantasy or Playo's booking utility. We own the layer they can't: **the ongoing relationship between a player and their sporting life.**

---

*Document maintained in the Daily Play repository. Last updated: May 2026.*
