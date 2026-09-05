/* NexoPlay V5 — Perfil dinámico, Ruleta Nexo, Centro VIP + referidos moderados y ventas mejoradas. */
(function(){
  'use strict';
  const PROFILE_POINTS='nexoplay_points_v1';
  const ROULETTE='nexoplay_roulette_v1';
  const REFRESH_MS=12000;
  const $=id=>document.getElementById(id);
  const esc=v=>typeof window.escapeHTML==='function'?window.escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const user=()=>window.__nexoGetCurrentUser?.()||window.currentUser||null;
  const sb=()=>window.__nexoGetSupabase?.()||window.supabaseClient||null;
  const rankState=()=>{const u=user();if(!u)return null;try{return JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')[u.id]||null}catch(_){return null}};
  const rankName=()=>{const id=rankState()?.rankId||'cliente';if(id==='vip')return 'VIP';if(id==='distribuidor')return 'Distribuidor';if(id==='frecuente')return 'Cliente Frecuente';return 'Cliente';};
  function points(){const u=user();if(!u)return 0;try{return Number(JSON.parse(localStorage.getItem(PROFILE_POINTS)||'{}')[u.id]||0)}catch(_){return 0}}
  function setPoints(n){const u=user();if(!u)return;let p={};try{p=JSON.parse(localStorage.getItem(PROFILE_POINTS)||'{}')}catch(_){}p[u.id]=Math.max(0,Math.floor(Number(n)||0));localStorage.setItem(PROFILE_POINTS,JSON.stringify(p));}
  function addPoints(n){setPoints(points()+Number(n||0));}
  function purchases(){const u=user();if(!u)return 0;try{const rows=JSON.parse(localStorage.getItem('nexoplay_orders')||'[]');return rows.filter(o=>o?.ownerUserId===u.id).reduce((n,o)=>n+(Array.isArray(o.items)?o.items.length:1),0)}catch(_){return 0}}
  function rouletteState(){const u=user();if(!u)return null;try{return JSON.parse(localStorage.getItem(ROULETTE)||'{}')[u.id]||{}}catch(_){return {}}}
  function saveRoulette(v){const u=user();if(!u)return;let all={};try{all=JSON.parse(localStorage.getItem(ROULETTE)||'{}')}catch(_){}all[u.id]=v;localStorage.setItem(ROULETTE,JSON.stringify(all));}
  function canSpin(){const last=Number(rouletteState()?.lastSpin||0);return !last||Date.now()-last>=86400000}
  function nextSpinText(){const last=Number(rouletteState()?.lastSpin||0);if(!last)return 'Disponible ahora';const left=Math.max(0,86400000-(Date.now()-last));if(!left)return 'Disponible ahora';const h=Math.floor(left/3600000),m=Math.ceil((left%3600000)/60000);return `Disponible en ${h}h ${m}m`;}
  function ensureRoulette(){let bg=$('nexoRouletteBg');if(bg)return bg;bg=document.createElement('div');bg.id='nexoRouletteBg';bg.className='nx5-overlay';bg.innerHTML=`<div class="nx5-modal nx5-roulette-modal" role="dialog" aria-modal="true"><button class="nx5-close" aria-label="Cerrar">×</button><div class="nx5-kicker">NEXOPLAY REWARDS</div><h2>🎰 Ruleta Nexo</h2><p class="nx5-sub">Gira una vez cada 24 horas y acumula Nexo Puntos.</p><div class="nx5-wheel-wrap"><div class="nx5-pointer">▼</div><div class="nx5-wheel" id="nx5Wheel"><span>+10</span><span>+20</span><span>+50</span><span>+15</span><span>+30</span><span>+100</span><span>+20</span><span>+10</span></div></div><div class="nx5-roulette-result" id="nx5RouletteResult">Tu próximo giro: <b>${nextSpinText()}</b></div><button class="nx5-primary" id="nx5SpinBtn">🎰 Girar ruleta</button></div>`;document.body.appendChild(bg);bg.addEventListener('click',e=>{if(e.target===bg)bg.classList.remove('open')});bg.querySelector('.nx5-close').onclick=()=>bg.classList.remove('open');bg.querySelector('#nx5SpinBtn').onclick=spinRoulette;return bg}
  function openRoulette(){if(!user()){window.showToast?.('Inicia sesión para usar la Ruleta Nexo.');window.openProfile?.();return}const bg=ensureRoulette();bg.classList.add('open');refreshRouletteUI();}
  function refreshRouletteUI(){const b=$('nx5SpinBtn'),r=$('nx5RouletteResult');if(b){b.disabled=!canSpin();b.textContent=canSpin()?'🎰 Girar ruleta':'⏳ Espera tu próximo giro'}if(r)r.innerHTML=`Nexo Puntos: <b>${points()}</b> · Próximo giro: <b>${esc(nextSpinText())}</b>`;}
  function spinRoulette(){if(!canSpin()){window.showToast?.('La ruleta vuelve a estar disponible cada 24 horas.');return}const wheel=$('nx5Wheel'),btn=$('nx5SpinBtn'),prizes=[10,20,50,15,30,100,20,10],index=Math.floor(Math.random()*prizes.length),value=prizes[index];if(btn)btn.disabled=true;if(wheel){wheel.style.setProperty('--nx5-spin',String(1440+index*45)+'deg');wheel.classList.remove('spinning');void wheel.offsetWidth;wheel.classList.add('spinning')}setTimeout(()=>{addPoints(value);saveRoulette({lastSpin:Date.now(),lastPrize:value});if($('nx5RouletteResult'))$('nx5RouletteResult').innerHTML=`🎉 Ganaste <b>+${value} Nexo Puntos</b>. Ahora tienes <b>${points()}</b> puntos.`;if(btn){btn.disabled=true;btn.textContent='⏳ Vuelve mañana'}renderProfileEnhancements();window.showToast?.(`🎉 +${value} Nexo Puntos`);},1450)}
  function menuExtras(){const m=$('sideMenu');if(!m)return;if(!$('nx5RouletteMenu')){const b=document.createElement('button');b.id='nx5RouletteMenu';b.textContent='🎰 Ruleta Nexo';b.onclick=()=>{window.closeSideMenu?.();openRoulette()};m.insertBefore(b,$('adminMenuBtn')||m.lastElementChild)}if(user())$('nx5RouletteMenu').style.display='block';else $('nx5RouletteMenu').style.display='none';}

  function profileMarkup(){const u=user();if(!u)return;const host=$('profileView');if(!host)return;const name=u.user_metadata?.username||u.user_metadata?.name||u.email?.split('@')[0]||'usuario';const email=u.email||'—';const joined=u.created_at?new Date(u.created_at).toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'}):'—';const pts=points(),buy=purchases(),rn=rankName();const vip=rn==='VIP';host.querySelector('.profile-card')?.classList.add('nx5-profile-card');host.innerHTML=`<div class="nx5-profile-hero"><div class="nx5-profile-orb">${vip?'👑':'👤'}</div><div class="nx5-profile-main"><div class="nx5-kicker">NEXOPLAY IDENTITY</div><h3>@${esc(name)}</h3><p>${esc(email)}</p><div class="nx5-profile-pills"><span>● Cuenta activa</span><span>🏆 ${esc(rn)}</span><span>📅 ${esc(joined)}</span></div></div><button class="nx5-profile-refresh" onclick="window.nx5RefreshProfile()">↻</button></div><div class="nx5-profile-grid"><div class="nx5-stat accent"><span>Nexo Puntos</span><b>${pts}</b><small>Premios y dinámicas</small></div><div class="nx5-stat"><span>Compras</span><b>${buy}</b><small>Productos registrados</small></div><div class="nx5-stat"><span>Wallet</span><b id="nx5ProfileWallet">S/ ${Number(window.walletCache?.balance||0).toFixed(2)}</b><small>Saldo disponible</small></div><div class="nx5-stat"><span>Rango</span><b>${esc(rn)}</b><small>${vip?'Beneficios premium':'Sigue avanzando'}</small></div></div><div class="nx5-profile-actions"><button class="nx5-action primary" onclick="window.nx5OpenRoulette()">🎰 Ruleta Nexo</button><button class="nx5-action" onclick="window.openWallet?.()">👛 Wallet</button><button class="nx5-action" onclick="window.openRanks?.()">🏆 Mis rangos</button><button class="nx5-action" onclick="window.openOrders?.()">🛍️ Mis compras</button><button class="nx5-action" onclick="window.openSupport?.()">🆘 Soporte</button>${vip?'<button class="nx5-action vip" onclick="window.openNexoVip?.()">👑 Centro VIP</button>':''}</div><div class="nx5-profile-panels"><div class="nx5-info-card"><div class="nx5-card-head"><div><span class="nx5-kicker">PROGRESO</span><h4>Tu actividad Nexo</h4></div><b>${Math.min(100,pts%100)}%</b></div><div class="nx5-progress"><i style="width:${Math.min(100,pts%100)}%"></i></div><p>${pts<100?`Te faltan ${100-pts} puntos para tu siguiente recompensa visual.`:'¡Ya superaste 100 puntos! Sigue participando para acumular más.'}</p></div><div class="nx5-info-card"><div class="nx5-card-head"><div><span class="nx5-kicker">RECOMPENSAS</span><h4>Tu próxima dinámica</h4></div><span class="nx5-live">● LIVE</span></div><p>Gira la ruleta una vez al día, gana Nexo Puntos y revisa tus beneficios desde este perfil.</p><button class="nx5-link" onclick="window.nx5OpenRoulette()">Abrir ruleta →</button></div></div><div class="nx5-account-line"><span>📧 <b>Correo</b></span><strong>${esc(email)}</strong><button onclick="window.nx5Copy('${esc(email)}')">Copiar</button></div><div class="nx5-profile-footer"><button class="nx5-action" onclick="window.openWallet?.()">👛 Abrir Wallet</button><button class="nx5-action" onclick="window.openSupport?.()">🆘 Centro de soporte</button><button class="nx5-action danger" onclick="window.logoutUser?.()">Cerrar sesión</button></div><div class="nx5-legacy-bridge" aria-hidden="true"><span id="profileUsername"></span><span id="profileEmailSmall"></span><span id="profilePurchases"></span><span id="profileOrdersCount"></span><span id="profileSpent"></span><span id="profileBalance"></span><span id="profileDetails"></span><span id="profileVerified"></span></div>`;host.style.display='block';}
  function renderProfileEnhancements(){if(user()&&$('profileView')?.style.display!=='none')profileMarkup();}
  async function copy(v){try{await navigator.clipboard.writeText(v);window.showToast?.('Copiado.')}catch(_){window.showToast?.('No se pudo copiar automáticamente.')}}

  async function vipRpc(name,args={}){const client=sb();if(!client)throw new Error('Supabase no está disponible.');const {data,error}=await client.rpc(name,args);if(error)throw error;return Array.isArray(data)?data:data}
  async function loadVipData(){
    if(!user() || rankName()!=='VIP') return {requests:[],clients:[]};
    try {
      const results=await Promise.all([vipRpc('vip_list_referral_requests'),vipRpc('vip_get_referred_clients')]);
      return {requests:Array.isArray(results[0])?results[0]:[],clients:Array.isArray(results[1])?results[1]:[]};
    } catch(e) {
      return {requests:[],clients:[],error:e};
    }
  }
  function vipRequestCard(r){const status=String(r.status||'pending');const badge=status==='pending'?'Pendiente':status==='approved'?'Verificado':'Rechazado';return `<div class="nx5-request ${status}"><div class="nx5-request-main"><div class="nx5-avatar">${status==='approved'?'✓':'👤'}</div><div><strong>${esc(r.referred_username||r.referred_email||'Usuario')}</strong><span>${esc(r.referred_email||'Correo no disponible')}</span><small>Solicitado: ${r.requested_at?new Date(r.requested_at).toLocaleString('es-PE'):'—'}</small></div></div><span class="nx5-status">${badge}</span>${status==='pending'?`<div class="nx5-request-actions"><button onclick="window.nx5ReviewReferral('${esc(r.id)}','approve')">✓ Verificar</button><button class="reject" onclick="window.nx5ReviewReferral('${esc(r.id)}','reject')">✕ Rechazar</button></div>`:''}</div>`}
  function vipClientCard(c){return `<div class="nx5-client-row"><div class="nx5-client-identity"><div class="nx5-avatar">👤</div><div><strong>${esc(c.username||'Sin usuario')}</strong><span>${esc(c.email||'Correo no disponible')}</span><small>Verificado: ${c.verified_at?new Date(c.verified_at).toLocaleDateString('es-PE'):'—'}</small></div></div><div class="nx5-client-metric"><span>Wallet</span><b>S/ ${Number(c.wallet_balance||0).toFixed(2)}</b></div><div class="nx5-client-metric"><span>Compras</span><b>${Number(c.purchase_count||0)}</b></div></div>`}
  async function renderVipV5(){const c=$('nexoVipBody');if(!c||rankName()!=='VIP')return;const data=await loadVipData();const st=rankState()||{},pending=(data.requests||[]).filter(x=>x.status==='pending').length;const codeEl=await getVipCodeSafe();c.innerHTML=`<div class="nx5-vip-hero"><div class="nx5-vip-intro"><div class="nx5-kicker">NEXOPLAY VIP BUSINESS</div><h3>Tu centro, ahora sí es un centro. 👑</h3><p>Gestiona tu código, revisa solicitudes y observa el rendimiento de los clientes que verificaste. Nunca puedes quitarles el rango desde aquí.</p><div class="nx5-vip-actions"><button class="nx5-action primary" onclick="window.nx5OpenReferralManager()">👥 Mis referidos</button><button class="nx5-action" onclick="window.nx5OpenRoulette()">🎰 Ruleta</button><button class="nx5-action" onclick="window.openDistributorPanel?.()">📈 Panel de ventas</button></div></div><div class="nx5-vip-code"><span class="nx5-kicker">CÓDIGO DE UN SOLO USO</span><strong id="nx5VipCode">${esc(codeEl?.code||'Generando…')}</strong><p>Al registrarse una solicitud, este código se consume y se genera otro automáticamente.</p><div><button onclick="window.copyNexoVipCode?.()">📋 Copiar</button><button onclick="window.shareNexoVipCode?.()">📤 Compartir</button><button onclick="window.refreshNexoVipCode?.();setTimeout(window.nx5RenderVip,350)">♻️ Nuevo</button></div></div></div><div class="nx5-vip-kpis"><div><span>Referidos verificados</span><b>${(data.clients||[]).length}</b></div><div><span>Solicitudes pendientes</span><b>${pending}</b></div><div><span>Compras de tus referidos</span><b>${(data.clients||[]).reduce((n,x)=>n+Number(x.purchase_count||0),0)}</b></div><div><span>Rango</span><b>👑 VIP</b></div></div><div class="nx5-vip-tabs"><button class="active" id="nx5VipTabRequests" onclick="window.nx5VipTab('requests')">🔔 Solicitudes ${pending?`<em>${pending}</em>`:''}</button><button id="nx5VipTabClients" onclick="window.nx5VipTab('clients')">👥 Mis clientes</button></div><div id="nx5VipManager" class="nx5-vip-manager">${renderRequestsView(data)}</div><div class="nx5-vip-note">🔒 Privacidad: aquí solo se muestra nombre de usuario, correo completo, Wallet, cantidad de compras y fecha de verificación. No se muestran productos ni movimientos privados.</div>`;}
  function renderRequestsView(data){const req=data.requests||[];return `<div class="nx5-manager-head"><div><span class="nx5-kicker">MODERACIÓN</span><h4>Solicitudes de Distribuidor</h4><p>Verifica únicamente las solicitudes que llegaron a través de tu código.</p></div></div><div class="nx5-request-list">${req.length?req.map(vipRequestCard).join(''):'<div class="nx5-empty">🎉 No tienes solicitudes pendientes. Cuando alguien use tu código, aparecerá aquí.</div>'}</div>`}
  function renderClientsView(data){const clients=data.clients||[];return `<div class="nx5-manager-head"><div><span class="nx5-kicker">CLIENTES VERIFICADOS</span><h4>Mis referidos</h4><p>Solo observación. No hay botones para quitar ni modificar el rango.</p></div><input id="nx5ClientSearch" placeholder="🔎 Buscar por usuario o correo…" oninput="window.nx5FilterClients()"></div><div id="nx5ClientsList" class="nx5-client-list">${clients.length?clients.map(vipClientCard).join(''):'<div class="nx5-empty">Todavía no tienes clientes verificados.</div>'}</div>`}
  let vipCache={requests:[],clients:[]};
  async function refreshVipManager(){vipCache=await loadVipData();if($('nx5VipManager')){const active=$('nx5VipTabClients')?.classList.contains('active');$('nx5VipManager').innerHTML=active?renderClientsView(vipCache):renderRequestsView(vipCache);}}
  function vipTab(tab){$('nx5VipTabRequests')?.classList.toggle('active',tab==='requests');$('nx5VipTabClients')?.classList.toggle('active',tab==='clients');if($('nx5VipManager'))$('nx5VipManager').innerHTML=tab==='clients'?renderClientsView(vipCache):renderRequestsView(vipCache);}
  function filterClients(){const q=String($('nx5ClientSearch')?.value||'').toLowerCase().trim();document.querySelectorAll('.nx5-client-row').forEach(row=>{row.style.display=!q||row.textContent.toLowerCase().includes(q)?'grid':'none'})}
  async function reviewReferral(id,action){if(!id)return;const label=action==='approve'?'verificar':'rechazar';if(!confirm(`¿Quieres ${label} esta solicitud?`))return;try{await vipRpc('review_vip_referral_request',{p_request_id:id,p_action:action});window.showToast?.(action==='approve'?'✅ Cliente verificado como Distribuidor.':'Solicitud rechazada.');await refreshVipManager();await renderVipV5()}catch(e){window.showToast?.(e?.message||'No se pudo procesar la solicitud.');}}
  async function getVipCodeSafe(){try{const client=sb(),u=user();if(!client||!u)return null;const {data,error}=await client.from('nexoplay_vip_referral_codes').select('id,code,uses,remaining_uses').eq('owner_user_id',u.id).maybeSingle();if(error)throw error;return data}catch(_){return null}}
  async function submitReferral(){const input=$('nexoReferralInput'),code=String(input?.value||'').trim().toUpperCase();if(!code){window.showToast?.('Ingresa tu código.');return}const u=user();if(!u){window.showToast?.('Inicia sesión para usar un referido.');return}try{const row=await vipRpc('submit_vip_referral',{p_code:code});if(!row?.ok)throw new Error(row?.message||'No se pudo registrar el código.');window.showToast?.('✅ Tu código fue registrado correctamente. Quedó pendiente de verificación por el VIP que te lo compartió.');window.closeNexoReferral?.();if(input)input.value='';}catch(e){window.showToast?.(e?.message||'El código es inválido o ya fue utilizado.');}}
  async function syncApprovedReferral(){const u=user();if(!u)return;try{const rows=await vipRpc('my_vip_referral_status');const row=(Array.isArray(rows)?rows:[]).find(x=>x.status==='approved');if(!row)return;let p={};try{p=JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')}catch(_){}const current=p[u.id]||{};if(current.rankId!=='distribuidor'){let cfgRanks=[];try{cfgRanks=JSON.parse(localStorage.getItem('nexoplay_rank_config_v2')||'[]')}catch(_){}const dist=cfgRanks.find(x=>x.id==='distribuidor');const expires=row.rank_expires||(dist?.duration?new Date(Date.now()+Number(dist.duration)*86400000).toISOString():null);p[u.id]={...current,rankId:'distribuidor',rankSince:row.reviewed_at||new Date().toISOString(),rankExpires:expires};localStorage.setItem('nexoplay_rank_progress_v2',JSON.stringify(p));window.renderUserRanks?.();window.renderProducts?.();window.updateCart?.();window.showToast?.('🎉 Tu solicitud fue verificada. Ya eres Distribuidor.');}}
    catch(_){}}

  // Override profile renderer only after the original runtime has loaded; all original actions remain available.
  function install(){
    const oldProfile=window.showProfileView;
    if(typeof oldProfile==='function' && !oldProfile.__nx5){
      const wrapped=async function(){
        const out=await oldProfile.apply(this,arguments);
        setTimeout(()=>profileMarkup(),0);
        return out;
      };
      wrapped.__nx5=true;
      window.showProfileView=wrapped;
    }

    window.nx5OpenRoulette=openRoulette;
    window.nx5RefreshProfile=renderProfileEnhancements;
    window.nx5Copy=copy;
    window.nx5RenderVip=renderVipV5;
    window.nx5OpenReferralManager=()=>{
      if(rankName()!=='VIP'){window.showToast?.('Esta sección es exclusiva para VIP.');return;}
      renderVipV5();
    };
    window.nx5VipTab=vipTab;
    window.nx5FilterClients=filterClients;
    window.nx5ReviewReferral=reviewReferral;
    window.nx5SubmitReferral=submitReferral;
    window.redeemNexoReferral=submitReferral;

    const oldOpenVip=window.openNexoVip;
    if(typeof oldOpenVip==='function' && !oldOpenVip.__nx5){
      const f=function(){
        if(rankName()!=='VIP'){window.showToast?.('El Centro VIP es exclusivo para usuarios VIP.');return;}
        const out=oldOpenVip.apply(this,arguments);
        setTimeout(renderVipV5,30);
        return out;
      };
      f.__nx5=true;
      window.openNexoVip=f;
    }
    window.renderVip=renderVipV5;

    const oldRefreshMenu=window.refreshMenu;
    window.refreshMenu=function(){
      if(typeof oldRefreshMenu==='function')oldRefreshMenu.apply(this,arguments);
      menuExtras();
      const vipMenu=$('nx5VipMenu');
      if(vipMenu)vipMenu.style.display=rankName()==='VIP'?'block':'none';
    };

    menuExtras();
    const m=$('sideMenu');
    if(m && !$('nx5VipMenu')){
      const b=document.createElement('button');
      b.id='nx5VipMenu';
      b.textContent='👑 Centro VIP · Referidos';
      b.style.display='none';
      b.onclick=()=>{window.closeSideMenu?.();window.openNexoVip?.();};
      m.insertBefore(b,$('distReferralMenuBtn')||m.lastElementChild);
    }
    window.refreshMenu?.();

    const u=user();
    if(u && !points()){
      const n=purchases();
      if(n)setPoints(n*10);
    }
    syncApprovedReferral();
  }
  if(document.readyState==='loading')window.addEventListener('load',install,{once:true});else setTimeout(install,0);
})();
