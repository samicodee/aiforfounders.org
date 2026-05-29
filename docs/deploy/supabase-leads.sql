create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  program text not null check (program in ('founders')),
  source_domain text not null default 'aiforfounders.org',
  business text not null,
  role text not null,
  business_stage text not null check (
    business_stage in ('pre-revenue', '0-1cr', '1-5cr', '5-25cr', '25cr-plus')
  ),
  problem_statement text not null
);

alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists source_domain text default 'aiforfounders.org';
alter table public.leads add column if not exists business_stage text;
alter table public.leads add column if not exists problem_statement text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'leads'
      and column_name = 'operating_problem'
  ) then
    alter table public.leads alter column operating_problem drop not null;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'leads'
      and column_name = 'operating_problem'
  ) then
    update public.leads
    set
      email = coalesce(email, ''),
      source_domain = coalesce(source_domain, 'aiforfounders.org'),
      business_stage = coalesce(business_stage, ''),
      problem_statement = coalesce(problem_statement, operating_problem, '')
    where email is null
      or source_domain is null
      or business_stage is null
      or problem_statement is null;
  else
    update public.leads
    set
      email = coalesce(email, ''),
      source_domain = coalesce(source_domain, 'aiforfounders.org'),
      business_stage = coalesce(business_stage, ''),
      problem_statement = coalesce(problem_statement, '')
    where email is null
      or source_domain is null
      or business_stage is null
      or problem_statement is null;
  end if;
end $$;

alter table public.leads alter column email set not null;
alter table public.leads alter column source_domain set not null;
alter table public.leads alter column business_stage set not null;
alter table public.leads alter column problem_statement set not null;

alter table public.leads enable row level security;

drop policy if exists "No public lead reads" on public.leads;
drop policy if exists "No public lead writes" on public.leads;

create policy "No public lead reads"
  on public.leads
  for select
  to anon, authenticated
  using (false);

create policy "No public lead writes"
  on public.leads
  for insert
  to anon, authenticated
  with check (false);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists leads_program_idx
  on public.leads (program);

create index if not exists leads_source_domain_idx
  on public.leads (source_domain);
