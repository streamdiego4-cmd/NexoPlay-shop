-- NexoPlay V16 FINAL
-- Idempotent hardening for the referral + notification system.
-- Safe/additive. Does not delete business data.

create extension if not exists pgcrypto;

/* ---------------------------------------------------------
   REFERRAL REQUESTS: align the table with the existing V5 RPCs
   --------------------------------------------------------- */
create table if not exists public.nexoplay_vip_referral_requests (
  id uuid primary key default gen_random_uuid(),
  vip_owner_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid references auth.users(id) on delete cascade,
  code text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  rank_expires timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade
);

alter table public.nexoplay_vip_referral_requests
  add column if not exists referred_user_id uuid references auth.users(id) on delete cascade;
alter table public.nexoplay_vip_referral_requests
  add column if not exists code text;
alter table public.nexoplay_vip_referral_requests
  add column if not exists rank_expires timestamptz;
alter table public.nexoplay_vip_referral_requests
  add column if not exists created_at timestamptz not null default now();
alter table public.nexoplay_vip_referral_requests
  add column if not exists updated_at timestamptz not null default now();

-- Our first notification setup used user_id. Keep it as a compatibility alias,
-- but make the schema compatible with the existing V5 functions.
alter table public.nexoplay_vip_referral_requests
  alter column user_id drop not null;

update public.nexoplay_vip_referral_requests
set referred_user_id = coalesce(referred_user_id, user_id)
where referred_user_id is null and user_id is not null;

create index if not exists idx_nx_vip_req_owner_status_v16
  on public.nexoplay_vip_referral_requests(vip_owner_user_id,status,requested_at desc);
create index if not exists idx_nx_vip_req_referred_v16
  on public.nexoplay_vip_referral_requests(referred_user_id,status);
create unique index if not exists uq_nx_vip_pending_target_v16
  on public.nexoplay_vip_referral_requests(referred_user_id)
  where status='pending';

alter table public.nexoplay_vip_referral_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='nexoplay_vip_referral_requests' and policyname='nx_v16_vip_select'
  ) then
    create policy nx_v16_vip_select on public.nexoplay_vip_referral_requests
      for select using (vip_owner_user_id=auth.uid() or referred_user_id=auth.uid() or public.is_admin());
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='nexoplay_vip_referral_requests' and policyname='nx_v16_user_insert'
  ) then
    create policy nx_v16_user_insert on public.nexoplay_vip_referral_requests
      for insert with check (auth.uid() = referred_user_id or auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='nexoplay_vip_referral_requests' and policyname='nx_v16_owner_update'
  ) then
    create policy nx_v16_owner_update on public.nexoplay_vip_referral_requests
      for update using (vip_owner_user_id=auth.uid() or public.is_admin())
      with check (vip_owner_user_id=auth.uid() or public.is_admin());
  end if;
end $$;

/* Keep aliases synchronized for legacy/local code. */
create or replace function public.nx_sync_referral_aliases()
returns trigger
language plpgsql
as $$
begin
  if new.referred_user_id is null and new.user_id is not null then new.referred_user_id := new.user_id; end if;
  if new.user_id is null and new.referred_user_id is not null then new.user_id := new.referred_user_id; end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists nx_sync_referral_aliases on public.nexoplay_vip_referral_requests;
create trigger nx_sync_referral_aliases
before insert or update on public.nexoplay_vip_referral_requests
for each row execute function public.nx_sync_referral_aliases();

/* ---------------------------------------------------------
   NOTIFICATIONS
   --------------------------------------------------------- */
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

create index if not exists idx_nx_notifications_user_v16
  on public.nexoplay_notifications(user_id,created_at desc);
create index if not exists idx_nx_notifications_audience_v16
  on public.nexoplay_notifications(audience,created_at desc);

alter table public.nexoplay_notifications enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='nexoplay_notifications' and policyname='nx_v16_notif_select') then
    create policy nx_v16_notif_select on public.nexoplay_notifications
      for select using ((audience='user' and auth.uid()=user_id) or (audience='admin' and public.is_admin()));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='nexoplay_notifications' and policyname='nx_v16_notif_update') then
    create policy nx_v16_notif_update on public.nexoplay_notifications
      for update using ((audience='user' and auth.uid()=user_id) or (audience='admin' and public.is_admin()))
      with check ((audience='user' and auth.uid()=user_id) or (audience='admin' and public.is_admin()));
  end if;
end $$;

