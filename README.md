# Mastery Engine

> Stop consuming. Start mastering.

A structured AI-powered learning system built for ambitious minds aged 18–35 who are done with random YouTube videos, random AI answers, and information overload that leads nowhere.

---

## The Problem

The modern world gives you infinite information. Abundance without structure creates overstimulation, burnout, and the valley of despair — not growth.

## The Solution

One skill. One structured path. Repeated cycles until the skill is real.

```
Learn (20%) → Build (60%) → Refine (20%) → repeat
```

Not intensity. **Consistency + correction, compounding over time.**

---

## How It Works

**Learn** — AI generates a focused learning brief: the core concept, three fundamentals, a mental map, and your first execution step. No fluff.

**Build** — A real project challenge specific to your skill and goal. An AI coach is available in-session — it asks questions, it doesn't give answers.

**Refine** — AI analyses your submission. You get a headline verdict, strengths, gaps, the thinking pattern to break, your next cycle focus, and a 0–100 mastery score.

Each cycle takes roughly one week. Repeat for 30, 60, or 90 days.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth + Database | Supabase |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Deployment | Vercel |
| Fonts | Instrument Serif + Inter |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/mastery-engine.git
cd mastery-engine
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
# Supabase — https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Groq — free tier — https://console.groq.com/keys
GROQ_API_KEY=gsk_your_key_here
```

### 3. Set up Supabase

Run this SQL in your Supabase SQL editor:

```sql
-- Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Tracks (one per learning journey)
create table public.tracks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  skill text not null,
  duration integer not null check (duration in (30, 60, 90)),
  goal text not null,
  created_at timestamp with time zone default now(),
  is_active boolean default true
);

-- Cycles (one per completed Learn→Build→Refine loop)
create table public.cycles (
  id uuid default gen_random_uuid() primary key,
  track_id uuid references public.tracks(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  cycle_number integer not null,
  submission text,
  score integer,
  feedback jsonb,
  completed_at timestamp with time zone default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.cycles enable row level security;

create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own tracks" on public.tracks for all using (auth.uid() = user_id);
create policy "Users manage own cycles" on public.cycles for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Vercel

```bash
git push
```

Connect your repo at [vercel.com/new](https://vercel.com/new) and add your three environment variables.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, Signup
│   ├── (app)/            # Protected: Dashboard, Onboarding, Account, Cycle phases
│   ├── api/              # Groq API routes: learn, build, refine, coach
│   └── auth/callback/    # Supabase OAuth callback
├── components/
│   ├── landing/          # Hero, System, Duration, Ticker sections
│   ├── phases/           # LearnPhase, BuildPhase, RefinePhase
│   ├── dashboard/        # Stats, chart, progress
│   └── ui/               # ProfileMenu, shared components
├── lib/
│   ├── groq.ts           # Groq API wrapper (JSON + streaming)
│   └── supabase/         # Browser + server clients, middleware
└── types/                # TypeScript interfaces
```

---

## Auth

- Email + password via Supabase
- Google OAuth via Supabase (requires Google Cloud Console setup)
- Session handled server-side via `@supabase/ssr`
- Protected routes enforced in `middleware.ts`

---

## AI Model

Using **Groq's free tier** with `llama-3.3-70b-versatile`. Fast, capable, and generous enough for an MVP. When you scale, swap the model string in `src/lib/groq.ts`.

---

## Roadmap

- [ ] Weekly email digest (cycle progress + next focus)
- [ ] Streak tracking
- [ ] Multiple active tracks
- [ ] Share cycle score
- [ ] Mobile app (React Native)
- [ ] Community — same-skill track groups

---

## Philosophy

> The goal isn't to know everything. It's to know enough to act, and act enough to learn the rest.

Built for the 18–35 generation that's done with random. One skill. One path. Real mastery.

---

## License

MIT