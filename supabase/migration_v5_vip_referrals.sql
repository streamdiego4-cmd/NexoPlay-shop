-- NexoPlay V5: referidos VIP con moderación, aislamiento por VIP y consulta privada de clientes.
-- Ejecutar una sola vez en Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.nexoplay_vip_referral_requests (
  id uuid primary key default gen_random_uuid(),
  vip_owner_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  rank_expires timestamptz
);

create index if not exists idx_nx_vip_req_owner_status on public.nexoplay_vip_referral_requests(vip_owner_user_id,status,requested_at desc);
create index if not exists idx_nx_vip_req_referred on public.nexoplay_vip_referral_requests(referred_user_id,status);
create unique index if not exists uq_nx_vip_pending_target on public.nexoplay_vip_referral_requests(referred_user_id) where status='pending';

alter table public.nexoplay_vip_referral_requests enable row level security;
drop policy if exists "VIP can read own referral requests" on public.nexoplay_vip_referral_requests;
create policy "VIP can read own referral requests" on public.nexoplay_vip_referral_requests for select using (vip_owner_user_id=auth.uid());
drop policy if exists "Referred user can read own request" on public.nexoplay_vip_referral_requests;
create policy "Referred user can read own request" on public.nexoplay_vip_referral_requests for select using (referred_user_id=auth.uid());

create or replace function public.nexoplay_new_vip_code()
returns text
language plpgsql
security definer
set search_path=public
as $$
declare c text;
begin
  loop
    c := 'VIP-' || upper(encode(gen_random_bytes(3),'hex'));
    exit when not exists(select 1 from public.nexoplay_vip_referral_codes where code=c);
  end loop;
  return c;
end;
$$;

create or replace function public.submit_vip_referral(p_code text)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_code public.nexoplay_vip_referral_codes%rowtype;
  v_request public.nexoplay_vip_referral_requests%rowtype;
  v_new_code text;
begin
  if auth.uid() is null then return jsonb_build_object('ok',false,'message','Debes iniciar sesión.'); end if;

  select * into v_code from public.nexoplay_vip_referral_codes where upper(code)=upper(trim(p_code)) for update;
  if not found then return jsonb_build_object('ok',false,'message','Código inválido.'); end if;
  if v_code.owner_user_id=auth.uid() then return jsonb_build_object('ok',false,'message','No puedes usar tu propio código.'); end if;
  if coalesce(v_code.remaining_uses,0)<=0 then return jsonb_build_object('ok',false,'message','Este código ya fue utilizado y venció.'); end if;

  if exists(select 1 from public.nexoplay_vip_referral_requests where referred_user_id=auth.uid() and status='pending') then
    return jsonb_build_object('ok',false,'message','Ya tienes una solicitud pendiente de verificación.');
  end if;
  if exists(select 1 from public.nexoplay_vip_referral_requests where referred_user_id=auth.uid() and status='approved') then
    return jsonb_build_object('ok',false,'message','Tu cuenta ya fue verificada por un VIP.');
  end if;

  update public.nexoplay_vip_referral_codes
    set uses=coalesce(uses,0)+1, remaining_uses=0, updated_at=now()
    where id=v_code.id;

  v_new_code := public.nexoplay_new_vip_code();
  insert into public.nexoplay_vip_referral_requests(vip_owner_user_id,referred_user_id,code)
  values(v_code.owner_user_id,auth.uid(),upper(trim(p_code)))
  returning * into v_request;

  update public.nexoplay_vip_referral_codes
    set code=v_new_code, uses=0, remaining_uses=1, updated_at=now()
    where id=v_code.id;

  return jsonb_build_object('ok',true,'status','pending','request_id',v_request.id,'message','Solicitud registrada. Espera la verificación del VIP.');
exception when unique_violation then
  return jsonb_build_object('ok',false,'message','Ya existe una solicitud pendiente para esta cuenta.');
end;
$$;

create or replace function public.vip_list_referral_requests()
returns table(id uuid,referred_user_id uuid,referred_username text,referred_email text,status text,requested_at timestamptz,reviewed_at timestamptz)
language sql
security definer
set search_path=public
as $$
  select r.id,r.referred_user_id,coalesce(p.username,'')::text,u.email::text,r.status,r.requested_at,r.reviewed_at
  from public.nexoplay_vip_referral_requests r
  join auth.users u on u.id=r.referred_user_id
  left join public.profiles p on p.id=r.referred_user_id
  where r.vip_owner_user_id=auth.uid()
  order by r.requested_at desc
  limit 100;
$$;

create or replace function public.review_vip_referral_request(p_request_id uuid,p_action text)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare r public.nexoplay_vip_referral_requests%rowtype;
begin
  select * into r from public.nexoplay_vip_referral_requests where id=p_request_id and vip_owner_user_id=auth.uid() for update;
  if not found then return jsonb_build_object('ok',false,'message','Solicitud no encontrada o no pertenece a tu Centro VIP.'); end if;
  if r.status<>'pending' then return jsonb_build_object('ok',false,'message','Esta solicitud ya fue procesada.'); end if;
  if lower(p_action)='reject' then
    update public.nexoplay_vip_referral_requests set status='rejected',reviewed_at=now(),reviewed_by=auth.uid() where id=r.id;
    return jsonb_build_object('ok',true,'status','rejected');
  end if;
  if lower(p_action)<>'approve' then return jsonb_build_object('ok',false,'message','Acción no válida.'); end if;

  update public.nexoplay_vip_referral_requests
    set status='approved',reviewed_at=now(),reviewed_by=auth.uid(),rank_expires=null
    where id=r.id;
  return jsonb_build_object('ok',true,'status','approved','referred_user_id',r.referred_user_id);
end;
$$;

create or replace function public.my_vip_referral_status()
returns table(id uuid,vip_owner_user_id uuid,status text,requested_at timestamptz,reviewed_at timestamptz,rank_expires timestamptz)
language sql
security definer
set search_path=public
as $$
  select id,vip_owner_user_id,status,requested_at,reviewed_at,rank_expires
  from public.nexoplay_vip_referral_requests
  where referred_user_id=auth.uid()
  order by requested_at desc
  limit 20;
$$;

create or replace function public.vip_get_referred_clients()
returns table(referred_user_id uuid,username text,email text,wallet_balance numeric,purchase_count bigint,verified_at timestamptz)
language sql
security definer
set search_path=public
as $$
  select r.referred_user_id,
         coalesce(p.username,'')::text,
         u.email::text,
         coalesce(w.balance,0)::numeric,
         coalesce((select count(*) from public.nexoplay_orders o where o.user_id=r.referred_user_id),0)::bigint,
         r.reviewed_at
  from public.nexoplay_vip_referral_requests r
  join auth.users u on u.id=r.referred_user_id
  left join public.profiles p on p.id=r.referred_user_id
  left join public.wallets w on w.user_id=r.referred_user_id
  where r.vip_owner_user_id=auth.uid() and r.status='approved'
  order by r.reviewed_at desc;
$$;

grant execute on function public.submit_vip_referral(text) to authenticated;
grant execute on function public.vip_list_referral_requests() to authenticated;
grant execute on function public.review_vip_referral_request(uuid,text) to authenticated;
grant execute on function public.my_vip_referral_status() to authenticated;
grant execute on function public.vip_get_referred_clients() to authenticated;
