create table if not exists public.learning_paths (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  description      text,
  image_url        text,
  difficulty       text not null check (difficulty in ('easy','medium','hard')),
  estimated_hours  int not null default 1,
  is_published     boolean not null default true,
  sort_order       int not null default 0
);

create table if not exists public.path_modules (
  id               uuid primary key default gen_random_uuid(),
  path_id          uuid not null references public.learning_paths(id) on delete cascade,
  title            text not null,
  sort_order       int not null default 0
);

create table if not exists public.lessons (
  id               uuid primary key default gen_random_uuid(),
  module_id        uuid not null references public.path_modules(id) on delete cascade,
  title            text not null,
  slug             text unique not null,
  type             text not null default 'theory' check (type in ('theory','technique','recipe_walkthrough')),
  content          jsonb not null default '[]',
  xp_reward        int not null default 50,
  estimated_mins   int not null default 10,
  sort_order       int not null default 0,
  is_published     boolean not null default true
);

create table if not exists public.user_path_enrollments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  path_id          uuid not null references public.learning_paths(id) on delete cascade,
  enrolled_at      timestamptz not null default now(),
  completed_at     timestamptz,
  unique (user_id, path_id)
);

create table if not exists public.user_lesson_completions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  lesson_id        uuid not null references public.lessons(id) on delete cascade,
  completed_at     timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.user_xp_events (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  xp_amount        int not null,
  reason           text not null,
  source_type      text not null check (source_type in ('lesson','badge','streak','game')),
  source_id        uuid,
  earned_at        timestamptz not null default now()
);

create index if not exists lp_sort_idx  on public.learning_paths (sort_order);
create index if not exists pm_path_idx  on public.path_modules (path_id, sort_order);
create index if not exists l_module_idx on public.lessons (module_id, sort_order);
create index if not exists upe_user_idx on public.user_path_enrollments (user_id);
create index if not exists ulc_user_idx on public.user_lesson_completions (user_id);
create index if not exists xp_user_idx  on public.user_xp_events (user_id);

alter table public.user_path_enrollments  enable row level security;
alter table public.user_lesson_completions enable row level security;
alter table public.user_xp_events          enable row level security;

create policy "users can view their own enrollments"
  on public.user_path_enrollments for select using (auth.uid() = user_id);
create policy "users can enroll in paths"
  on public.user_path_enrollments for insert with check (auth.uid() = user_id);
create policy "users can unenroll from paths"
  on public.user_path_enrollments for delete using (auth.uid() = user_id);

create policy "users can view their own completions"
  on public.user_lesson_completions for select using (auth.uid() = user_id);
create policy "users can complete lessons"
  on public.user_lesson_completions for insert with check (auth.uid() = user_id);

create policy "users can view their own xp"
  on public.user_xp_events for select using (auth.uid() = user_id);
create policy "users can earn xp"
  on public.user_xp_events for insert with check (auth.uid() = user_id);
