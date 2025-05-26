-- Streaks
create table if not exists public.user_streaks (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  current_streak   int not null default 0,
  longest_streak   int not null default 0,
  last_active_date date,
  unique(user_id)
);

alter table public.user_streaks enable row level security;
create policy "streaks viewable by owner" on public.user_streaks for select using (auth.uid() = user_id);
create policy "streaks editable by owner" on public.user_streaks for all using (auth.uid() = user_id);

-- Badges catalogue
create table if not exists public.badges (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text not null,
  icon        text not null default '🏅'
);

alter table public.badges disable row level security;

-- User badges (earned)
create table if not exists public.user_badges (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  badge_id  uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;
create policy "user_badges viewable by owner" on public.user_badges for select using (auth.uid() = user_id);
create policy "user_badges insertable by owner" on public.user_badges for insert with check (auth.uid() = user_id);

create index on public.user_badges(user_id);
