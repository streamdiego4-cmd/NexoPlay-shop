(function(){
'use strict';
const CART_KEY='nexoplay_cart_extra_v4';
const AI_ENDPOINT=(window.NEXO_AI_ENDPOINT||'').trim();
const $=id=>document.getElementById(id);
const esc=s=>typeof escapeHTML==='function'?escapeHTML(String(s??'')):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

function readData(){try{return JSON.parse(localStorage.getItem(CART_KEY)||'{}')}catch(_){return {}}}
function clean(v){return v==null||String(v).toLowerCase()==='undefined'||String(v).toLowerCase()==='null'?'':String(v)}
function saveData(){const d={profileName:clean($( 'cartProfileName')?.value).trim(),profileId:clean($('cartProfileId')?.value).trim(),extraData:clean($('cartExtraData')?.value).trim()};try{localStorage.setItem(CART_KEY,JSON.stringify(d))}catch(_){}return d}
function initData(){const d=readData();[['cartProfileName',clean(d.profileName)],['cartProfileId',clean(d.profileId)],['cartExtraData',clean(d.extraData)]].forEach(([id,v])=>{const e=$(id);if(e){e.value=v;e.addEventListener('input',saveData)}})}

window.getDiscount=()=>0;
window.applyCoupon=()=>{try{localStorage.removeItem('nexoplay_discount');localStorage.removeItem('nexoplay_coupon')}catch(_){};window.showToast?.('Los cupones de prueba están desactivados.');renderCart()};
function cartArr(){return Array.isArray(window.cart)?window.cart:[]}
window.cartSubtotal=()=>cartArr().reduce((a,x)=>a+Number(x?.price||0),0);
window.cartTotal=()=>Math.max(0,Number(window.cartSubtotal?.()||0));

function renderCart(){const cart=cartArr();const items=$('cartItems');if(items){items.innerHTML=cart.length?cart.map((x,i)=>`<article class="cart-item cart-item-v4"><div class="cart-item-top"><div><strong>${esc(x?.name||'Producto')}</strong><div class="cart-plan-name">${esc(x?.plan||'')}</div></div><button class="remove" onclick="removeItem(${i})" aria-label="Eliminar ${esc(x?.name||'producto')}">Eliminar</button></div><div class="cart-line-price">S/ ${Number(x?.price||0).toFixed(2)}</div></article>`).join(''):`<div class="cart-empty-v3"><div class="cart-empty-icon">🛒</div><strong>Tu carrito está vacío</strong><span>Añade un producto para comenzar.</span></div>`}
const total=window.cartTotal();const totalEl=$('cartTotal');if(totalEl)totalEl.innerHTML=`<span>S/</span> ${total.toFixed(2)}`;const count=$('cartCount'),mobile=$('mobileCartCount');if(count)count.textContent=String(cart.length);if(mobile)mobile.textContent=String(cart.length);window.updateCheckoutWalletBalance?.();const btn=$('checkoutBtn');if(btn){btn.disabled=!cart.length;btn.style.opacity=cart.length?'1':'.55';}}
window.nxRenderCart=renderCart;window.updateCart=renderCart;

window.nxCartAddedFeedback=function(name,plan){const box=$('cartFeedback');if(box){box.innerHTML=`<span class="feedback-check">✓</span><div><strong>Agregado al carrito</strong><small>${esc(name)} · ${esc(plan)}</small></div>`;box.classList.add('show');clearTimeout(window.__nxFeedback);window.__nxFeedback=setTimeout(()=>box.classList.remove('show'),3000)}window.showToast?.('✅ Producto agregado al carrito');const panel=$('cartPanel');if(panel){panel.classList.add('cart-pulse');setTimeout(()=>panel.classList.remove('cart-pulse'),500)}};

/* Robust wrapper around the existing stock-aware add flow. */
const originalAdd=window.addSelectedToCart;
if(typeof originalAdd==='function'&&!originalAdd.__nxV4){
  const wrappedAdd=async function(){
    const pi=Number.isInteger(products?.indexOf(window.currentProduct))?products.indexOf(window.currentProduct):-1;
    const plan=window.currentProduct?.plans?.[window.selectedPlan];
    if(pi<0||!plan){window.showToast?.('Selecciona un plan antes de agregarlo.');return}
    const btn=$('addBtn');if(btn){btn.disabled=true;btn.dataset.originalText=btn.textContent;btn.textContent='Agregando…'}
    const before=cartArr().length;
    try{
      const result=await originalAdd.apply(this,arguments);
      const after=cartArr().length;
      if(after>before){const last=cartArr()[after-1];window.nxCartAddedFeedback(last?.name||window.currentProduct.name,last?.plan||plan.name);if(btn){btn.textContent='✓ Agregado';setTimeout(()=>{btn.textContent=btn.dataset.originalText||'Agregar al carrito';window.updatePlanInfo?.();},1200)}}
      return result;
    }finally{if(btn&&btn.textContent==='Agregando…')btn.textContent=btn.dataset.originalText||'Agregar al carrito';}
  };
  wrappedAdd.__nxV4=true;window.addSelectedToCart=wrappedAdd;
}

/* Reliable checkout: uses the live window cart and validates Yape/Plin receipt before launch. */
window.checkout=async function(){
  const cart=cartArr();
  if(!cart.length){window.showToast?.('🛒 Tu carrito está vacío. Añade un producto antes de continuar.');window.toggleCart?.(true);renderCart();return}
  const method=typeof getCheckoutMethod==='function'?getCheckoutMethod():'yape';
  const customerData=saveData();
  if((method==='yape'||method==='plin')&&!$('receiptInput')?.files?.[0]){
    window.showToast?.('📎 Antes de continuar, adjunta tu comprobante de pago.');
    $('receiptInput')?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>$('receiptInput')?.focus(),250);return;
  }
  if(method==='wallet'&&!window.currentUser){window.showToast?.('Inicia sesión para pagar con Wallet.');window.openProfile?.();return}
  const subtotal=window.cartSubtotal();const total=window.cartTotal();
  if(!Number.isFinite(total)||total<=0){window.showToast?.('No se pudo calcular el total del carrito. Vuelve a seleccionar el plan.');return}
  const orderId='NP-'+Date.now().toString().slice(-6);
  const items=cart.map(x=>({name:x.name,plan:x.plan,price:Number(x.price||0),profile_name:customerData.profileName,profile_id:customerData.profileId,extra_data:customerData.extraData}));
  const btn=$('checkoutBtn');if(btn){btn.disabled=true;btn.textContent=method==='wallet'?'Procesando Wallet…':'Preparando pedido…'}
  try{
    if(method==='wallet'){
      if(!window.currentUser?.user_metadata?.purchase_pin_hash){window.showToast?.('Tu cuenta todavía no tiene un PIN de compra configurado.');window.openProfile?.();return}
      if(!window.walletCache&&typeof loadWalletData==='function')await loadWalletData();
      const bal=Number(window.walletCache?.balance||0);if(bal<total){window.showToast?.(`Saldo insuficiente. Tienes S/ ${bal.toFixed(2)} y necesitas S/ ${total.toFixed(2)}.`);return}
      const pin=await window.requestPurchasePin?.();if(!pin)return;
      await window.walletPurchase(total,`Compra ${orderId} — ${cart.map(x=>x.name).join(', ')}`);
      let orders=[];try{orders=JSON.parse(localStorage.getItem('nexoplay_orders')||'[]')}catch(_){}
      const paid={id:orderId,ownerUserId:window.currentUser.id,date:new Date().toLocaleString('es-PE'),items,subtotal,discount:0,total,status:'Pagado con Wallet',paymentMethod:'Wallet',customerData};orders.push(paid);localStorage.setItem('nexoplay_orders',JSON.stringify(orders));
      const sync=typeof createRemoteSale==='function'?await createRemoteSale(paid):{ok:false};window.cart=[];renderCart();window.renderOrders?.();window.renderOrdersModal?.();window.renderProducts?.();window.renderCombos?.();await window.loadWalletData?.();
      window.showToast?.(sync.ok?`✅ Pedido ${orderId} pagado y enviado a Ventas pendientes`:`✅ Pedido ${orderId} pagado. Se reintentará la sincronización.`);return;
    }
    const wa=String(window.WHATSAPP_NUMBER||'').trim();if(!wa||wa==='TU_NUMERO_WHATSAPP'){window.showToast?.('Configura tu número de WhatsApp en el código.');return}
    const receipt=$('receiptInput')?.files?.[0];
    const lines=cart.map(x=>`• ${x.name} — ${x.plan} — S/ ${Number(x.price||0).toFixed(2)}`).join('%0A');
    let msg=`*¡Hola! 👋 Quiero realizar un pedido en NexoPlay* ✨%0A%0A🧾 *Pedido:* ${orderId}%0A%0A📦 *Productos:*%0A${lines}%0A%0A💰 *Subtotal:* S/ ${subtotal.toFixed(2)}%0A💵 *Total:* S/ ${total.toFixed(2)}%0A💳 *Método:* ${method==='plin'?'Plin':'Yape'}`;
    if(customerData.profileName)msg+=`%0A👤 *Nombre de perfil:* ${encodeURIComponent(customerData.profileName)}`;
    if(customerData.profileId)msg+=`%0A🆔 *ID / USUARIO:* ${encodeURIComponent(customerData.profileId)}`;
    if(customerData.extraData)msg+=`%0A📝 *Datos extra:* ${encodeURIComponent(customerData.extraData)}`;
    msg+=`%0A%0A📎 *Comprobante:* ${encodeURIComponent(receipt.name)}`;
    window.open(`https://wa.me/${wa}?text=${msg}`,'_blank','noopener');window.showToast?.(`✅ Solicitud ${orderId} preparada. Envía el comprobante en el chat de WhatsApp.`);
  }catch(e){console.error('NexoPlay checkout V4:',e);window.showToast?.(e?.message||'No se pudo completar el pedido.')}finally{if(btn){btn.disabled=cartArr().length===0;btn.textContent='Continuar con mi pedido'}}
};

/* Nexo catalog intelligence */
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function catalog(){return Array.isArray(window.products)?window.products:[]}
function findMentioned(q){const nq=norm(q);return catalog().filter(p=>{const n=norm(p.name);return n.length>2&&nq.includes(n)})}
function planScore(p,q){const nq=norm(q),name=norm(p.name);let score=0;if(nq.includes(name))score+=10;if(/basico|basic|inicio|estandar|standard/.test(nq)&&/basico|basic|inicio|estandar|standard/.test(name))score+=8;if(/premium|premiun|pro/.test(nq)&&/premium|premiun|pro/.test(name))score+=8;if(/1 perfil|un perfil/.test(nq)&&/1 perfil|un perfil/.test(name))score+=7;if(/2 perfiles|dos perfiles/.test(nq)&&/2 perfiles|dos perfiles/.test(name))score+=7;if(/3 perfiles|tres perfiles/.test(nq)&&/3 perfiles|tres perfiles/.test(name))score+=7;return score}
function choosePlan(p,q,offset=0){const arr=(p?.plans||[]).filter(x=>x&&x.active!==false);if(!arr.length)return null;return [...arr].sort((a,b)=>planScore(b,q)-planScore(a,q)||Number(a.price||0)-Number(b.price||0))[offset]||arr[0]}
function catalogAnswer(q){const nq=norm(q);if(!/diferencia|compar|mejor|conviene|entre.*plan|plan.*entre/.test(nq))return null;const ps=findMentioned(q);if(!ps.length)return null;
  if(ps.length===1){const p=ps[0],plans=(p.plans||[]).filter(x=>x.active!==false).sort((a,b)=>planScore(b,q)-planScore(a,q));if(plans.length<2)return `En ${p.name} solo tengo ${plans.length} modalidad(es) activa(s) visibles. Puedo compararlas cuando existan al menos dos.`;return `📊 ${p.name}\n\n${plans.slice(0,3).map(x=>`• ${x.name} — S/ ${Number(x.price||0).toFixed(2)}\n  ${x.desc||'Sin descripción disponible.'}${Array.isArray(x.benefits)&&x.benefits.length?'\n  Beneficios: '+x.benefits.join(', '):''}`).join('\n\n')}`}
  const rows=ps.slice(0,4).map(p=>{const plan=choosePlan(p,q);return `${p.name}\n• ${plan?.name||'Modalidad activa'} — S/ ${Number(plan?.price||0).toFixed(2)}\n  ${plan?.desc||'Sin descripción disponible.'}${Array.isArray(plan?.benefits)&&plan.benefits.length?'\n  Beneficios: '+plan.benefits.join(', '):''}`});return `📊 Comparación rápida\n\n${rows.join('\n\n')}`;
}

function nexoModal(){let bg=$('nexoAiModal');if(bg)return bg;bg=document.createElement('div');bg.id='nexoAiModal';bg.className='nexo-modal-shell';bg.innerHTML=`<div class="nexo-modal" role="dialog" aria-modal="true" aria-label="Nexo Inteligente"><div class="nexo-modal-head"><div class="nexo-head-brand"><div class="nexo-mini-face">• •<br/>◡</div><div><strong>Nexo Inteligente</strong><small>Asistente de entretenimiento</small></div></div><button class="close" id="nexoClose" aria-label="Cerrar">×</button></div><div class="nexo-chat" id="nexoChat"><div class="nexo-msg assistant">Hola 👋 Soy Nexo. Puedo comparar planes de tu catálogo y, cuando conectes el endpoint, consultar estrenos, plataformas y eventos actuales.</div></div><div class="nexo-note">Solo respondo sobre entretenimiento, catálogo, estrenos y transmisiones. No modifico cuentas, Wallet, pedidos ni administración.</div><form class="nexo-form" id="nexoForm"><input id="nexoQuestion" maxlength="400" autocomplete="off" placeholder="Ej. ¿Qué diferencia hay entre Netflix básico y Disney premium?"><button type="submit">Enviar</button></form></div>`;document.body.appendChild(bg);bg.onclick=e=>{if(e.target===bg)bg.classList.remove('open')};$('nexoClose').onclick=()=>bg.classList.remove('open');$('nexoForm').onsubmit=e=>{e.preventDefault();nexoAsk($('nexoQuestion').value)};return bg}
function addNexo(kind,t){const c=$('nexoChat');if(!c)return;const d=document.createElement('div');d.className=`nexo-msg ${kind}`;d.textContent=t;c.appendChild(d);c.scrollTop=c.scrollHeight}
async function nexoAsk(q){q=String(q||'').trim();if(!q)return;addNexo('user',q);$('nexoQuestion').value='';const local=catalogAnswer(q);if(local){addNexo('assistant',local);return}if(!AI_ENDPOINT){addNexo('assistant','Puedo responder comparaciones basadas en el catálogo. Para estrenos, disponibilidad de películas y horarios de partidos actuales, todavía falta conectar Nexo con su fuente de información actualizada.');return}addNexo('assistant','Buscando información actualizada…');try{const r=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,catalog:catalog().map(p=>({name:p.name,description:p.desc,plans:(p.plans||[]).filter(x=>x.active!==false).map(x=>({name:x.name,price:x.price,description:x.desc,benefits:x.benefits||[]}))}))})});const data=await r.json().catch(()=>({}));document.querySelector('#nexoChat .assistant:last-child')?.remove();if(!r.ok)throw new Error(data.error||'No se pudo consultar Nexo.');addNexo('assistant',data.answer||'No pude confirmar esa información.')}catch(e){document.querySelector('#nexoChat .assistant:last-child')?.remove();addNexo('assistant','No pude verificar la información ahora. Revisa la configuración del endpoint de Nexo.')}}
window.openNexoAI=function(initial){const bg=nexoModal();bg.classList.add('open');setTimeout(()=>{const q=$('nexoQuestion');if(q){q.value=initial||'';q.focus()}if(initial)nexoAsk(initial)},60)};

