create table if not exists public.recipes (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  description      text,
  image_url        text,
  spirit_category  text not null check (spirit_category in ('whiskey','gin','rum','vodka','tequila','brandy','wine','beer','non_alcoholic','other')),
  difficulty       text not null check (difficulty in ('easy','medium','hard')),
  prep_time_mins   int not null default 5,
  glassware        text,
  garnish          text,
  method           text not null check (method in ('shake','stir','build','blend','layer','throw')),
  flavor_tags      text[] not null default '{}',
  is_published     boolean not null default true,
  created_at       timestamptz not null default now()
);

create table if not exists public.ingredients (
  id               uuid primary key default gen_random_uuid(),
  recipe_id        uuid not null references public.recipes(id) on delete cascade,
  name             text not null,
  amount           text,
  unit             text,
  is_optional      boolean not null default false,
  sort_order       int not null default 0
);

create table if not exists public.recipe_steps (
  id               uuid primary key default gen_random_uuid(),
  recipe_id        uuid not null references public.recipes(id) on delete cascade,
  step_number      int not null,
  instruction      text not null,
  tip              text
);

create table if not exists public.user_saved_recipes (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  recipe_id        uuid not null references public.recipes(id) on delete cascade,
  saved_at         timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create index if not exists recipes_spirit_idx    on public.recipes (spirit_category);
create index if not exists recipes_difficulty_idx on public.recipes (difficulty);
create index if not exists recipes_method_idx    on public.recipes (method);
create index if not exists recipes_name_idx      on public.recipes using gin (to_tsvector('english', name));
create index if not exists ingredients_recipe_idx on public.ingredients (recipe_id);
create index if not exists steps_recipe_idx      on public.recipe_steps (recipe_id);
create index if not exists saved_user_idx        on public.user_saved_recipes (user_id);

alter table public.user_saved_recipes enable row level security;

create policy "users can view their own saved recipes"
  on public.user_saved_recipes for select
  using (auth.uid() = user_id);

create policy "users can save recipes"
  on public.user_saved_recipes for insert
  with check (auth.uid() = user_id);

create policy "users can unsave recipes"
  on public.user_saved_recipes for delete
  using (auth.uid() = user_id);
