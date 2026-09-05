
/* NexoPlay V13 — Nexo mascot, intelligent assistant and notification foundation. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const sb=()=>window.__nexoGetSupabase?.()||window.supabaseClient||null;
const user=()=>window.__nexoGetCurrentUser?.()||window.currentUser||null;
const clean=v=>String(v??'').trim();
const esc=v=>typeof window.escapeHTML==='function'?window.escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const AI_ENDPOINT=(function(){try{if(window.NEXO_AI_ENDPOINT)return String(window.NEXO_AI_ENDPOINT).trim();const s=sb();const u=s?.supabaseUrl||'';return u?String(u).replace(/\/$/,'')+'/functions/v1/nexo-ai':''}catch(_){return ''}})();
const PUSH_PUBLIC_KEY=(window.NEXO_VAPID_PUBLIC_KEY||'').trim();
const NOTIFY_KEY='nexoplay_notifications_v1';
function notifyStorageKey(){const u=user();return u?.id?`${NOTIFY_KEY}_${u.id}`:`${NOTIFY_KEY}_guest`}
const NEXO_SYSTEM=`Eres Nexo, el asistente amable de una tienda de entretenimiento digital. Responde en español claro, natural y útil. Usa el catálogo de NexoPlay como fuente de verdad para nombres, planes, precios, beneficios y modalidades. No inventes precios ni disponibilidad. Puedes explicar productos, comparar planes y orientar sobre el servicio. Para preguntas sobre estrenos, eventos, partidos o información que cambie con el tiempo, usa la fuente externa disponible y deja claro cuando no puedas verificar algo. Nunca reveles datos privados de clientes, contraseñas, PIN, Wallet privada ni funciones administrativas. No modificas cuentas, pedidos, Wallet ni rangos.`;

function getNotifs(){try{return JSON.parse(localStorage.getItem(notifyStorageKey())||'[]')}catch(_){return[]}}
function saveNotifs(a){try{localStorage.setItem(notifyStorageKey(),JSON.stringify(a.slice(0,30)))}catch(_){};renderNotifyBadge()}
function addNotification(title,body,opts={}){const a=getNotifs();const item={id:Date.now()+Math.random(),title,body,time:new Date().toISOString(),type:opts.type||'info',read:false};a.unshift(item);saveNotifs(a);showBrowserNotification(title,body).catch(()=>{});}
function renderNotifyBadge(){const n=getNotifs().filter(x=>!x.read).length;const b=$('nxV13NotifyBadge');if(!b)return;b.textContent=n>99?'99+':String(n);b.style.display=n?'flex':'none'}
function renderNotifyItems(){renderUnifiedNotifications()}
function toggleNotifyPanel(){const p=$('nxV13NotifyPanel');if(!p)return;p.classList.toggle('open');if(p.classList.contains('open'))renderNotifyItems()}
async function showBrowserNotification(title,body){
 if(!('Notification' in window)||Notification.permission!=='granted')return false;
 try{
  const reg=await navigator.serviceWorker?.ready;
  if(reg?.showNotification)return reg.showNotification(title,{body,icon:'./favicon.svg',badge:'./favicon.svg',tag:'nexoplay',renotify:true});
 }catch(_){}
 try{new Notification(title,{body,icon:'./favicon.svg'});return true}catch(_){return false}
}
async function requestNotificationPermission(){
 if(!('Notification' in window)){window.showToast?.('Este navegador no admite notificaciones web.');return}
 const p=await Notification.requestPermission();
 if(p==='granted'){await subscribePush().catch(()=>{});addNotification('🔔 Notificaciones activadas','Recibirás avisos de Nexo cuando estén disponibles.');window.showToast?.('✅ Notificaciones activadas.')}
 else window.showToast?.('Las notificaciones siguen desactivadas.');
 updatePermissionBox();
}
function updatePermissionBox(){const b=$('nxV13PermissionBox');if(!b)return;const supported='Notification'in window;const p=supported?Notification.permission:'unsupported';b.innerHTML=p==='granted'?'<strong>🔔 Notificaciones activas</strong><br>Tu navegador puede mostrar avisos de Nexo incluso fuera del panel.':`<strong>🔔 Activa las notificaciones</strong><br>Recibe avisos como nuevas solicitudes, compras o novedades.<br><button type="button" id="nxV13EnableNotifications">Activar notificaciones</button>`;$('nxV13EnableNotifications')?.addEventListener('click',requestNotificationPermission)}
async function subscribePush(){
 if(!PUSH_PUBLIC_KEY||!('PushManager'in window)||!('serviceWorker'in navigator))return null;
 try{
   const reg=await navigator.serviceWorker.ready;
   const current=await reg.pushManager.getSubscription();
   const sub=current||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:base64ToUint8(PUSH_PUBLIC_KEY)});
   localStorage.setItem('nexoplay_push_subscription',JSON.stringify(sub.toJSON()));
   const s=sb(),u=user();
   if(s&&u?.id){
     await s.from('nexoplay_push_subscriptions').upsert({user_id:u.id,endpoint:sub.endpoint,subscription:sub.toJSON(),updated_at:new Date().toISOString()},{onConflict:'endpoint'});
   }
   return sub;
 }catch(e){console.warn('Nexo push subscription:',e);return null}
}
function base64ToUint8(base64){const p='='.repeat((4-base64.length%4)%4),raw=atob((base64+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)))}
function seedBusinessEventNotifications_disabled(){
 const u=user(); if(!u)return;
 try{
  const last=Number(localStorage.getItem('nexoplay_v13_last_orders_count')||'0');
  const orders=JSON.parse(localStorage.getItem('nexoplay_orders')||'[]');
  const count=Array.isArray(orders)?orders.length:0;
  if(last&&count>last)addNotification('🛍️ Nueva compra','Se registró una nueva compra en NexoPlay.','purchase');
  localStorage.setItem('nexoplay_v13_last_orders_count',String(count));
 }catch(_){}
}
function attachRealtimeNotifications(){
 const s=sb(),u=user(); if(!s||!u?.id||!s.channel)return;
 try{
  const ch=s.channel('nexoplay-notifications')
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'support_tickets'},payload=>{
     const row=payload?.new||{}; if(row.user_id===u.id||row.owner_user_id===u.id)addNotification('🆘 Nueva solicitud','Tienes una nueva solicitud de soporte en NexoPlay.','support');
   })
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'nexoplay_vip_referral_requests'},payload=>{
     const row=payload?.new||{}; if(row.vip_owner_user_id===u.id)addNotification('👑 Nueva solicitud','Un usuario solicitó Distribuidor con tu código.','referral');
   })
   .subscribe();
  window.__nexoNotificationChannel=ch;
 }catch(e){console.warn('Nexo realtime notifications:',e)}
}

const DB_NOTIFY_TABLE='nexoplay_notifications';
let dbNotifyCache=[];
async function loadDbNotifications(){
 const s=sb(),u=user(); if(!s||!u?.id||!s.from)return [];
 try{
  const {data,error}=await s.from(DB_NOTIFY_TABLE).select('id,user_id,audience,type,title,message,data,read_at,created_at').eq('audience','user').eq('user_id',u.id).order('created_at',{ascending:false}).limit(80);
  if(error)throw error;
  dbNotifyCache=Array.isArray(data)?data:[];
  renderUnifiedNotifications();
  return dbNotifyCache;
 }catch(e){console.warn('Nexo notifications load:',e);return []}
}
function unifiedNotifications(){
 const local=getNotifs().map(x=>({...x,source:'local'}));
 const remote=dbNotifyCache.map(x=>({id:'db:'+x.id,title:x.title,body:x.message,time:x.created_at,type:x.type||'info',read:!!x.read_at,source:'db',dbId:x.id}));
 const seen=new Set(),out=[]; for(const x of [...remote,...local]){const k=String(x.source==='db'?x.dbId:x.id);if(seen.has(k))continue;seen.add(k);out.push(x)} return out.sort((a,b)=>new Date(b.time)-new Date(a.time)).slice(0,80);
}
function renderUnifiedNotifications(){
 const c=$('nxV13NotifyItems'); if(!c)return; const a=unifiedNotifications();
 c.innerHTML=a.length?a.map(x=>`<div class="nx-v13-notify-item ${x.read?'':'is-unread'}" data-notif-id="${esc(x.dbId||x.id)}"><b>${esc(x.title)}</b><span>${esc(x.body)}</span><span>${new Date(x.time).toLocaleString('es-PE')}</span></div>`).join(''):`<div class="nx-v13-notify-empty">No tienes notificaciones.</div>`;
 const n=a.filter(x=>!x.read).length,b=$('nxV13NotifyBadge');if(b){b.textContent=n>99?'99+':String(n);b.style.display=n?'flex':'none'}
}
async function markAllDbNotificationsRead(){
 const s=sb(),u=user();if(!s||!u?.id)return;
 try{await s.from(DB_NOTIFY_TABLE).update({read_at:new Date().toISOString()}).eq('audience','user').eq('user_id',u.id).is('read_at',null);await loadDbNotifications()}catch(e){console.warn('Nexo notifications read:',e)}
}
function attachDbNotificationRealtime(){
 const s=sb(),u=user(); if(!s||!u?.id||!s.channel)return;
 try{
  if(window.__nexoDbNotifyChannel)s.removeChannel(window.__nexoDbNotifyChannel).catch(()=>{});
  const ch=s.channel('nexo-user-notifications-'+u.id).on('postgres_changes',{event:'INSERT',schema:'public',table:DB_NOTIFY_TABLE},p=>{const row=p?.new||{}; if(row.user_id===u.id && row.audience==='user'){dbNotifyCache.unshift(row);renderUnifiedNotifications();showBrowserNotification(row.title||'NexoPlay 🔔',row.message||'Tienes una nueva actualización.').catch(()=>{});}}).subscribe();
  window.__nexoDbNotifyChannel=ch;
 }catch(e){console.warn('Nexo db notification realtime:',e)}
}
async function syncNotificationState(){await loadDbNotifications();attachDbNotificationRealtime();}
function catalogData(){return Array.isArray(window.products)?window.products.map(p=>({name:p.name,description:p.desc,plans:(p.plans||[]).filter(x=>x?.active!==false).map(x=>({name:x.name,price:x.price,description:x.desc,benefits:x.benefits||[]}))})):[]}
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function localAnswer(q){
 const nq=norm(q), products=catalogData();
 if(/diferencia|comparar|comparación|mejor|conviene/.test(nq)){
  const found=products.filter(p=>nq.includes(norm(p.name)));
  if(found.length===1){
   const p=found[0], plans=p.plans||[];
   if(plans.length>=2)return `📊 ${p.name}\n\n${plans.slice(0,4).map(x=>`• ${x.name} — S/ ${Number(x.price||0).toFixed(2)}\n${x.description||'Sin descripción disponible.'}`).join('\n\n')}`;
  }
 }
 if(/precio|cu[aá]nto cuesta|cu[aá]nto vale/.test(nq)){
  const found=products.filter(p=>nq.includes(norm(p.name)));
  if(found.length)return found[0].plans.slice(0,5).map(x=>`💰 ${x.name}: S/ ${Number(x.price||0).toFixed(2)}`).join('\n');
 }
 return null;
}
function buildAiModal(){
 let bg=$('nxV13AiModal');if(bg)return bg;
 bg=document.createElement('div');bg.id='nxV13AiModal';bg.className='nx-v13-ai-shell';
 bg.innerHTML=`<div class="nx-v13-ai" role="dialog" aria-modal="true" aria-label="Nexo Inteligente">
   <div class="nx-v13-ai-head"><div class="nx-v13-ai-brand"><div class="nx-v13-ai-avatar">N<span style="font-size:12px">✦</span></div><div class="nx-v13-ai-title"><strong>Nexo Inteligente</strong><small>Tu asistente de entretenimiento</small></div></div><button class="nx-v13-ai-close" id="nxV13AiClose" aria-label="Cerrar">×</button></div>
   <div class="nx-v13-ai-chat" id="nxV13AiChat"><div class="nx-v13-msg assistant">¡Hola! 👋 Soy Nexo. Puedo ayudarte a comparar planes, conocer precios, entender beneficios y resolver tus dudas sobre entretenimiento. ✨</div></div>
   <div class="nx-v13-suggestions"><button class="nx-v13-chip" data-q="¿Qué diferencia hay entre Netflix básico y premium?">Comparar Netflix</button><button class="nx-v13-chip" data-q="¿Qué planes tienen disponibles?">Ver planes</button><button class="nx-v13-chip" data-q="¿Qué beneficios tiene cada rango?">Beneficios</button></div>
   <div class="nx-v13-ai-status" id="nxV13AiStatus">Catálogo conectado · Nexo protege tus datos privados.</div>
   <form class="nx-v13-ai-form" id="nxV13AiForm"><input id="nxV13AiQuestion" maxlength="600" autocomplete="off" placeholder="Escribe tu pregunta…"><button type="submit">Enviar</button></form>
 </div>`;
 document.body.appendChild(bg);
 $('nxV13AiClose').onclick=()=>bg.classList.remove('open');
 bg.onclick=e=>{if(e.target===bg)bg.classList.remove('open')};
 $('nxV13AiForm').onsubmit=e=>{e.preventDefault();ask(clean($('nxV13AiQuestion').value))};
 bg.querySelectorAll('.nx-v13-chip').forEach(x=>x.onclick=()=>{const q=x.dataset.q||'';$('nxV13AiQuestion').value=q;ask(q)});
 return bg;
}
function addMsg(kind,text){const c=$('nxV13AiChat');if(!c)return;const d=document.createElement('div');d.className='nx-v13-msg '+kind;d.textContent=text;c.appendChild(d);c.scrollTop=c.scrollHeight}
async function ask(q){
 if(!q)return;
 const input=$('nxV13AiQuestion'),status=$('nxV13AiStatus');
 addMsg('user',q);if(input)input.value='';
 const local=localAnswer(q);if(local){addMsg('assistant',local);return}
 if(!AI_ENDPOINT){addMsg('assistant','Puedo ayudarte con el catálogo, pero el servicio de Nexo IA todavía no está conectado.');return}
 status.textContent='Nexo está pensando…';
 try{
  const payload={question:q,catalog:catalogData(),systemPrompt:NEXO_SYSTEM};
  const s=sb();let data=null;
  if(s?.functions?.invoke){
    const r=await s.functions.invoke('nexo-ai',{body:payload});if(r.error)throw r.error;data=r.data;
  }else{
    const r=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    data=await r.json();if(!r.ok)throw new Error(data?.error||'No se pudo consultar Nexo.');
  }
  const ans=data?.answer||'No pude confirmar esa información.';
  addMsg('assistant',ans);
  status.textContent=data?.configured===false?'Modo catálogo disponible':(data?.degraded?'Fuente inteligente temporalmente no disponible':'Nexo IA conectado · catálogo disponible');
 }catch(e){
  const msg=String(e?.message||e||'');
  const fallback=localAnswer(q);
  addMsg('assistant',fallback||'Puedo ayudarte con el catálogo, planes, precios y beneficios. La fuente inteligente está temporalmente no disponible.');
  status.textContent='Modo catálogo disponible';
 }
}
window.openNexoAI=function(initial){const bg=buildAiModal();bg.classList.add('open');setTimeout(()=>{$('nxV13AiQuestion')?.focus();if(initial){$('nxV13AiQuestion').value=initial;ask(initial)}},50)};
function mountMascot(){let m=$('nexoMascot');if(!m)return; m.outerHTML=`<div id="nexoMascot" class="nx-v13-mascot" role="button" tabindex="0" aria-label="Abrir Nexo Inteligente"><div class="nx-v13-tip">Hola 👋 Soy Nexo. Pregúntame por planes, precios, beneficios o novedades. ✨</div><div class="nx-v13-figure"><div class="nx-v13-head"><span class="nx-v13-mouth"></span><span class="nx-v13-badge">N</span></div><div class="nx-v13-body"><span class="nx-v13-collar"></span><span class="nx-v13-logo">N</span><span class="nx-v13-arm l"></span><span class="nx-v13-arm r"></span></div></div><div class="nx-v13-label">Nexo 🤖</div></div>`;const n=$('nexoMascot');n.onclick=()=>window.openNexoAI();n.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.openNexoAI()}}}
function mountNotifications(){
 if($('nxV13NotifyBtn'))return;
 const cart=document.querySelector('.cart-btn');if(!cart)return;
 const btn=document.createElement('button');btn.id='nxV13NotifyBtn';btn.className='nx-v13-notify-btn';btn.type='button';btn.title='Notificaciones';btn.innerHTML='🔔<span class="nx-v13-notify-badge" id="nxV13NotifyBadge"></span>';btn.onclick=toggleNotifyPanel;
 cart.parentNode.insertBefore(btn,cart);
 const p=document.createElement('div');p.id='nxV13NotifyPanel';p.className='nx-v13-notify-panel';p.innerHTML=`<div class="nx-v13-notify-head"><strong>🔔 Notificaciones Nexo</strong><button type="button" id="nxV13MarkRead" class="nx-v13-notify-btn" style="padding:5px 8px">Marcar leídas</button></div><div id="nxV13PermissionBox" class="nx-v13-permission"></div><div id="nxV13NotifyItems" class="nx-v13-notify-items"></div>`;document.body.appendChild(p);
 $('nxV13MarkRead').onclick=()=>{const a=getNotifs().map(x=>({...x,read:true}));saveNotifs(a);markAllDbNotificationsRead().catch(()=>{});renderNotifyItems()};
 updatePermissionBox();renderNotifyBadge();renderNotifyItems();
}
function boot(){
 mountMascot();mountNotifications();attachRealtimeNotifications();syncNotificationState().catch(()=>{});
 // Only request permission after a user click; no intrusive prompt.
 if(PUSH_PUBLIC_KEY) subscribePush().catch(()=>{});
}
window.addNotification=addNotification;
window.nexoRequestNotifications=requestNotificationPermission;
window.addNexoNotification=addNotification;
window.addEventListener('load',boot,{once:true});
})();