/* Expressive mascot */
function animateMascot(){const m=$('nexoMascot');if(!m)return;let i=0;const states=['','blink','happy','think','blink'];const tick=()=>{m.classList.remove('blink','happy','think');const state=states[i++%states.length];if(state)m.classList.add(state);setTimeout(tick,state==='blink'?220:state==='happy'?900:state==='think'?1100:2400)};tick();}
function lazyPosters(){const map={p1:'images/netflix.jpg',p2:'images/disney.jpg',p3:'images/hbomax.jpg',p4:'images/paramount.jpg',p5:'images/primevideo.jpg',p6:'images/youtubepremium.jpg',p7:'images/crunchyroll.jpg',p8:'images/canva.jpg',p9:'images/vix.jpg',p10:'images/spotify.jpg',p11:'images/freefire.jpg',p12:'images/roblox.jpg',p13:'images/steam.jpg',p14:'images/playstation.jpg',p15:'images/xbox.jpg',p16:'images/chatgpt.jpg',p17:'images/claude.jpg',p18:'images/gemini.jpg',p19:'images/youtubemusic.jpg',p20:'images/applemusic.jpg',p21:'images/googleone.jpg',p22:'images/capcut.jpg',p23:'images/adobe.jpg',p24:'images/coursera.jpg',p25:'images/microsoft365.jpg',p26:'images/vpn.jpg',p27:'images/cloud.jpg'};document.querySelectorAll('.poster,.mini-poster').forEach(el=>{if(el.dataset.nxLazy)return;const k=[...el.classList].find(c=>map[c]);if(!k)return;el.dataset.nxLazy='1';el.style.backgroundImage='none';const load=()=>{el.style.backgroundImage=`url("${map[k]}")`};if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){load();io.unobserve(e.target)}}),{rootMargin:'240px'});io.observe(el)}else load()})}

window.addEventListener('load',()=>{initData();try{localStorage.removeItem('nexoplay_discount');localStorage.removeItem('nexoplay_coupon')}catch(_){}renderCart();lazyPosters();animateMascot();new MutationObserver(lazyPosters).observe(document.body,{subtree:true,childList:true})},{once:true});
})();