create or replace function public.nx_insert_notification(
  p_user_id uuid,
  p_audience text,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare rid uuid;
begin
  insert into public.nexoplay_notifications(user_id,audience,type,title,message,data)
  values(p_user_id,coalesce(p_audience,'user'),coalesce(p_type,'info'),p_title,p_message,coalesce(p_data,'{}'::jsonb))
  returning id into rid;
  return rid;
end;
$$;

/* Purchase */
create or replace function public.nx_notify_order_created_v16()
returns trigger
language plpgsql security definer set search_path=public
as $$
begin
  if new.user_id is not null then
    perform public.nx_insert_notification(
      new.user_id,'user','purchase','🛍️ Compra registrada',
      'Tu pedido '||coalesce(new.order_code,'')||' fue registrado correctamente.',
      jsonb_build_object('order_id',new.id,'order_code',new.order_code));
  end if;
  perform public.nx_insert_notification(
    null,'admin','purchase','🛒 Nueva compra',
    'Se registró una nueva compra '||coalesce(new.order_code,'')||'.',
    jsonb_build_object('order_id',new.id,'order_code',new.order_code,'user_id',new.user_id,'total',new.total));
  return new;
end;
$$;

drop trigger if exists nx_v16_order_created on public.nexoplay_orders;
create trigger nx_v16_order_created after insert on public.nexoplay_orders
for each row execute function public.nx_notify_order_created_v16();

/* Delivery */
create or replace function public.nx_notify_order_delivery_v16()
returns trigger
language plpgsql security definer set search_path=public
as $$
begin
  if new.user_id is not null
     and coalesce(old.delivery_status,'') is distinct from coalesce(new.delivery_status,'')
     and lower(coalesce(new.delivery_status,''))='delivered' then
    perform public.nx_insert_notification(
      new.user_id,'user','delivery','📦 Pedido entregado',
      'Tu pedido '||coalesce(new.order_code,'')||' ya fue entregado. Revisa tus compras.',
      jsonb_build_object('order_id',new.id,'order_code',new.order_code));
  end if;
  return new;
end;
$$;

drop trigger if exists nx_v16_order_delivery on public.nexoplay_orders;
create trigger nx_v16_order_delivery after update on public.nexoplay_orders
for each row execute function public.nx_notify_order_delivery_v16();

/* Ticket creation */
create or replace function public.nx_notify_ticket_created_v16()
returns trigger
language plpgsql security definer set search_path=public
as $$
begin
  if new.user_id is not null then
    perform public.nx_insert_notification(new.user_id,'user','support','🆘 Ticket creado',
      'Tu solicitud de soporte fue recibida correctamente.',jsonb_build_object('ticket_id',new.id));
  end if;
  perform public.nx_insert_notification(null,'admin','support','🆘 Nuevo ticket',
    'Un cliente creó una nueva solicitud de soporte.',jsonb_build_object('ticket_id',new.id,'user_id',new.user_id));
  return new;
end;
$$;

do $$ begin
  if to_regclass('public.support_tickets') is not null then
    execute 'drop trigger if exists nx_v16_ticket_created on public.support_tickets';
    execute 'create trigger nx_v16_ticket_created after insert on public.support_tickets for each row execute function public.nx_notify_ticket_created_v16()';
  end if;
end $$;

/* Ticket reply */
create or replace function public.nx_notify_support_reply_v16()
returns trigger
language plpgsql security definer set search_path=public
as $$
declare ticket_user uuid;
begin
  select user_id into ticket_user from public.support_tickets where id=new.ticket_id;
  if ticket_user is not null and new.sender_id is distinct from ticket_user then
    perform public.nx_insert_notification(ticket_user,'user','support','💬 Nueva respuesta de soporte',
      'Tu solicitud recibió una nueva respuesta. Entra a NexoPlay para leerla.',
      jsonb_build_object('ticket_id',new.ticket_id,'message_id',new.id));
  end if;
  return new;
end;
$$;

do $$ begin
  if to_regclass('public.support_messages') is not null then
    execute 'drop trigger if exists nx_v16_support_reply on public.support_messages';
    execute 'create trigger nx_v16_support_reply after insert on public.support_messages for each row execute function public.nx_notify_support_reply_v16()';
  end if;
end $$;

/* VIP referral request */
create or replace function public.nx_notify_referral_created_v16()
returns trigger
language plpgsql security definer set search_path=public
as $$
begin
  if new.vip_owner_user_id is not null then
    perform public.nx_insert_notification(new.vip_owner_user_id,'user','referral','👑 Nueva solicitud',
      'Un usuario solicitó Distribuidor usando tu código. Revisa tu Panel de Referidos.',
      jsonb_build_object('request_id',new.id,'user_id',coalesce(new.referred_user_id,new.user_id)));
  end if;
  perform public.nx_insert_notification(null,'admin','referral','🤝 Nueva solicitud de referido',
    'Hay una nueva solicitud de Distribuidor pendiente.',jsonb_build_object('request_id',new.id));
  return new;
end;
$$;

drop trigger if exists nx_v16_referral_created on public.nexoplay_vip_referral_requests;
create trigger nx_v16_referral_created after insert on public.nexoplay_vip_referral_requests
for each row execute function public.nx_notify_referral_created_v16();

/* Realtime */
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='nexoplay_notifications'
  ) then
    alter publication supabase_realtime add table public.nexoplay_notifications;
  end if;
exception when others then null;
end $$;
