/* NexoPlay V15 — Nexo intelligent assistant + per-user notification bridge.
   Enhancement layer: preserves V13 behavior and adds durable DB-first state. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const sb=()=>window.__nexoGetSupabase?.()||window.supabaseClient||null;
const user=()=>window.__nexoGetCurrentUser?.()||window.currentUser||null;
const clean=v=>String(v??'').trim();
const esc=v=>typeof window.escapeHTML==='function'?window.escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const cfg=window.NEXO_CONFIG||{};
const DB='nexoplay_notifications';
const PUSH_KEY=String(cfg.vapidPublicKey||window.NEXO_VAPID_PUBLIC_KEY||'').trim();
const AI_ENDPOINT=(function(){try{if(window.NEXO_AI_ENDPOINT)return String(window.NEXO_AI_ENDPOINT).trim();const s=sb();const u=s?.supabaseUrl||'';return u?String(u).replace(/\/$/,'')+'/functions/v1/nexo-ai':''}catch(_){return ''}})();
const HISTORY_KEY='nexoplay_nexo_chat_v15';
let lastRender=0;

function catalogData(){
 const ps=Array.isArray(window.products)?window.products:[];
 return ps.map(p=>({
   name:p?.name||'',
   description:p?.desc||'',
   plans:(Array.isArray(p?.plans)?p.plans:[]).filter(x=>x?.active!==false).map(x=>({name:x?.name||'',price:Number(x?.price||0),description:x?.desc||'',benefits:Array.isArray(x?.benefits)?x.benefits:[]}))
 })).filter(x=>x.name);
}
function currentHistory(){try{const x=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');return Array.isArray(x)?x.slice(-10):[]}catch(_){return[]}}
function saveHistory(rows){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(rows.slice(-10)))}catch(_){} }
function remember(role,text){const h=currentHistory();h.push({role,text:String(text||'').slice(0,1600)});saveHistory(h)}

function systemPrompt(){return `Eres Nexo, el asistente oficial de una tienda de entretenimiento digital. Hablas español natural, amable y directo.\n\nREGLAS: Usa el catálogo recibido como fuente de verdad para nombres, planes, precios, modalidades, beneficios y disponibilidad local. Nunca inventes un precio, stock o promoción. Puedes comparar planes y explicar los servicios. No reveles contraseñas, PIN, Wallet privada, datos de otros usuarios ni funciones administrativas. No puedes modificar cuentas, pedidos, Wallet o rangos.\n\nINFORMACIÓN ACTUAL: Si la pregunta pide estrenos, películas recientes, partidos, horarios, eventos o datos que cambian con el tiempo, solo afirmes algo como actual cuando exista una fuente externa conectada y verificable. Si no está conectada, dilo con honestidad y no inventes.\n\nESTILO: No respondas como documentación técnica. Sé conversacional. Da respuestas útiles, con párrafos cortos y listas breves cuando ayuden. Si comparas productos, termina con una recomendación basada en lo que la persona pidió.\n\nIDENTIDAD: Eres Nexo, no un sistema de administración. `}

async function askAI(question){
 const s=sb();
 const payload={question,catalog:catalogData(),systemPrompt:systemPrompt(),history:currentHistory(),user:{id:user()?.id||null}};
 if(s?.functions?.invoke){
   const r=await s.functions.invoke('nexo-ai',{body:payload});
   if(r.error)throw r.error;
   return r.data?.answer||r.data?.text||null;
 }
 if(!AI_ENDPOINT) return null;
 const r=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const data=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(data?.error||'No se pudo consultar Nexo.');
 return data?.answer||data?.text||null;
}

function patchAI(){
 if(typeof window.openNexoAI!=='function' || window.__nexoV15AIPatched)return;
 const original=window.openNexoAI;
 window.openNexoAI=function(initial){
   original(initial);
   const modal=$('nxV13AiModal');
   if(!modal)return;
   const chat=$('nxV13AiChat');
   if(chat&&!chat.dataset.v15){
     chat.dataset.v15='1';
     const status=$('nxV13AiStatus');
     if(status)status.textContent='Nexo listo · catálogo conectado';
   }
 };
 window.__nexoV15AIPatched=true;
}

async function registerPush(){
 const u=user();
 if(!u?.id||!PUSH_KEY||!('serviceWorker' in navigator)||!('PushManager' in window))return null;
 try{
   const reg=await navigator.serviceWorker.ready;
   let sub=await reg.pushManager.getSubscription();
   if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:base64ToUint8(PUSH_KEY)});
   const s=sb();
   if(s?.from){
     const payload=sub.toJSON();
     const {error}=await s.from('nexoplay_push_subscriptions').upsert({user_id:u.id,endpoint:sub.endpoint,subscription:payload,updated_at:new Date().toISOString()},{onConflict:'endpoint'});
     if(error)console.warn('Nexo push DB:',error);
   }
   return sub;
 }catch(e){console.warn('Nexo push registration:',e);return null}
}
function base64ToUint8(base64){const p='='.repeat((4-base64.length%4)%4),raw=atob((base64+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)))}

async function notifyForUser(title,message,type='info',data={}){
 const s=sb(),u=user();
 if(!s||!u?.id)return;
 try{
   await s.from(DB).insert({user_id:u.id,audience:'user',type,title,message,data});
 }catch(e){console.warn('Nexo user notification:',e)}
}

function ensureNotificationPanel(){
 const panel=$('nxV13NotifyPanel');
 if(!panel)return;
 const head=panel.querySelector('.nx-v13-notify-head strong');
 if(head)head.textContent='🔔 Centro de notificaciones Nexo';
 const note=panel.querySelector('.nx-v13-permission');
 if(note && !note.dataset.v15){note.dataset.v15='1';note.innerHTML='<strong>🔔 Avisos personalizados</strong><br>Recibirás únicamente las novedades que correspondan a tu cuenta. Activa las notificaciones del navegador para recibir avisos fuera de NexoPlay.'}
}

async function bootV15(){
 patchAI();
 ensureNotificationPanel();
 const p=location.protocol;
 if(PUSH_KEY && p!=='file:'){
   try{
     if('Notification' in window && Notification.permission==='granted')await registerPush();
   }catch(_){}
 }
 // Keep the Nexo assistant warm without opening anything automatically.
 setTimeout(patchAI,300);
 setTimeout(patchAI,1200);
}
window.nexoV15AskAI=askAI;
window.nexoV15RegisterPush=registerPush;
window.nexoV15Notify=notifyForUser;
window.addEventListener('load',bootV15,{once:true});
})();
