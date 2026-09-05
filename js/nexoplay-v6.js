/* NexoPlay V6 — ajustes finales, persistencia, VIP separado, logos, auth y ruleta por rango. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const user=()=>window.__nexoGetCurrentUser?.()||window.currentUser||null;
  const sb=()=>window.__nexoGetSupabase?.()||window.supabaseClient||null;
  const esc=v=>typeof window.escapeHTML==='function'?window.escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const names=['Netflix','Disney+','HBO Max','Paramount+','Prime Video','YouTube Premium','Crunchyroll','Canva','ViX','Spotify','Free Fire','Roblox','Steam','PlayStation','Xbox','ChatGPT','Claude','Gemini','YouTube Music','Apple Music','Google One','CapCut','Adobe','Coursera','Microsoft 365','VPN','Cloud Storage'];
  const rankId=()=>{const u=user();if(!u)return 'cliente';try{return JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')[u.id]?.rankId||'cliente'}catch(_){return 'cliente'}};
  const rankLabel=()=>({vip:'VIP',distribuidor:'Distribuidor',frecuente:'Cliente Frecuente',cliente:'Cliente'}[rankId()]||'Cliente');
  const pointKey='nexoplay_points_v1';
  const rouletteKey='nexoplay_roulette_v2';
  const pointMap=()=>{try{return JSON.parse(localStorage.getItem(pointKey)||'{}')}catch(_){return {}}};
  const setPointMap=v=>localStorage.setItem(pointKey,JSON.stringify(v));
  const points=()=>{const u=user();if(!u)return 0;return Number(pointMap()[u.id]||0)};
  function addPoints(n){const u=user();if(!u)return;const m=pointMap();m[u.id]=Math.max(0,Math.floor(Number(m[u.id]||0)+Number(n||0)));setPointMap(m);}

  function loadBaseOverrides(){
    let map={};try{map=JSON.parse(localStorage.getItem('nexoplay_base_product_overrides')||'{}')}catch(_){map={}};
    let changed=false;
    Object.keys(map).forEach(k=>{
      const i=Number(k),p=window.products?.[i],o=map[k];
      if(!p||!o)return;
      if(o.name!==undefined)p.name=String(o.name);
      if(o.category!==undefined)p.category=String(o.category);
      if(o.templateImage!==undefined)p.templateImage=String(o.templateImage||'');
      if(o.desc!==undefined)p.desc=String(o.desc||'');
      if(Array.isArray(o.plans)){
        p.plans=o.plans.map(x=>({...x,price:Number(x.price||0),stock:Number(x.stock||0),active:x.active!==false}));
      }
      changed=true;
    });
    if(changed){
      try{window.renderCategoryChips?.();window.applyCatalogTools?.();window.renderProducts?.();}catch(_){ }
    }
  }

  function tickerHTML(){
    const once=[...names,...names];
    return `<div class="nx6-ticker" aria-label="Plataformas NexoPlay"><div class="nx6-ticker-track">${once.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div>`;
  }
  function addTickers(){
    const targets=[
      ['#purchasesModalBg .purchase-hero',true],
      ['#ordersModalBg .tutorial-modal-head',true],
      ['#nexoVipBg .nx-vip-head',true],
      ['#nx6ReferralManagerBg .nx6-ref-head',true]
    ];
    targets.forEach(([sel])=>{const h=document.querySelector(sel);if(h&&!h.parentElement.querySelector('.nx6-ticker'))h.insertAdjacentHTML('afterend',tickerHTML())});
  }

  function applyAuthTheme(){
    const title=$('authTitle');
    if(title && !$('authBg')?.dataset.nx6Welcome){
      $('authBg').dataset.nx6Welcome='1';
      const body=$('authBg')?.querySelector('.auth-body');
      if(body&&!body.querySelector('.nx6-auth-intro')){
        body.insertAdjacentHTML('afterbegin',`<div class="nx6-auth-intro"><div class="nx5-kicker">NEXOPLAY MEMBERSHIP</div><h3>Tu entretenimiento, más cerca. ✨</h3><p>Accede a tu catálogo, Wallet, beneficios y dinámicas desde un mismo lugar.</p></div>`);
      }
    }
  }

  function ensureReferralManager(){
    let bg=$('nx6ReferralManagerBg');if(bg)return bg;
    bg=document.createElement('div');bg.id='nx6ReferralManagerBg';bg.className='nx6-overlay';
    bg.innerHTML=`<div class="nx6-ref-modal" role="dialog" aria-modal="true"><div class="nx6-ref-head"><div><div class="nx5-kicker">NEXOPLAY VIP REFERRALS</div><h3>Panel de Referidos 👥</h3><p>Administra tus solicitudes y observa únicamente a los clientes que llegaron mediante tu código.</p></div><button class="nx6-close" aria-label="Cerrar">×</button></div><div id="nx6ReferralContent"></div></div>`;
    document.body.appendChild(bg);
    bg.addEventListener('click',e=>{if(e.target===bg)bg.classList.remove('open')});
    bg.querySelector('.nx6-close').onclick=()=>bg.classList.remove('open');
    return bg;
  }
  async function vipCode(){
    const c=sb(),u=user();if(!c||!u)return null;
    try{
      let {data,error}=await c.from('nexoplay_vip_referral_codes').select('id,code,uses,remaining_uses').eq('owner_user_id',u.id).maybeSingle();
      if(error)throw error;
      if(data&&Number(data.remaining_uses)>0)return data;
      const code='VIP-'+Math.random().toString(36).slice(2,8).toUpperCase();
      if(data){const r=await c.from('nexoplay_vip_referral_codes').update({code,uses:0,remaining_uses:1,updated_at:new Date().toISOString()}).eq('id',data.id).eq('owner_user_id',u.id);if(r.error)throw r.error;return {...data,code,uses:0,remaining_uses:1};}
      const r=await c.from('nexoplay_vip_referral_codes').insert({owner_user_id:u.id,code,uses:0,remaining_uses:1}).select('id,code,uses,remaining_uses').single();if(r.error)throw r.error;return r.data;
    }catch(e){console.warn('NexoPlay V6 VIP code:',e);return null;}
  }
  async function vipData(){
    const c=sb();if(!c)return {requests:[],clients:[]};
    try{
      const [a,b]=await Promise.all([c.rpc('vip_list_referral_requests'),c.rpc('vip_get_referred_clients')]);
      return {requests:Array.isArray(a.data)?a.data:[],clients:Array.isArray(b.data)?b.data:[]};
    }catch(e){return {requests:[],clients:[],error:e};}
  }
  function vipCenterMarkup(data){
    const u=user();let st={};try{st=JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')[u?.id]||{}}catch(_){ }
    const verified=(data.clients||[]).length;
    const pending=(data.requests||[]).filter(x=>x.status==='pending').length;
    return `<div class="nx6-membership-grid"><div class="nx6-card hero"><div class="nx5-kicker">NEXOPLAY VIP MEMBERSHIP</div><h3>Tu Centro VIP 👑</h3><p>Aquí encuentras tus beneficios, tu membresía y acceso rápido a tus herramientas VIP. El código de afiliación se administra exclusivamente desde tu Panel de Referidos.</p><span class="nx6-badge">● VIP activo</span><div class="nx6-benefits"><div class="nx6-benefit"><strong>🏷️ Precios especiales</strong><span>Descuentos configurados por administración.</span></div><div class="nx6-benefit"><strong>🎰 Ruleta VIP</strong><span>Premios exclusivos y más puntos Nexo.</span></div><div class="nx6-benefit"><strong>📈 Centro de ventas</strong><span>Herramientas para gestionar tus ventas y entregas.</span></div><div class="nx6-benefit"><strong>👥 Panel de Referidos</strong><span>Solicitudes y clientes vinculados a tu código.</span></div></div><div class="nx6-contact"><strong>💬 Atención directa con el administrador</strong><span>¿Necesitas ayuda como VIP? Comunícate directamente por WhatsApp.</span><a href="https://wa.me/51922535293" target="_blank" rel="noopener">📲 WhatsApp · 922 535 293</a></div></div><div class="nx6-card"><div class="nx5-kicker">TU MEMBRESÍA</div><h4>👑 VIP</h4><p>${st?.rankExpires?'Activo hasta '+new Date(st.rankExpires).toLocaleDateString('es-PE'):'Membresía activa'}</p><div class="nx6-kpis"><div class="nx6-kpi"><span>Descuento</span><b>40%</b></div><div class="nx6-kpi"><span>Referidos</span><b>${verified}</b></div><div class="nx6-kpi"><span>Pendientes</span><b>${pending}</b></div></div><div class="nx6-contact"><strong>🎯 Tus Nexo Puntos</strong><span>${points()} puntos disponibles para participar en dinámicas y recompensas.</span><button class="nx5-action primary" onclick="window.nx5OpenRoulette?.()" style="width:100%">🎰 Abrir Ruleta</button></div></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="nx5-action primary" onclick="window.nx6OpenReferralManager()">👥 Abrir Panel de Referidos</button><button class="nx5-action" onclick="window.openDistributorPanel?.()">📈 Panel de ventas</button></div>`;
  }
  async function renderVipCenter(){
    if(rankId()!=='vip'){window.showToast?.('El Centro VIP es exclusivo para usuarios VIP.');return;}
    $('nexoVipBody').innerHTML=vipCenterMarkup(await vipData());
  }
  function requestCard(r){const s=String(r.status||'pending'),label=s==='pending'?'Pendiente':s==='approved'?'Verificado':'Rechazado';return `<div class="nx6-request"><div class="nx6-request-id"><div class="nx6-avatar">${s==='approved'?'✓':'👤'}</div><div><strong>${esc(r.referred_username||r.referred_email||'Usuario')}</strong><span>${esc(r.referred_email||'Correo no disponible')}</span><small>Solicitud: ${r.requested_at?new Date(r.requested_at).toLocaleString('es-PE'):'—'}</small></div></div><span class="nx6-status">${label}</span>${s==='pending'?`<div class="nx6-request-actions"><button onclick="window.nx6ReviewReferral('${esc(r.id)}','approve')">✓ Verificar</button><button class="reject" onclick="window.nx6ReviewReferral('${esc(r.id)}','reject')">✕ Rechazar</button></div>`:''}</div>`}
  function clientCard(c){return `<div class="nx6-client"><div class="nx6-client-id"><div class="nx6-avatar">👤</div><div><strong>${esc(c.username||'Sin usuario')}</strong><span>${esc(c.email||'Correo no disponible')}</span><small>Verificado: ${c.verified_at?new Date(c.verified_at).toLocaleDateString('es-PE'):'—'}</small></div></div><div class="nx6-client-metrics"><div class="nx6-metric"><span>Wallet</span><b>S/ ${Number(c.wallet_balance||0).toFixed(2)}</b></div><div class="nx6-metric"><span>Compras</span><b>${Number(c.purchase_count||0)}</b></div></div></div>`}
  function refContent(data,tab='requests'){
    const pending=(data.requests||[]).filter(x=>x.status==='pending').length;
    const c=$('nx6ReferralContent');
    if(!c)return;
    const codeBox=`<div class="nx6-code-box"><div class="nx6-code-label">CÓDIGO PERSONAL · UN SOLO USO</div><div class="nx6-code-value" id="nx6VipCode">Generando…</div><div style="color:#657b94;font-size:10px;line-height:1.55;margin-bottom:9px">Comparte este código para que un usuario solicite Distribuidor. El código se consume al registrar una solicitud y el sistema crea uno nuevo.</div><div class="nx6-code-actions"><button class="primary" onclick="window.nx6CopyVipCode()">📋 Copiar</button><button onclick="window.nx6ShareVipCode()">📤 Compartir</button><button onclick="window.nx6RefreshVipCode()">♻️ Regenerar</button></div></div>`;
    c.innerHTML=codeBox+`<div class="nx6-tabs"><button class="${tab==='requests'?'active':''}" onclick="window.nx6ReferralTab('requests')">🔔 Solicitudes ${pending?`(${pending})`:''}</button><button class="${tab==='clients'?'active':''}" onclick="window.nx6ReferralTab('clients')">👥 Mis clientes</button></div><div class="nx6-list">${tab==='requests'?(data.requests||[]).filter(x=>x.status==='pending').length?(data.requests||[]).filter(x=>x.status==='pending').map(requestCard).join(''):'<div class="nx5-empty">🎉 No tienes solicitudes pendientes.</div>':(data.clients||[]).length?(data.clients||[]).map(clientCard).join(''):'<div class="nx5-empty">Todavía no tienes clientes verificados.</div>'}</div><div class="nx6-privacy">🔒 Privacidad: nombre de usuario, correo completo, Wallet, cantidad de compras y fecha de verificación. No se muestran productos ni detalles de compras. El VIP no puede retirar el rango.</div>`;
    vipCode().then(d=>{const el=$('nx6VipCode');if(el)el.textContent=d?.code||'No disponible';});
  }
  let refCache={requests:[],clients:[]},refTab='requests';
  async function openReferralManager(){
    if(rankId()!=='vip'){window.showToast?.('Esta sección es exclusiva para usuarios VIP.');return;}
    const bg=ensureReferralManager();bg.classList.add('open');refCache=await vipData();refTab='requests';refContent(refCache,refTab);
  }
  function referralTab(t){refTab=t;refContent(refCache,refTab);}
  async function reviewReferral(id,action){
    const c=sb();if(!c)return;try{const {data,error}=await c.rpc('review_vip_referral_request',{p_request_id:id,p_action:action});if(error)throw error;const row=Array.isArray(data)?data[0]:data;if(row?.ok===false)throw new Error(row.message||'No se pudo procesar.');window.showToast?.(action==='approve'?'✅ Cliente verificado como Distribuidor.':'Solicitud rechazada.');refCache=await vipData();refContent(refCache,refTab);renderVipCenter();syncApprovedReferral();}catch(e){window.showToast?.(e.message||'No se pudo procesar la solicitud.');}
  }
  function copyVipCode(){const code=$('nx6VipCode')?.textContent||'';if(!code||code==='Generando…'||code==='No disponible')return;navigator.clipboard?.writeText(code).then(()=>window.showToast?.('Código copiado.')).catch(()=>window.showToast?.('No se pudo copiar.'));}
  function shareVipCode(){const code=$('nx6VipCode')?.textContent||'';if(!code||code==='Generando…')return;const text=`🎁 Usa mi código ${code} en NexoPlay para solicitar Distribuidor.`;if(navigator.share)navigator.share({text}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');}
  async function refreshVipCode(){const d=await vipCode();const el=$('nx6VipCode');if(el)el.textContent=d?.code||'No disponible';}

  function rouletteConfig(){
    return {
      frecuente:{label:'Cliente Frecuente',prizes:[['+10 puntos',10],['+20 puntos',20],['+30 puntos',30],['+50 puntos',50],['+15 puntos',15],['+25 puntos',25],['+40 puntos',40],['+10 puntos',10]]},
      distribuidor:{label:'Distribuidor',prizes:[['+25 puntos',25],['+50 puntos',50],['+75 puntos',75],['+100 puntos',100],['+40 puntos',40],['+60 puntos',60],['+120 puntos',120],['+30 puntos',30]]},
      vip:{label:'VIP',prizes:[['+50 puntos',50],['+100 puntos',100],['+150 puntos',150],['+250 puntos',250],['+75 puntos',75],['+125 puntos',125],['+300 puntos',300],['+100 puntos',100]]}
    };
  }
  function rouletteState(){const u=user();if(!u)return {};try{return JSON.parse(localStorage.getItem(rouletteKey)||'{}')[u.id]||{}}catch(_){return {}}}
  function saveRouletteState(v){const u=user();if(!u)return;let m={};try{m=JSON.parse(localStorage.getItem(rouletteKey)||'{}')}catch(_){}m[u.id]=v;localStorage.setItem(rouletteKey,JSON.stringify(m));}
  function canSpin(){const s=rouletteState(),last=Number(s.lastSpin||0);return !last||Date.now()-last>=86400000}
  function spinText(){const last=Number(rouletteState().lastSpin||0);if(!last)return 'Disponible ahora';const left=Math.max(0,86400000-(Date.now()-last));if(!left)return 'Disponible ahora';return `Disponible en ${Math.floor(left/3600000)}h ${Math.ceil((left%3600000)/60000)}m`;}
  function patchRoulette(){
    const open=window.nx5OpenRoulette;if(typeof open!=='function'||open.__nx6)return;
    const f=function(){const r=rankId();const cfg=rouletteConfig()[r];if(!cfg){window.showToast?.('La Ruleta Nexo está disponible desde Cliente Frecuente, Distribuidor o VIP.');return;}open.apply(this,arguments);setTimeout(()=>{const sub=document.querySelector('#nexoRouletteBg .nx5-sub');if(sub)sub.textContent=`${cfg.label}: tienes premios exclusivos y un giro cada 24 horas.`;const wheel=document.querySelector('#nexoRouletteBg #nx5Wheel');if(wheel){const spans=[...wheel.querySelectorAll('span')];cfg.prizes.forEach((x,i)=>{if(spans[i])spans[i].textContent=x[0]})}const btn=document.querySelector('#nexoRouletteBg #nx5SpinBtn');if(btn&&!canSpin())btn.disabled=true;const res=document.querySelector('#nexoRouletteBg #nx5RouletteResult');if(res)res.innerHTML=`Nexo Puntos: <b>${points()}</b> · Próximo giro: <b>${esc(spinText())}</b>`;const state=rouletteState();if(btn){btn.onclick=()=>{if(!canSpin()){window.showToast?.('Espera al próximo giro.');return;}const i=Math.floor(Math.random()*cfg.prizes.length),pr=cfg.prizes[i],w=document.querySelector('#nexoRouletteBg #nx5Wheel');btn.disabled=true;if(w){w.style.setProperty('--nx5-spin',String(1440+i*45)+'deg');w.classList.remove('spinning');void w.offsetWidth;w.classList.add('spinning')}setTimeout(()=>{addPoints(pr[1]);saveRouletteState({lastSpin:Date.now(),lastPrize:pr[1],rank:r});if(res)res.innerHTML=`🎉 Ganaste <b>${esc(pr[0])}</b>. Ahora tienes <b>${points()}</b> puntos.`;btn.textContent='⏳ Vuelve mañana';renderProfile();window.showToast?.(`🎉 ${pr[0]}`);},1450)}}},20);};
    f.__nx6=true;window.nx5OpenRoulette=f;
  }
  function renderProfile(){try{window.nx5RefreshProfile?.();}catch(_){}}
  async function syncApprovedReferral(){
    const u=user(),c=sb();if(!u||!c)return;
    try{const {data,error}=await c.rpc('my_vip_referral_status');if(error||!Array.isArray(data))return;const row=data.find(x=>x.status==='approved');if(!row)return;let p={};try{p=JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')}catch(_){p={}};const cur=p[u.id]||{};if(cur.rankId==='distribuidor')return;p[u.id]={...cur,rankId:'distribuidor',rankSince:row.reviewed_at||new Date().toISOString(),rankExpires:row.rank_expires||null};localStorage.setItem('nexoplay_rank_progress_v2',JSON.stringify(p));window.renderUserRanks?.();window.renderProducts?.();window.showToast?.('🎉 Tu solicitud fue verificada. Ya eres Distribuidor.');}catch(_){}
  }

  function install(){
    loadBaseOverrides();
    addTickers();
    applyAuthTheme();
    patchRoulette();

    // Centro VIP: membership/benefits only; code moved to Panel de Referidos.
    window.openNexoVip=async function(){if(rankId()!=='vip'){window.showToast?.('El Centro VIP es exclusivo para usuarios VIP.');return;}$('nexoVipBg')?.classList.add('open');await renderVipCenter();addTickers();};
    window.renderVip=renderVipCenter;
    window.closeNexoVip=()=>{$('nexoVipBg')?.classList.remove('open')};
    window.openNexoVipReferals=window.openNexoVipReferals||openReferralManager;
    window.nx6OpenReferralManager=openReferralManager;
    window.nx6ReferralTab=referralTab;
    window.nx6ReviewReferral=reviewReferral;
    window.nx6CopyVipCode=copyVipCode;
    window.nx6ShareVipCode=shareVipCode;
    window.nx6RefreshVipCode=refreshVipCode;

    // Menú: nombres claros y sin duplicidad visual.
    const legacyVip=$('vipMenuBtn');if(legacyVip){legacyVip.textContent='👑 Centro VIP';legacyVip.style.display=rankId()==='vip'?'block':'none';}
    const oldVipDup=$('nx5VipMenu');if(oldVipDup)oldVipDup.style.display='none';
    const menu=$('sideMenu');
    if(menu&&!$('nx6VipReferralMenu')){
      const b=document.createElement('button');b.id='nx6VipReferralMenu';b.textContent='👥 Panel de Referidos';b.style.display='none';b.onclick=()=>{window.closeSideMenu?.();openReferralManager()};menu.insertBefore(b,$('adminMenuBtn')||menu.lastElementChild);
    }
    const rb=$('nx6VipReferralMenu');if(rb)rb.style.display=rankId()==='vip'?'block':'none';
    const distCode=$('distReferralMenuBtn');if(distCode&&rankId()==='vip')distCode.style.display='none';

    // Patch legacy title line / ticker after dynamically opened modals.
    const mo=new MutationObserver(()=>{addTickers();applyAuthTheme();const b=$('nx6VipReferralMenu');if(b)b.style.display=rankId()==='vip'?'block':'none';});
    mo.observe(document.body,{childList:true,subtree:true});
    syncApprovedReferral();
    // Initial local override load can race with the legacy initial render; re-apply once.
    setTimeout(()=>{loadBaseOverrides();addTickers();applyAuthTheme();patchRoulette()},250);
  }
  if(document.readyState==='loading')window.addEventListener('load',install,{once:true});else setTimeout(install,30);
})();
