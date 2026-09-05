/* NexoPlay V7 — última pasada solicitada: UX de escritorio, ventas de distribuidores,
   datos extra al admin, centro VIP limpio, wallet claro y fallbacks de logos. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const user=()=>window.__nexoGetCurrentUser?.()||window.currentUser||null;
  const sb=()=>window.__nexoGetSupabase?.()||window.supabaseClient||null;
  const esc=v=>typeof window.escapeHTML==='function'?window.escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const ORDERS_KEY='nexoplay_orders';
  const CUSTOMER_KEY='nexoplay_distributor_customer_v1';
  const COMMUNITY_URL='PON_AQUI_TU_ENLACE_DE_COMUNIDAD';
  const ADMIN_WA='51922535293';
  const names=['Netflix','Disney+','HBO Max','Paramount+','Prime Video','YouTube Premium','Crunchyroll','Canva','ViX','Spotify','Free Fire','Roblox','Steam','PlayStation','Xbox','ChatGPT','Claude','Gemini','YouTube Music','Apple Music','Google One','CapCut','Adobe','Coursera','Microsoft 365','VPN','Cloud Storage'];
  const rankId=()=>{const u=user();if(!u)return'cliente';try{return JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')[u.id]?.rankId||'cliente'}catch(_){return'cliente'}};
  const isBiz=()=>rankId()==='vip'||rankId()==='distribuidor';
  const localOrders=()=>{try{return JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')}catch(_){return[]}};
  const saveOrders=v=>{try{localStorage.setItem(ORDERS_KEY,JSON.stringify(v))}catch(_){}};
  const currentBusinessOrders=()=>{const u=user();if(!u)return[];return localOrders().filter(o=>o?.ownerUserId===u.id&&o?.distributorCustomer)};
  const daysLeft=v=>{if(!v)return null;const d=/^\d{4}-\d{2}-\d{2}$/.test(String(v))?new Date(v+'T23:59:59'):new Date(v);if(Number.isNaN(d.getTime()))return null;return Math.ceil((d-Date.now())/86400000)};
  const saleText=o=>(Array.isArray(o?.items)?o.items:[]).map(x=>x?.name||x?.product||'Producto').join(', ')||'Cuenta digital';
  const customerData=()=>{try{return JSON.parse(localStorage.getItem(CUSTOMER_KEY)||'null')}catch(_){return null}};

  function ensureCommunity(){return COMMUNITY_URL&&COMMUNITY_URL!=='PON_AQUI_TU_ENLACE_DE_COMUNIDAD'?COMMUNITY_URL:''}
  function openCommunity(){const u=ensureCommunity();if(!u){window.showToast?.('Configura primero el enlace de la comunidad en js/nexoplay-v7.js.');return}window.open(u,'_blank','noopener')}

  // -------------------- Perfil: escritorio compacto / móvil intacto --------------------
  function tuneProfileLayout(){
    const bg=$('authBg');
    if(!bg)return;
    const profile=$('profileView');
    const isProfile=!!profile && profile.style.display!=='none' && !($('loginForm')?.style.display!=='none') && !($('registerForm')?.style.display!=='none');
    if(isProfile){bg.dataset.nx8Profile='1';bg.dataset.nx7Mode='profile';}
    else{delete bg.dataset.nx8Profile;if(bg.dataset.nx7Mode==='profile')delete bg.dataset.nx7Mode;}
  }

  // -------------------- Centro VIP: membership only --------------------
  function vipCenter(){
    const host=$('nexoVipBody'),u=user();
    if(!host||!u||rankId()!=='vip')return;
    let st={};try{st=JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')[u.id]||{}}catch(_){ }
    const points=(()=>{try{return Number(JSON.parse(localStorage.getItem('nexoplay_points_v1')||'{}')[u.id]||JSON.parse(localStorage.getItem('nexoplay_points_v1')||'{}')[u.id]||0)}catch(_){return 0}})();
    const community=ensureCommunity();
    host.innerHTML=`
      <div class="nx7-vip-shell">
        <section class="nx7-vip-card nx7-vip-hero">
          <div class="nx7-vip-kicker">NEXOPLAY VIP MEMBERSHIP</div>
          <div class="nx7-vip-title-row"><div><h3>Tu Centro VIP 👑</h3><p>Todo lo importante de tu membresía, sin mezclarlo con el sistema de referidos.</p></div><span class="nx7-live-pill">● VIP ACTIVO</span></div>
          <div class="nx7-vip-hero-grid">
            <div><div class="nx7-kicker">MEMBRESÍA</div><strong class="nx7-big">VIP</strong><span class="nx7-muted">${st.rankExpires?'Activo hasta '+new Date(st.rankExpires).toLocaleDateString('es-PE'):'Membresía activa'}</span></div>
            <div><div class="nx7-kicker">DESCUENTO</div><strong class="nx7-big">40%</strong><span class="nx7-muted">Beneficio configurado por administración</span></div>
            <div><div class="nx7-kicker">NEXO PUNTOS</div><strong class="nx7-big">${points}</strong><span class="nx7-muted">Participa en dinámicas y recompensas</span></div>
          </div>
        </section>
        <section class="nx7-vip-card"><div class="nx7-section-head"><div><div class="nx7-vip-kicker">BENEFICIOS VIP</div><h4>Lo que incluye tu membresía</h4></div></div>
          <div class="nx7-benefit-grid">
            <article><b>🏷️ Precios especiales</b><span>Accede a los descuentos y condiciones configurados para VIP.</span></article>
            <article><b>🎰 Ruleta Nexo VIP</b><span>Premios superiores y más Nexo Puntos que otros rangos.</span><button class="nx7-soft-btn" onclick="window.nx5OpenRoulette?.()">Abrir ruleta</button></article>
            <article><b>📈 Panel de ventas</b><span>Gestiona tus ventas, clientes y entregas desde tu espacio profesional.</span><button class="nx7-soft-btn" onclick="window.openDistributorPanel?.()">Abrir ventas</button></article>
            <article><b>👥 Panel de referidos</b><span>Administra solicitudes y observa únicamente a tus clientes vinculados.</span><button class="nx7-soft-btn" onclick="window.nx6OpenReferralManager?.()">Abrir referidos</button></article>
            <article><b>💬 Atención directa</b><span>Comunícate directamente con el administrador para soporte VIP.</span><a class="nx7-wa" target="_blank" rel="noopener" href="https://wa.me/${ADMIN_WA}">WhatsApp · 922 535 293</a></article>
            <article><b>🌐 Comunidad VIP</b><span>Espacio exclusivo para compartir avisos, novedades y beneficios.</span>${community?`<button class="nx7-soft-btn" onclick="window.nx7OpenCommunity()">Unirme a la comunidad VIP</button>`:'<small class="nx7-config-note">Configura el enlace de comunidad en V7.</small>'}</article>
          </div>
        </section>
        <section class="nx7-vip-card nx7-vip-footer-card"><div><strong>Tu ventaja VIP</strong><span>Más herramientas, atención directa y acceso a dinámicas premium.</span></div><button class="nx7-primary" onclick="window.nx6OpenReferralManager?.()">👥 Ir a Panel de Referidos</button></section>
      </div>`;
  }

  function patchVipEntrypoints(){
    const fn=function(){if(rankId()!=='vip'){window.showToast?.('El Centro VIP es exclusivo para usuarios VIP.');return}const bg=$('nexoVipBg');bg?.classList.add('open');vipCenter();};
    fn.__nx8=true;window.openNexoVip=fn;window.openVip=fn;window.renderVip=vipCenter;window.nx5RenderVip=vipCenter;
    const btn=$('vipMenuBtn');if(btn){btn.onclick=()=>{window.closeSideMenu?.();fn();}}
    const dup=$('nx5VipMenu');if(dup){dup.style.display='none';dup.onclick=()=>fn();}
  }

  // -------------------- Datos de venta: persistencia local + Supabase --------------------
  function captureCustomerForNextCheckout(){
    if(!isBiz())return null;
    const name=$('distCustomerName')?.value?.trim()||'';
    const phone=$('distCustomerPhone')?.value?.trim()||'';
    const saleAmount=Number($('distSaleAmount')?.value||0);
    if(name.length<2){window.showToast?.('Escribe el nombre de tu cliente.');return null}
    if(phone.replace(/\D/g,'').length<9){window.showToast?.('Ingresa un WhatsApp válido para tu cliente.');return null}
    if(!(saleAmount>0)){window.showToast?.('Indica el monto vendido a tu cliente.');return null}
    return {name,phone,saleAmount:Number(saleAmount.toFixed(2))};
  }

  function patchCheckout(){
    const original=window.checkout;
    if(typeof original!=='function'||original.__nx7)return;
    const wrapped=async function(){
      let customer=null;
      if(isBiz()){
        customer=captureCustomerForNextCheckout();
        if(!customer)return;
        window.__nx7PendingCustomer=customer;
      }
      const before=localOrders().length;
      try{await original.apply(this,arguments)}finally{
        const after=localOrders();
        if(isBiz()&&after.length>before){
          const order=after[after.length-1];
          if(order&&window.__nx7PendingCustomer){order.distributorCustomer=window.__nx7PendingCustomer;after[after.length-1]=order;saveOrders(after);await updateRemoteOrderMetadata(order).catch(()=>{});}
          window.__nx7PendingCustomer=null;
          window.renderDistributorPanel?.();
        }
      }
    };
    wrapped.__nx7=true;window.checkout=wrapped;
  }

  async function updateRemoteOrderMetadata(order){
    const c=sb(),u=user();if(!c||!u||!order?.id)return;
    try{
      const rows=(Array.isArray(order.items)?order.items:[]).map(x=>({...x,customer_name:order.distributorCustomer?.name||'',customer_phone:order.distributorCustomer?.phone||'',sale_amount:Number(order.distributorCustomer?.saleAmount||0),profile_name:x.profile_name||order.customerData?.profileName||'',profile_id:x.profile_id||order.customerData?.profileId||'',extra_data:x.extra_data||order.customerData?.extraData||''}));
      await c.from('nexoplay_orders').update({items:rows,updated_at:new Date().toISOString()}).eq('user_id',u.id).eq('order_code',String(order.id));
    }catch(_){ }
  }

  async function syncBusinessOrders(){
    const c=sb(),u=user();if(!c||!u||!isBiz())return;
    try{
      const {data,error}=await c.from('nexoplay_orders').select('id,order_code,user_id,items,total,payment_method,payment_status,delivery_status,delivery_email,delivery_password,delivery_profile,delivery_pin,purchase_date,expiry_date,delivered_at,created_at,updated_at').eq('user_id',u.id).eq('payment_method','Wallet').order('created_at',{ascending:false}).limit(100);
      if(error||!Array.isArray(data))return;
      const orders=localOrders();let changed=false;
      data.forEach(r=>{
        const remoteId=String(r.order_code||r.id||'');
        const idx=orders.findIndex(o=>String(o.id)===remoteId&&String(o.ownerUserId)===String(u.id));
        const items=Array.isArray(r.items)?r.items:[];
        const meta=items.find(x=>x&&((x.customer_name||x.customer_phone||x.sale_amount)>0||x.customer_name||x.customer_phone));
        const metaCustomer=meta?{name:meta.customer_name||'',phone:meta.customer_phone||'',saleAmount:Number(meta.sale_amount||0)}:null;
        if(idx<0 && metaCustomer){
          orders.push({
            id:remoteId,ownerUserId:String(u.id),items,total:Number(r.total||0),paymentMethod:r.payment_method||'Wallet',
            date:r.purchase_date||r.created_at,status:r.delivery_status||'pending',deliveryStatus:r.delivery_status||'pending',
            deliveryEmail:r.delivery_email||'',deliveryPassword:r.delivery_password||'',deliveryProfile:r.delivery_profile||'',
            deliveryPin:r.delivery_pin||'',deliveryPurchase:r.purchase_date||'',deliveryExpire:r.expiry_date||'',
            deliveryAt:r.delivered_at||'',updatedAt:r.updated_at||r.created_at,distributorCustomer:metaCustomer
          });
          changed=true;return;
        }
        if(idx<0)return;
        const o=orders[idx];
        if(metaCustomer)o.distributorCustomer={...(o.distributorCustomer||{}),...metaCustomer};
        o.deliveryStatus=r.delivery_status||o.deliveryStatus;
        o.deliveryEmail=r.delivery_email||o.deliveryEmail;
        o.deliveryPassword=r.delivery_password||o.deliveryPassword;
        o.deliveryProfile=r.delivery_profile||o.deliveryProfile;
        o.deliveryPin=r.delivery_pin||o.deliveryPin;
        o.deliveryPurchase=r.purchase_date||o.deliveryPurchase;
        o.deliveryExpire=r.expiry_date||o.deliveryExpire;
        o.deliveryAt=r.delivered_at||o.deliveryAt;
        o.updatedAt=r.updated_at||o.updatedAt;
        orders[idx]=o;changed=true;
      });
      if(changed)saveOrders(orders);
    }catch(_){ }
  }

  function ensureSaleDetailsModal(){
    let bg=$('nx7SaleDetailsBg');if(bg)return bg;
    bg=document.createElement('div');bg.id='nx7SaleDetailsBg';bg.className='nx7-overlay';
    bg.innerHTML='<div class="nx7-sale-modal"><div class="nx7-sale-head"><div><div class="nx7-kicker">DETALLE DE VENTA</div><h3 id="nx7SaleTitle">Cuenta</h3></div><button class="nx7-close" onclick="window.nx7CloseSaleDetails()">×</button></div><div id="nx7SaleBody"></div></div>';
    document.body.appendChild(bg);bg.addEventListener('click',e=>{if(e.target===bg)bg.classList.remove('open')});return bg;
  }
  function openSaleDetails(id){
    const s=currentBusinessOrders().find(x=>String(x.id)===String(id));if(!s)return;
    const bg=ensureSaleDetailsModal(),c=$('nx7SaleBody');
    const d=s.distributorCustomer||{},left=daysLeft(s.deliveryExpire),status=s.deliveryStatus==='delivered'?'Entregada':'Pendiente';
    const rem=left==null?'Pendiente':left<0?'Vencida':left===0?'Vence hoy':`${left} día${left===1?'':'s'}`;
    $('nx7SaleTitle').textContent=saleText(s);
    c.innerHTML=`<div class="nx7-sale-grid"><div class="nx7-sale-box"><span>Cliente</span><b>${esc(d.name||'—')}</b><small>WhatsApp: ${esc(d.phone||'—')}</small></div><div class="nx7-sale-box"><span>Monto vendido</span><b>S/ ${Number(d.saleAmount||s.total||0).toFixed(2)}</b><small>Compra NexoPlay: S/ ${Number(s.total||0).toFixed(2)}</small></div><div class="nx7-sale-box"><span>Estado</span><b>${status}</b><small>${esc(s.id||'—')}</small></div><div class="nx7-sale-box"><span>Tiempo restante</span><b>${esc(rem)}</b><small>Vence: ${esc(s.deliveryExpire||'Pendiente')}</small></div></div>${s.deliveryStatus==='delivered'?`<div class="nx7-account-box"><div class="nx7-kicker">DATOS DE LA CUENTA ENTREGADA</div><div class="nx7-account-row"><span>Correo</span><b>${esc(s.deliveryEmail||'—')}</b></div><div class="nx7-account-row"><span>Contraseña</span><b>${esc(s.deliveryPassword||'—')}</b></div><div class="nx7-account-row"><span>Perfil</span><b>${esc(s.deliveryProfile||'—')}</b></div><div class="nx7-account-row"><span>PIN</span><b>${esc(s.deliveryPin||'—')}</b></div></div>`:'<div class="nx7-pending">⏳ La cuenta todavía no ha sido entregada por administración.</div>'}`;
    bg.classList.add('open');
  }

  function saleCardHTML(s){
    const delivered=s.deliveryStatus==='delivered',d=s.distributorCustomer||{},left=daysLeft(s.deliveryExpire),rem=left==null?'Pendiente':left<0?'Vencida':left===0?'Vence hoy':`${left} día${left===1?'':'s'}`;
    const itemName=saleText(s),sold=Number(d.saleAmount||s.total||0);
    const details=`<button class="nx7-sale-btn" onclick="window.nx7ViewSale('${esc(s.id)}')">🔎 Ver datos</button>`;
    const wa=delivered?`<button class="nx7-sale-btn primary" onclick="window.nx7SendDelivery('${esc(s.id)}')">📤 Entregar datos</button><button class="nx7-sale-btn" onclick="window.nx7SendExpiry('${esc(s.id)}')">⏰ Reportar vencimiento</button>`:'';
    return `<article class="nx7-sale"><div class="nx7-sale-top"><div><strong>${esc(itemName)}</strong><span>${esc(d.name||'Cliente')} · ${esc(d.phone||'—')}</span></div><b class="nx7-sale-status ${delivered?'ok':''}">${delivered?'✓ Entregada':'⏳ Pendiente'}</b></div><div class="nx7-sale-metrics"><div><span>Monto vendido</span><b>S/ ${sold.toFixed(2)}</b></div><div><span>Días restantes</span><b>${esc(rem)}</b></div><div><span>Vencimiento</span><b>${esc(s.deliveryExpire||'Pendiente')}</b></div></div><div class="nx7-sale-actions">${details}${wa}</div></article>`;
  }

  function ensureCommunityButton(){
    const root=$('distributorPanelContent');if(!root||$('nx8CommunityBtn'))return;
    const host=root.querySelector('.distributor-hero-card')||root.querySelector('.distributor-hero');if(!host)return;
    const b=document.createElement('button');b.id='nx8CommunityBtn';b.className='nx7-sale-btn primary';b.style.marginTop='10px';b.textContent=rankId()==='vip'?'🌐 Unirme a la comunidad VIP':'🌐 Unirme a la comunidad de Distribuidores';b.onclick=openCommunity;host.appendChild(b);
  }

  function refreshSalesPanel(){
    if(!isBiz())return;
    syncBusinessOrders().finally(()=>{
      const root=$('distributorPanelContent');if(!root)return;
      const orders=currentBusinessOrders();
      const list=orders.slice().reverse().map(saleCardHTML).join('');
      const host=root.querySelector('#distributorSalesList');
      if(host)host.innerHTML=list||'<div class="distributor-empty">📦 Todavía no tienes ventas registradas.</div>';ensureCommunityButton();
      const total=orders.reduce((n,o)=>n+Number(o.distributorCustomer?.saleAmount||o.total||0),0);
      root.querySelectorAll('.distributor-kpi').forEach((el,i)=>{const b=el.querySelector('b');if(!b)return;if(i===0)b.textContent=orders.length;if(i===1)b.textContent=orders.filter(x=>x.deliveryStatus==='delivered').length;if(i===2)b.textContent=orders.filter(x=>x.deliveryStatus!=='delivered').length;if(i===3)b.textContent='S/ '+total.toFixed(2)});
    });
  }

  function patchSalesPanel(){
    const original=window.renderDistributorPanel;
    if(typeof original==='function'&&!original.__nx7){
      const f=function(){const out=original.apply(this,arguments);setTimeout(refreshSalesPanel,30);return out};f.__nx7=true;window.renderDistributorPanel=f;
    }
    const originalOpen=window.openDistributorPanel;
    if(typeof originalOpen==='function'&&!originalOpen.__nx7){
      const f=function(){const out=originalOpen.apply(this,arguments);setTimeout(refreshSalesPanel,80);return out};f.__nx7=true;window.openDistributorPanel=f;
    }
  }

  function sendDelivery(id){const s=currentBusinessOrders().find(x=>String(x.id)===String(id));if(!s||s.deliveryStatus!=='delivered'){window.showToast?.('La cuenta todavía no está entregada.');return}const d=s.distributorCustomer||{};const e={wave:'\uD83D\uDC4B',spark:'\uD83D\uDE0A',package:'\uD83D\uDCE6',clapper:'\uD83C\uDFAC',mail:'\uD83D\uDCEC',key:'\uD83D\uDD11',user:'\uD83D\uDC64',pin:'\uD83D\uDD22',date:'\uD83D\uDCC5',lock:'\uD83D\uDD12',heart:'\u2764\uFE0F'};const msg=`Hola ${d.name||e.wave} ${e.spark}\n\n${e.package} *Tu acceso a tu cuenta*\n\n${e.clapper} *Producto:* ${saleText(s)}\n${e.mail} *Correo:* ${s.deliveryEmail||'Pendiente'}\n${e.key} *Contraseña:* ${s.deliveryPassword||'Pendiente'}\n${e.user} *Perfil:* ${s.deliveryProfile||'—'}\n${e.pin} *PIN:* ${s.deliveryPin||'—'}\n${e.date} *Vencimiento:* ${s.deliveryExpire||'—'}\n\n${e.lock} *Importante:* utiliza únicamente el perfil asignado y no modifiques el nombre del perfil ni el PIN sin autorización. Cuando corresponda, utiliza este perfil en un solo dispositivo.\n\n¡Gracias por tu compra! ${e.heart}`;openCustomerWhatsApp(d.phone,msg)}
  function sendExpiry(id){const s=currentBusinessOrders().find(x=>String(x.id)===String(id));if(!s||s.deliveryStatus!=='delivered'){window.showToast?.('Primero debe estar entregada la cuenta.');return}const d=s.distributorCustomer||{},left=daysLeft(s.deliveryExpire),txt=left==null?'próximamente':left<0?'ya venció':left===0?'vence hoy':`faltan ${left} día${left===1?'':'s'}`;const e={wave:'\uD83D\uDC4B',spark:'\uD83D\uDE0A',clock:'\u23F0',date:'\uD83D\uDCC5',renew:'\uD83D\uDD04',heart:'\u2764\uFE0F'};const msg=`Hola ${d.name||e.wave} ${e.spark}\n\n${e.clock} *Recordatorio importante*\n\nTu cuenta de *${saleText(s)}* ${txt}.\n${e.date} *Fecha de vencimiento:* ${s.deliveryExpire||'—'}\n${e.renew} *Tiempo restante:* ${left==null?'Por confirmar':left<0?'Vencida':left===0?'Vence hoy':left+' días'}\n\nTe recomendamos renovar con anticipación para evitar interrupciones. Si deseas renovarla, comunícate con nosotros. ${e.heart}`;openCustomerWhatsApp(d.phone,msg)}
  function openCustomerWhatsApp(phone,msg){const n=String(phone||'').replace(/\D/g,'');if(n.length<9){window.showToast?.('El WhatsApp del cliente no es válido.');return}const wa=n.startsWith('9')&&n.length===9?'51'+n:n;window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(msg),'_blank','noopener')}

  // -------------------- Admin: datos extra visibles --------------------
  function patchAdminSalesRenderer(){
    const original=window.renderAdminSale;
    if(typeof original!=='function'||original.__nx7)return;
    // La función original ya existe en el scope global; sustituimos solamente el HTML de la tarjeta.
    window.renderAdminSale=function(s){
      const base=original.apply(this,arguments);
      return base.replace('</div></div>`','</div></div>`');
    };
    window.renderAdminSale.__nx7=true;
  }

  // -------------------- Inventory/catalog fallback de logos --------------------
  function addLogoFallbacks(){
    const map={p1:'N',p2:'D+',p3:'M',p4:'P+',p5:'P',p6:'YT',p7:'C',p8:'C',p9:'V',p10:'S',p11:'FF',p12:'R',p13:'S',p14:'PS',p15:'X',p16:'GPT',p17:'C',p18:'G',p19:'YT',p20:'AM',p21:'G1',p22:'CC',p23:'A',p24:'CR',p25:'M365',p26:'VPN',p27:'C'};
    document.querySelectorAll('.inventory-thumb').forEach(el=>{if(el.querySelector('.nx7-logo-fallback'))return;const cls=[...el.classList].find(c=>map[c]);if(!cls)return;const s=document.createElement('span');s.className='nx7-logo-fallback';s.textContent=map[cls];el.appendChild(s)});
  }

  // -------------------- Wallet light polish --------------------
  function polishWallet(){
    const bg=$('walletModalBg');if(bg)bg.classList.add('nx7-light-wallet');
  }

  function patchProfile(){
    const mark=()=>{setTimeout(tuneProfileLayout,0);setTimeout(()=>window.nx5RefreshProfile?.(),10)};
    const original=window.showProfileView;
    if(typeof original==='function'&&!original.__nx8){const f=async function(){const out=await original.apply(this,arguments);mark();return out};f.__nx8=true;window.showProfileView=f}
    const open=window.openProfile;
    if(typeof open==='function'&&!open.__nx8){const f=function(){const out=open.apply(this,arguments);mark();return out};f.__nx8=true;window.openProfile=f}
  }

  
  function hardenUi(){
    const cssId='nx9-hotfix-style';
    if(document.getElementById(cssId))return;
    const s=document.createElement('style');s.id=cssId;s.textContent=`
      #purchasesModalBg .purchase-card .pc-actions button,
      #purchasesModalBg .purchase-card .order-view-btn,
      #purchasesModalBg .purchase-card .purchase-help{
        background:linear-gradient(135deg,#5d55f5,#27b8e7)!important;
        color:#fff!important;border:1px solid rgba(93,85,245,.28)!important;
        box-shadow:0 8px 18px rgba(57,77,160,.16)!important;
      }
      #purchasesModalBg .purchase-card .pc-actions button:hover,
      #purchasesModalBg .purchase-card .order-view-btn:hover{
        filter:brightness(1.05);transform:translateY(-1px);
      }
      .nx7-overlay{z-index:10050!important}
      #nx7SaleDetailsBg{z-index:10060!important}
      .nx5-legacy-bridge{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important}
      .nx7-sale-modal{position:relative;z-index:10061!important}
    `;
    document.head.appendChild(s);
  }

  function install(){
    window.nx7OpenCommunity=openCommunity;window.nx7ViewSale=openSaleDetails;window.nx7CloseSaleDetails=()=>document.getElementById('nx7SaleDetailsBg')?.classList.remove('open');window.nx7SendDelivery=sendDelivery;window.nx7SendExpiry=sendExpiry;
    patchCheckout();patchSalesPanel();patchProfile();patchVipEntrypoints();polishWallet();
    addLogoFallbacks();hardenUi();
    const mo=new MutationObserver(()=>{tuneProfileLayout();addLogoFallbacks();polishWallet();patchVipEntrypoints();ensureCommunityButton();});
    mo.observe(document.body,{subtree:true,childList:true});
    setTimeout(()=>{patchCheckout();patchSalesPanel();patchProfile();patchVipEntrypoints();refreshSalesPanel();ensureCommunityButton()},350);
  }
  if(document.readyState==='loading')window.addEventListener('load',install,{once:true});else setTimeout(install,40);
})();
