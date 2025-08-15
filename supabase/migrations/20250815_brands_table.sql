-- Create brands table
create table if not exists public.brands (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  brand_name text not null,
  tagline text,
  online_link text,
  elevator_pitch text,
  industry text,
  offerings text,
  usp text,
  problem_solved text,
  primary_audience text,
  age_range text,
  gender_focus text,
  income_level text,
  brand_personality jsonb not null default '{}'::jsonb,
  one_year_vision text,
  five_year_vision text,
  challenges text,
  competitors text,
  likes_dislikes text,
  launch_timing text,
  budget_range text,
  extra_notes text,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_primary_brand unique (user_id, is_primary) 
    deferrable initially deferred
);

-- Enable RLS
alter table public.brands enable row level security;

-- Create indexes
create index idx_brands_user_id on public.brands (user_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updated_at
create or replace trigger handle_brands_updated_at
  before update on public.brands
  for each row execute function public.handle_updated_at();

-- Function to set primary brand
create or replace function public.set_primary_brand(p_user_id uuid, p_brand_id uuid)
returns void as $$
begin
  -- First, unset any existing primary brand
  update public.brands 
  set is_primary = false 
  where user_id = p_user_id 
    and is_primary = true
    and id != p_brand_id;
  
  -- Set the new primary brand
  update public.brands 
  set is_primary = true 
  where id = p_brand_id 
    and user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- RLS Policies
-- Users can view their own brands
create policy "Users can view their own brands"
  on public.brands for select
  using (auth.uid() = user_id);

-- Users can insert their own brands
create policy "Users can insert their own brands"
  on public.brands for insert
  with check (auth.uid() = user_id);

-- Users can update their own brands
create policy "Users can update their own brands"
  on public.brands for update
  using (auth.uid() = user_id);

-- Users can delete their own brands (except the last one)
create policy "Users can delete their own non-primary brands"
  on public.brands for delete
  using (
    auth.uid() = user_id 
    and (
      select count(*) 
      from public.brands 
      where user_id = auth.uid()
    ) > 1
    and is_primary = false
  );
