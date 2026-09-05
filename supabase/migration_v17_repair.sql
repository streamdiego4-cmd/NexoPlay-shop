-- NexoPlay V17 repair: idempotent schema/RPC hardening.
-- Run once against the production database if older migrations were applied partially.
create extension if not exists pgcrypto;

alter table if exists public.support_tickets add column if not exists profile_name text;
alter table if exists public.support_tickets add column if not exists account_email text;
alter table if exists public.support_tickets add column if not exists description text;
alter table if exists public.support_tickets add column if not exists purchase_code text;

create table if not exists public.nexoplay_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  audience text not null default 'user' check (audience in ('user','admin')),
  type text not null default 'info',
  title text not null,
  message text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.nexoplay_notifications enable row level security;
drop policy if exists nx_v17_notif_select on public.nexoplay_notifications;
create policy nx_v17_notif_select on public.nexoplay_notifications for select using ((audience='user' and auth.uid()=user_id) or (audience='admin' and public.is_admin()));
drop policy if exists nx_v17_notif_update on public.nexoplay_notifications;
create policy nx_v17_notif_update on public.nexoplay_notifications for update using ((audience='user' and auth.uid()=user_id) or (audience='admin' and public.is_admin())) with check ((audience='user' and auth.uid()=user_id) or (audience='admin' and public.is_admin()));

create or replace function public.my_vip_referral_status()
returns table(id uuid,vip_owner_user_id uuid,status text,requested_at timestamptz,reviewed_at timestamptz,rank_expires timestamptz)
language sql security definer set search_path=public
as $$
  select r.id,r.vip_owner_user_id,r.status,r.requested_at,r.reviewed_at,r.rank_expires
  from public.nexoplay_vip_referral_requests r
  where r.referred_user_id=auth.uid()
  order by r.requested_at desc limit 20;
$$;

grant execute on function public.my_vip_referral_status() to authenticated;

create or replace function public.vip_list_referral_requests()
returns table(id uuid,referred_user_id uuid,referred_username text,referred_email text,status text,requested_at timestamptz,reviewed_at timestamptz)
language sql security definer set search_path=public
as $$
  select r.id,r.referred_user_id,coalesce(p.username,'')::text,u.email::text,r.status,r.requested_at,r.reviewed_at
  from public.nexoplay_vip_referral_requests r
  join auth.users u on u.id=r.referred_user_id
  left join public.profiles p on p.id=r.referred_user_id
  where r.vip_owner_user_id=auth.uid()
  order by r.requested_at desc limit 100;
$$;
grant execute on function public.vip_list_referral_requests() to authenticated;
