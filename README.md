# 🤖 AI-Powered ORM Dashboard

> Manage and respond to customer reviews with AI-powered reply suggestions.

A modern web dashboard that fetches Google Maps reviews, generates smart AI-powered reply suggestions using OpenAI, and allows you to approve responses — all from a single, beautiful interface.

## ✨ Features

- **📡 Fetch Reviews** — Enter a Google Maps Place ID to pull real customer reviews
- **🤖 AI-Generated Replies** — Get 3 AI suggestions per review (Standard, Friendly, Resolution)
- **✅ One-Click Approve** — Select the best reply and mark reviews as resolved
- **📊 Dashboard Stats** — Track pending vs resolved reviews at a glance
- **🎨 Premium Dark UI** — Glassmorphism design with smooth animations
- **📱 Responsive** — Works on desktop, tablet, and mobile

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **AI** | OpenAI GPT-4o-mini |
| **Deployment** | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account
- OpenAI API key

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ai-orm-dashboard
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Fill in your keys in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
GOOGLE_PLACES_API_KEY=AIza...  # Optional - sample data used if not set
```

### 3. Setup Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Open **SQL Editor**
4. Copy & run the SQL from `supabase/schema.sql`

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
src/
├── app/
│   ├── api/reviews/
│   │   ├── route.ts          # GET: List reviews
│   │   ├── fetch/route.ts    # POST: Fetch from Google
│   │   ├── generate/route.ts # POST: AI reply generation
│   │   └── approve/route.ts  # POST: Approve reply
│   ├── globals.css           # Design system
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Dashboard page
├── components/
│   ├── Dashboard.tsx         # Main dashboard
│   ├── PlaceIdInput.tsx      # Place ID input + fetch
│   ├── ReviewCard.tsx        # Review display card
│   ├── AiReplySection.tsx    # AI reply cards + approve
│   ├── StarRating.tsx        # Star rating display
│   └── StatusBadge.tsx       # Status badge (Pending/Resolved)
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── openai.ts             # OpenAI client + prompt
│   └── google-places.ts     # Google Places API
└── types/
    └── index.ts              # TypeScript types
```

## 🔄 Application Flow

```
User enters Place ID → Fetch 5 reviews from Google Maps
                      ↓
              Reviews saved to DB (status: "pending")
                      ↓
        User clicks "Generate AI" on a review
                      ↓
     OpenAI generates 3 reply suggestions (JSON)
                      ↓
        User selects best reply → clicks "Approve"
                      ↓
          Review status → "Resolved" ✅
```

## 📝 License

MIT
