
/* ===== CONFIGURACIÓN RÁPIDA =====
   1) Pon tus imágenes en /images/ con estos nombres.
   2) Cambia YAPE_NUMBER por tu número real.
   3) Cambia PLIN_NUMBER y coloca tu QR en images/plin.jpg.
   4) Cambia WHATSAPP_NUMBER por tu WhatsApp en formato internacional, sin + ni espacios.
   5) Pega aquí la URL y la PUBLISHABLE/ANON KEY de tu proyecto Supabase.
      Nunca pongas aquí una service_role/secret key.
   6) Confirm email de Supabase debe permanecer desactivado. La verificación la controla NexoPlay mediante un código enviado por Resend.
*/
const YAPE_NUMBER=(document.getElementById("yapeNumber")?.textContent||"985 566 081").trim();
// ===== CONFIGURACIÓN PLIN =====
// Cambia estos valores directamente en index.html.
const PLIN_NUMBER=(document.getElementById("plinNumber")?.textContent||"000 000 000").trim();
const PLIN_IMAGE="images/plin.jpg";
const WHATSAPP_NUMBER="906062102";
try{window.WHATSAPP_NUMBER=WHATSAPP_NUMBER;window.YAPE_NUMBER=YAPE_NUMBER;window.PLIN_NUMBER=PLIN_NUMBER}catch(_){}
const SUPABASE_URL="https://xwyjmgbiipgifnrdebsu.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_H6F_dunp2jvpu6B4zSDhEw_XV2QZjUG";
const SUPABASE_READY=SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("PEGA_AQUI") && !SUPABASE_ANON_KEY.includes("PEGA_AQUI");
const supabaseClient=SUPABASE_READY && window.supabase ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;

const products=[
{name:"Netflix",cls:"p1",desc:"Elige la modalidad que mejor se adapte a tu forma de disfrutar entretenimiento digital.",plans:[
{name:"1 PERFIL-- Básico",price:8,stock:7,desc:"Acceso para 1 perfil. Ideal para uso personal y para quienes buscan una alternativa económica. Una opción práctica para comenzar.",benefits:["Acceso individual","Alternativa económica","Ideal para uso personal"]},
{name:"1 PERFIL-- Premium",price:10,stock:5,desc:"Acceso para 1 perfil en modalidad Premium. Recomendado para quienes buscan una experiencia más completa y cómoda.",benefits:["1 perfil","Modalidad Premium","Buena relación precio-experiencia"]},
{name:"CUENTA 1Mes",price:25,stock:3,desc:"Cuenta Premium por 1 mes. Pensada para quienes prefieren contratar durante un periodo mensual y mantener una experiencia continua.",benefits:["Modalidad Premium","Duración de 1 mes","Ideal para uso mensual"]},
{name:"CUENTA 3Mes",price:45,stock:4,desc:"Cuenta Premium por 3 meses. Mayor duración y comodidad para quienes prefieren evitar renovaciones frecuentes.",benefits:["Modalidad Premium","Duración de 3 meses","Mayor comodidad"]}]},
{name:"Disney+",cls:"p2",desc:"Una alternativa de entretenimiento para disfrutar contenido familiar, aventuras, películas y series.",plans:[
{name:"1 PERFIL-- Básico",price:7,stock:5,desc:"Acceso para 1 perfil. Una opción económica para disfrutar del servicio de manera individual y práctica.",benefits:["1 perfil","Opción económica","Uso individual"]},
{name:"1 PERFIL-- Premium",price:8,stock:4,desc:"Acceso para 1 perfil en modalidad Premium. Una alternativa para quienes buscan una experiencia más completa.",benefits:["1 perfil","Modalidad Premium","Uso personal"]},
{name:"CUENTA 1Mes",price:18,stock:3,desc:"Cuenta Premium por 1 mes. Ideal para quienes desean contratar por un periodo mensual y mantener acceso durante el periodo contratado.",benefits:["Modalidad Premium","Duración de 1 mes","Opción flexible"]},
{name:"CUENTA 3Mes",price:30,stock:7,desc:"Cuenta Premium por 3 meses. Pensada para quienes buscan mayor duración y comodidad sin renovar cada mes.",benefits:["Modalidad Premium","Duración de 3 meses","Mayor comodidad"]}]},
{name:"HBO Max",cls:"p3",desc:"Una alternativa de entretenimiento digital con diferentes modalidades de acceso y duración.",plans:[
{name:"1 PERFIL-- Estándar",price:5,stock:11,desc:"Acceso para 1 perfil. La alternativa más económica del catálogo para uso personal.",benefits:["1 perfil","Precio accesible","Uso individual"]},
{name:"1 PERFIL-- Premium",price:6,stock:8,desc:"Acceso para 1 perfil en modalidad Premium. Una alternativa superior para quienes buscan una experiencia más completa.",benefits:["1 perfil","Modalidad Premium","Alternativa económica"]},
{name:"CUENTA 1Mes",price:15,stock:15,desc:"Cuenta Premium por 1 mes. Una opción completa para quienes desean contratar durante un periodo mensual.",benefits:["Modalidad Premium","Duración de 1 mes","Compra flexible"]},
{name:"CUENTA 2Mes",price:25,stock:4,desc:"Cuenta Premium por 2 meses. Mayor duración a un precio conveniente para quienes buscan uso continuo.",benefits:["Modalidad Premium","Duración de 2 meses","Menos renovaciones"]}]},
{name:"Paramount+",cls:"p4",desc:"Una alternativa de entretenimiento digital con diferentes modalidades para elegir según tus necesidades.",plans:[
{name:"1 PERFIL-- Estándar",price:6,stock:5,desc:"Plan Básico pensado para quienes buscan una opción económica y sencilla.",benefits:["Opción accesible","Uso personal","Modalidad básica"]},
{name:"1 PERFIL-- Premium",price:7,stock:4,desc:"Plan Estándar con un equilibrio entre precio y experiencia. Una opción intermedia para uso habitual.",benefits:["Modalidad estándar","Equilibrio precio-experiencia","Uso habitual"]},
{name:"CUENTA 1Mes",price:15,stock:3,desc:"Plan Premium pensado para quienes prefieren una modalidad superior y una experiencia más completa.",benefits:["Modalidad Premium","Opción superior","Mayor comodidad"]},
{name:"CUENTA 3Mes",price:25,stock:2,desc:"Plan Pro, la alternativa de mayor nivel disponible en este catálogo.",benefits:["Modalidad Pro","Nivel superior","Opción más completa"]}]},
{name:"Prime Video",cls:"p5",desc:"Una alternativa de entretenimiento digital para disfrutar películas, series y contenido disponible en la plataforma.",plans:[
{name:"1 PERFIL-- Stándar",price:7,stock:5,desc:"Plan Básico económico y práctico para quienes buscan una alternativa sencilla.",benefits:["Opción accesible","Uso personal","Modalidad básica"]},
{name:"1 PERFIL-- PREMIUM",price:8,stock:4,desc:"Plan Estándar con un equilibrio entre precio y prestaciones. Recomendado para uso habitual.",benefits:["Modalidad estándar","Equilibrio de precio","Uso frecuente"]},
{name:"CUENTA 1Mes Stan",price:20,stock:3,desc:"Plan Premium para quienes buscan una modalidad superior dentro del catálogo.",benefits:["Modalidad Premium","Opción superior","Experiencia más completa"]},
{name:"CUENTA 1Mes Prem",price:25,stock:2,desc:"Plan Pro, nuestra modalidad de mayor nivel y la alternativa más completa del catálogo.",benefits:["Modalidad Pro","Nivel superior","Opción más completa"]}]},
{name:"YouTube Premium",cls:"p6",desc:"Una alternativa para disfrutar contenido digital de YouTube mediante diferentes modalidades de acceso.",plans:[
{name:"1Mes-- INVITACIÓN",price:4.50,stock:5,desc:"Plan Básico y económico para quienes buscan una alternativa sencilla.",benefits:["Opción accesible","Uso personal","Modalidad básica"]},
{name:"3Mes-- INVITACIÓN",price:15,stock:4,desc:"Plan Estándar con una experiencia equilibrada para quienes buscan una opción intermedia.",benefits:["Modalidad estándar","Equilibrio precio-experiencia","Uso habitual"]},
{name:"1Mes-- A CORREO",price:6,stock:3,desc:"Plan Premium pensado para quienes buscan una experiencia superior y una alternativa más completa.",benefits:["Modalidad Premium","Opción superior","Mayor comodidad"]},
{name:"1Mes-- FAMILIAR",price:15,stock:2,desc:"Plan Pro, la alternativa de mayor nivel disponible en nuestra oferta.",benefits:["Modalidad Pro","Nivel superior","Opción más completa"]}]},
{name:"Crunchyroll",cls:"p7",desc:"Una alternativa de entretenimiento digital enfocada especialmente en contenido de anime y entretenimiento.",plans:[
{name:"1 PERFIL",price:5,stock:5,desc:"Plan Básico para quienes quieren comenzar con una alternativa económica y sencilla.",benefits:["Opción accesible","Uso personal","Modalidad básica"]},
{name:"CUENTA 1Mes",price:14,stock:4,desc:"Plan Estándar con una alternativa equilibrada para usuarios habituales.",benefits:["Modalidad estándar","Uso habitual","Equilibrio de precio"]},
{name:"CUENTA 3Mes",price:28,stock:3,desc:"Plan Premium pensado para usuarios que buscan una modalidad superior dentro del catálogo.",benefits:["Modalidad Premium","Opción superior","Mayor comodidad"]},
{name:"CUENTA 1año",price:45,stock:2,desc:"Plan Pro, la opción de mayor nivel de nuestro catálogo.",benefits:["Modalidad Pro","Nivel superior","Opción más completa"]}]},
{name:"Canva",cls:"p8",desc:"Una alternativa digital para creación de diseños, contenido visual y proyectos creativos.",plans:[
{name:"1Mes-- EDU",price:5,stock:5,desc:"Plan Básico para proyectos sencillos y necesidades de diseño habituales.",benefits:["Opción accesible","Proyectos sencillos","Uso personal"]},
{name:"3Mes-- EDU",price:15,stock:4,desc:"Plan Estándar para usuarios que realizan proyectos con mayor frecuencia y necesitan una opción equilibrada.",benefits:["Modalidad estándar","Proyectos frecuentes","Experiencia equilibrada"]},
{name:"6Mes-- EDU",price:25,stock:3,desc:"Plan Premium para quienes buscan una experiencia creativa más completa y trabajan regularmente con diseños.",benefits:["Modalidad Premium","Proyectos creativos","Uso frecuente"]},
{name:"1año-- EDU",price:40,stock:2,desc:"Plan Pro, la alternativa de mayor nivel disponible para quienes buscan la opción más completa.",benefits:["Modalidad Pro","Nivel superior","Opción más completa"]}]},
{name:"ViX",cls:"p9",desc:"Una alternativa de entretenimiento digital con contenido en español y diferentes modalidades de acceso.",plans:[
{name:"1 PERFIL-- PREMIUM",price:4,stock:5,desc:"Plan Básico y económico para quienes buscan una alternativa sencilla.",benefits:["Opción accesible","Uso personal","Modalidad básica"]},
{name:"CUENTA 1Mes",price:10,stock:4,desc:"Plan Estándar con una experiencia equilibrada para quienes buscan una opción intermedia.",benefits:["Modalidad estándar","Uso habitual","Equilibrio de precio"]},
{name:"CUENTA 2Mes",price:18,stock:3,desc:"Plan Premium para quienes prefieren una modalidad superior dentro del catálogo.",benefits:["Modalidad Premium","Opción superior","Mayor comodidad"]},
{name:"CUENTA 3Mes",price:25,stock:2,desc:"Plan Pro, la alternativa de mayor nivel disponible en nuestra oferta.",benefits:["Modalidad Pro","Nivel superior","Opción más completa"]}]},
{name:"Spotify",cls:"p10",desc:"Una alternativa de entretenimiento musical digital para disfrutar música y contenido según la modalidad elegida.",plans:[
{name:"1Mes User",price:10,stock:5,desc:"Plan Básico y económico para quienes buscan una alternativa sencilla para su experiencia musical.",benefits:["Opción accesible","Uso personal","Modalidad básica"]},
{name:"1Mes COMPLETA",price:32,stock:4,desc:"Plan Estándar con una experiencia equilibrada entre precio y prestaciones para uso frecuente.",benefits:["Modalidad estándar","Uso frecuente","Equilibrio de precio"]},
{name:"1año User",price:80,stock:3,desc:"Plan Premium pensado para quienes buscan una experiencia musical superior y una alternativa más completa.",benefits:["Modalidad Premium","Opción superior","Uso habitual"]},
{name:"2Mes User ",price:14,stock:2,desc:"Plan Pro, la opción de mayor nivel disponible en nuestro catálogo.",benefits:["Modalidad Pro","Nivel superior","Opción más completa"]}]},

{name:"Free Fire",cls:"p11",category:"gaming",isNew:true,offer:true,desc:"Recargas y opciones digitales para jugadores que buscan una compra rápida y clara.",plans:[
{name:"Recarga Básica",price:5,stock:8,desc:"Opción económica para una recarga pequeña.",benefits:["Compra rápida","Opción accesible","Entrega según modalidad"]},
{name:"Recarga Media",price:10,stock:7,desc:"Una opción equilibrada para quienes recargan con frecuencia.",benefits:["Buen equilibrio","Compra rápida","Uso habitual"]},
{name:"Recarga Pro",price:20,stock:5,desc:"Recarga de mayor valor para jugadores frecuentes.",benefits:["Mayor valor","Compra rápida","Opción popular"]},
{name:"Recarga Premium",price:40,stock:3,desc:"La opción de mayor valor para quienes buscan una recarga amplia.",benefits:["Mayor cantidad","Opción premium","Compra prioritaria"]}]},
{name:"Roblox",cls:"p12",category:"gaming",isNew:true,desc:"Opciones digitales para Roblox pensadas para compras sencillas y rápidas.",plans:[
{name:"Pack Básico",price:5,stock:8,desc:"Alternativa económica para comenzar.",benefits:["Opción accesible","Compra rápida","Uso personal"]},
{name:"Pack Estándar",price:10,stock:6,desc:"Opción equilibrada para usuarios habituales.",benefits:["Modalidad estándar","Buen equilibrio","Compra rápida"]},
{name:"Pack Premium",price:20,stock:5,desc:"Mayor valor para jugadores frecuentes.",benefits:["Mayor valor","Uso habitual","Opción superior"]},
{name:"Pack Pro",price:35,stock:3,desc:"La alternativa más completa del catálogo para Roblox.",benefits:["Opción Pro","Mayor valor","Compra rápida"]}]},
{name:"Steam",cls:"p13",category:"gaming",isNew:true,desc:"Opciones digitales para entretenimiento y gaming en PC.",plans:[
{name:"Saldo S/ 10",price:12,stock:6,desc:"Saldo digital para pequeñas compras.",benefits:["Compra sencilla","Valor accesible","Entrega rápida"]},
{name:"Saldo S/ 20",price:22,stock:6,desc:"Saldo equilibrado para compras habituales.",benefits:["Valor equilibrado","Compra sencilla","Uso personal"]},
{name:"Saldo S/ 50",price:52,stock:4,desc:"Mayor saldo para jugadores frecuentes.",benefits:["Mayor valor","Uso frecuente","Compra rápida"]},
{name:"Saldo S/ 100",price:102,stock:2,desc:"Opción de mayor valor para compras grandes.",benefits:["Mayor saldo","Opción premium","Compra rápida"]}]},
{name:"PlayStation",cls:"p14",category:"gaming",isNew:true,offer:true,desc:"Opciones digitales orientadas al ecosistema PlayStation.",plans:[
{name:"Saldo S/ 10",price:12,stock:6,desc:"Saldo de entrada para pequeñas compras.",benefits:["Compra sencilla","Opción accesible","Entrega según modalidad"]},
{name:"Saldo S/ 20",price:22,stock:5,desc:"Saldo equilibrado para compras habituales.",benefits:["Buen equilibrio","Uso habitual","Compra rápida"]},
{name:"Saldo S/ 50",price:52,stock:4,desc:"Mayor valor para jugadores frecuentes.",benefits:["Mayor valor","Compra rápida","Opción popular"]},
{name:"Saldo S/ 100",price:102,stock:2,desc:"La opción de mayor valor del catálogo.",benefits:["Mayor saldo","Opción premium","Compra rápida"]}]},
{name:"Xbox",cls:"p15",category:"gaming",isNew:true,desc:"Opciones digitales para el ecosistema Xbox.",plans:[
{name:"Saldo S/ 10",price:12,stock:6,desc:"Saldo de entrada para pequeñas compras.",benefits:["Compra sencilla","Opción accesible","Entrega según modalidad"]},
{name:"Saldo S/ 20",price:22,stock:5,desc:"Saldo equilibrado para compras habituales.",benefits:["Buen equilibrio","Uso habitual","Compra rápida"]},
{name:"Saldo S/ 50",price:52,stock:4,desc:"Mayor valor para jugadores frecuentes.",benefits:["Mayor valor","Compra rápida","Opción popular"]},
{name:"Saldo S/ 100",price:102,stock:2,desc:"La opción de mayor valor del catálogo.",benefits:["Mayor saldo","Opción premium","Compra rápida"]}]},
{name:"ChatGPT Plus",cls:"p16",category:"ai",isNew:true,desc:"Herramienta de inteligencia artificial para productividad, ideas, estudio y trabajo.",plans:[
{name:"1Mes",price:15,stock:5,desc:"Acceso mensual para uso personal.",benefits:["Uso personal","Modalidad mensual","Productividad"]},
{name:"3Mes",price:40,stock:4,desc:"Opción de varios meses para uso continuo.",benefits:["Mayor duración","Ahorro frente a mensual","Uso frecuente"]},
{name:"6Mes",price:72,stock:3,desc:"Alternativa de larga duración para usuarios habituales.",benefits:["Mayor duración","Uso frecuente","Mejor valor"]},
{name:"1Año",price:130,stock:2,desc:"La opción anual para quienes quieren continuidad.",benefits:["Duración anual","Uso continuo","Opción completa"]}]},
{name:"Claude Pro",cls:"p17",category:"ai",isNew:true,desc:"Asistente de IA orientado a escritura, análisis y productividad.",plans:[
{name:"1Mes",price:15,stock:5,desc:"Acceso mensual para uso personal.",benefits:["Uso personal","Modalidad mensual","Productividad"]},
{name:"3Mes",price:40,stock:4,desc:"Opción de varios meses para uso continuo.",benefits:["Mayor duración","Ahorro","Uso frecuente"]},
{name:"6Mes",price:72,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Uso habitual","Mejor valor"]},
{name:"1Año",price:130,stock:2,desc:"Opción anual para usuarios de largo plazo.",benefits:["Duración anual","Uso continuo","Opción completa"]}]},
{name:"Gemini Advanced",cls:"p18",category:"ai",isNew:true,desc:"Herramientas de IA para productividad, investigación y creación.",plans:[
{name:"1Mes",price:15,stock:5,desc:"Acceso mensual para uso personal.",benefits:["Uso personal","Modalidad mensual","Productividad"]},
{name:"3Mes",price:40,stock:4,desc:"Opción de varios meses.",benefits:["Mayor duración","Ahorro","Uso frecuente"]},
{name:"6Mes",price:72,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Uso habitual","Mejor valor"]},
{name:"1Año",price:130,stock:2,desc:"Opción anual para continuidad.",benefits:["Duración anual","Uso continuo","Opción completa"]}]},
{name:"YouTube Music",cls:"p19",category:"music",isNew:true,desc:"Música digital para escuchar tus canciones y listas favoritas.",plans:[
{name:"1Mes",price:8,stock:6,desc:"Modalidad mensual para uso personal.",benefits:["Uso personal","Modalidad mensual","Música sin interrupciones"]},
{name:"3Mes",price:22,stock:5,desc:"Opción de varios meses con mejor valor.",benefits:["Mayor duración","Mejor valor","Uso frecuente"]},
{name:"6Mes",price:40,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Uso habitual","Ahorro"]},
{name:"1Año",price:72,stock:2,desc:"Opción anual para usuarios frecuentes.",benefits:["Duración anual","Mejor valor","Uso continuo"]}]},
{name:"Apple Music",cls:"p20",category:"music",isNew:true,desc:"Servicio musical digital para disfrutar música y playlists.",plans:[
{name:"1Mes",price:8,stock:6,desc:"Modalidad mensual.",benefits:["Uso personal","Modalidad mensual","Música digital"]},
{name:"3Mes",price:22,stock:5,desc:"Opción de varios meses.",benefits:["Mayor duración","Mejor valor","Uso frecuente"]},
{name:"6Mes",price:40,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Ahorro","Uso habitual"]},
{name:"1Año",price:72,stock:2,desc:"Opción anual.",benefits:["Duración anual","Mejor valor","Uso continuo"]}]},
{name:"Google One",cls:"p21",category:"apps",isNew:true,desc:"Almacenamiento y servicios digitales para tus archivos y dispositivos.",plans:[
{name:"1Mes",price:7,stock:6,desc:"Opción mensual para necesidades básicas.",benefits:["Uso personal","Modalidad mensual","Almacenamiento"]},
{name:"3Mes",price:19,stock:5,desc:"Opción de varios meses.",benefits:["Mayor duración","Mejor valor","Uso frecuente"]},
{name:"6Mes",price:35,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Ahorro","Uso habitual"]},
{name:"1Año",price:60,stock:2,desc:"Opción anual para continuidad.",benefits:["Duración anual","Mejor valor","Uso continuo"]}]},
{name:"CapCut Pro",cls:"p22",category:"design",isNew:true,offer:true,desc:"Herramientas creativas para edición de video y contenido digital.",plans:[
{name:"1Mes",price:8,stock:6,desc:"Acceso mensual para creación de contenido.",benefits:["Edición de video","Uso personal","Modalidad mensual"]},
{name:"3Mes",price:22,stock:5,desc:"Opción de varios meses.",benefits:["Mayor duración","Creación frecuente","Mejor valor"]},
{name:"6Mes",price:40,stock:3,desc:"Alternativa para creadores habituales.",benefits:["Mayor duración","Uso frecuente","Ahorro"]},
{name:"1Año",price:72,stock:2,desc:"Opción anual para creadores constantes.",benefits:["Duración anual","Uso continuo","Opción completa"]}]},
{name:"Adobe Creative",cls:"p23",category:"design",isNew:true,desc:"Herramientas creativas para diseño, fotografía y producción de contenido.",plans:[
{name:"1Mes",price:20,stock:4,desc:"Acceso mensual para proyectos creativos.",benefits:["Creatividad","Modalidad mensual","Uso personal"]},
{name:"3Mes",price:55,stock:3,desc:"Opción de varios meses.",benefits:["Mayor duración","Uso frecuente","Mejor valor"]},
{name:"6Mes",price:100,stock:2,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Ahorro","Uso profesional"]},
{name:"1Año",price:180,stock:1,desc:"Opción anual para proyectos constantes.",benefits:["Duración anual","Uso continuo","Opción completa"]}]},
{name:"Coursera",cls:"p24",category:"education",isNew:true,desc:"Opciones digitales para aprendizaje y formación.",plans:[
{name:"1Mes",price:12,stock:5,desc:"Acceso mensual para estudiar a tu ritmo.",benefits:["Aprendizaje","Modalidad mensual","Uso personal"]},
{name:"3Mes",price:30,stock:4,desc:"Opción para estudiar durante varios meses.",benefits:["Mayor duración","Estudio continuo","Mejor valor"]},
{name:"6Mes",price:55,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Uso frecuente","Ahorro"]},
{name:"1Año",price:95,stock:2,desc:"Opción anual para aprendizaje continuo.",benefits:["Duración anual","Estudio continuo","Opción completa"]}]},
{name:"Microsoft 365",cls:"p25",category:"software",isNew:true,desc:"Herramientas de productividad para documentos, trabajo y estudio.",plans:[
{name:"1Mes",price:10,stock:6,desc:"Modalidad mensual para productividad.",benefits:["Productividad","Uso personal","Modalidad mensual"]},
{name:"3Mes",price:28,stock:5,desc:"Opción de varios meses.",benefits:["Mayor duración","Mejor valor","Uso frecuente"]},
{name:"6Mes",price:50,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Ahorro","Uso habitual"]},
{name:"1Año",price:85,stock:2,desc:"Opción anual para continuidad.",benefits:["Duración anual","Uso continuo","Opción completa"]}]},
{name:"VPN Premium",cls:"p26",category:"utilities",isNew:true,desc:"Servicio de utilidad digital orientado a privacidad y navegación.",plans:[
{name:"1Mes",price:8,stock:6,desc:"Modalidad mensual.",benefits:["Uso personal","Modalidad mensual","Utilidad digital"]},
{name:"3Mes",price:22,stock:5,desc:"Opción de varios meses.",benefits:["Mayor duración","Mejor valor","Uso frecuente"]},
{name:"6Mes",price:40,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Ahorro","Uso habitual"]},
{name:"1Año",price:70,stock:2,desc:"Opción anual para uso continuo.",benefits:["Duración anual","Mejor valor","Uso continuo"]}]},
{name:"Cloud Storage 2TB",cls:"p27",category:"utilities",isNew:true,offer:true,desc:"Almacenamiento digital para respaldos, archivos y proyectos.",plans:[
{name:"1Mes",price:8,stock:6,desc:"Modalidad mensual.",benefits:["Almacenamiento","Uso personal","Modalidad mensual"]},
{name:"3Mes",price:22,stock:5,desc:"Opción de varios meses.",benefits:["Mayor duración","Mejor valor","Uso frecuente"]},
{name:"6Mes",price:40,stock:3,desc:"Alternativa de larga duración.",benefits:["Mayor duración","Ahorro","Uso habitual"]},
{name:"1Año",price:70,stock:2,desc:"Opción anual.",benefits:["Duración anual","Mejor valor","Uso continuo"]}]},
];

function applyBaseProductOverridesEarly(){
  try{
    const raw=JSON.parse(localStorage.getItem("nexoplay_base_product_overrides")||"{}");
    Object.keys(raw||{}).forEach(k=>{
      const i=Number(k),p=products[i],o=raw[k];
      if(!p||!o)return;
      if(o.name!==undefined)p.name=String(o.name);
      if(o.category!==undefined)p.category=String(o.category);
      if(o.templateImage!==undefined)p.templateImage=String(o.templateImage||"");
      if(o.desc!==undefined)p.desc=String(o.desc||"");
      if(Array.isArray(o.plans)&&o.plans.length){
        p.plans=o.plans.map(x=>({...x,price:Number(x.price||0),stock:Number(x.stock||0),active:x.active!==false}));
      }
    });
  }catch(_){}
}
applyBaseProductOverridesEarly();
let cart=[],currentProduct=null,selectedPlan=0;
// Shared public references for modular UI code; getters keep the legacy state as the single source.
try{Object.defineProperty(window,'cart',{configurable:true,get:()=>cart,set:v=>{cart=Array.isArray(v)?v:[]}});Object.defineProperty(window,'currentProduct',{configurable:true,get:()=>currentProduct,set:v=>{currentProduct=v}});Object.defineProperty(window,'selectedPlan',{configurable:true,get:()=>selectedPlan,set:v=>{selectedPlan=Number(v)||0}});window.products=products;}catch(_){}
const STOCK_KEY="nexoplay_stock_v3";
const DB_PLAN_IDS=products.flatMap((p,pi)=>p.plans.map((plan,si)=>pi*4+si+1));
let stockData=JSON.parse(localStorage.getItem(STOCK_KEY)||localStorage.getItem("nexoplay_stock_v2")||"null")||{};
products.forEach((p,pi)=>p.plans.forEach((plan,si)=>{const k=`${pi}-${si}`;if(stockData[k]===undefined)stockData[k]=Number(plan.stock||0)}));
try{
  const raw=JSON.parse(localStorage.getItem('nexoplay_base_product_overrides')||'{}');
  Object.keys(raw||{}).forEach(k=>{const i=Number(k),plans=raw[k]?.plans;if(!Number.isInteger(i)||!Array.isArray(plans))return;plans.forEach((pl,j)=>{if(pl&&Number.isFinite(Number(pl.stock)))stockData[`${i}-${j}`]=Number(pl.stock)})});
}catch(_){}
try{const activeMap=JSON.parse(localStorage.getItem('nexoplay_plan_active')||'{}');products.forEach((p,pi)=>p.plans.forEach((plan,si)=>{const k=`${pi}-${si}`;if(activeMap[k]!==undefined)plan.active=activeMap[k]!==false}))}catch(_){}
function getActivePlans(product){return (product?.plans||[]).filter(p=>p&&String(p.name||'').trim()&&p.active!==false)}
function getStock(pi,si){const p=products[pi]?.plans?.[si];return Math.max(0,Number(stockData[`${pi}-${si}`]??p?.stock??0))}
function saveStock(){localStorage.setItem(STOCK_KEY,JSON.stringify(stockData))}
function normalizePlanName(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
function setPlanFromDb(pi,si,row){if(!row||!products[pi]?.plans?.[si])return;const plan=products[pi].plans[si];plan.dbPlanId=Number(row.id);plan.dbProductId=Number(row.producto_id);plan.stock=Math.max(0,Number(row.stock||0));if(row.precio!==null&&row.precio!==undefined)plan.price=Number(row.precio);if(row.nombre)plan.name=String(row.nombre);plan.active=row.activo!==false;stockData[`${pi}-${si}`]=plan.stock}
async function loadStockFromSupabase(){
  if(!supabaseClient)return false;
  try{
    const {data,error}=await supabaseClient.from("planes").select("id,producto_id,nombre,precio,stock,activo").order("id",{ascending:true});
    if(error)throw error;
    if(!Array.isArray(data))return false;
    data.forEach(row=>{
      const productId=Number(row.producto_id); const pi=productId>=1&&productId<=products.length?productId-1:-1;
      if(pi<0||!products[pi])return; const plans=products[pi].plans||[];
      let si=plans.findIndex(p=>p?.dbPlanId===Number(row.id));
      if(si<0)si=plans.findIndex(p=>normalizePlanName(p?.name)===normalizePlanName(row.nombre)&&!p?.dbPlanId);
      if(si<0){const free=plans.map((p,i)=>({p,i})).find(x=>!x.p?.dbPlanId);si=free?.i??-1}
      if(si>=0)setPlanFromDb(pi,si,row);
    }); saveStock(); return true;
  }catch(err){console.error("NexoPlay Supabase stock error:",err);return false}
}
async function adjustPlanStock(pi,si,delta){
  const plan=products[pi]?.plans?.[si]; if(!plan)return {ok:false,error:new Error('Plan no encontrado.')};
  if(plan.dbPlanId&&supabaseClient){
    try{const {data,error}=await supabaseClient.rpc("ajustar_stock_plan",{p_plan_id:Number(plan.dbPlanId),p_cantidad:delta});if(error)throw error;const row=Array.isArray(data)?data[0]:data;if(!row)throw new Error("La función no devolvió el stock actualizado.");const newStock=Math.max(0,Number(row.stock));stockData[`${pi}-${si}`]=newStock;plan.stock=newStock;saveStock();return {ok:true,stock:newStock}}catch(err){console.error("NexoPlay Supabase stock adjustment error:",err);return {ok:false,error:err}}
  }
  if(products[pi]?.templateId&&supabaseClient){
    try{const row=catalogTemplateCache.find(x=>String(x.id)===String(products[pi].templateId));if(!row)throw new Error('No se encontró la plantilla.');const content=templateContentFromRow(row);const plans=Array.isArray(content.plans)?content.plans:[];const target=plans[si];if(!target)throw new Error('Plan no encontrado en la plantilla.');const next=Math.max(0,Number(target.stock||0)+Number(delta||0));target.stock=next;content.plans=plans;const result=await callTemplateRpc('actualizar_plantilla',[{p_id:Number(row.id),p_nombre:row.name,p_contenido:JSON.stringify(content),p_producto_id:row.producto_id??null},{plantilla_id:Number(row.id),p_nombre:row.name,p_contenido:JSON.stringify(content),p_producto_id:row.producto_id??null}]);if(!result.ok)throw result.error||new Error('No se pudo guardar el stock de la plantilla.');plan.stock=next;stockData[`${pi}-${si}`]=next;saveStock();await loadCatalogTemplates();return {ok:true,stock:next}}catch(err){console.error('NexoPlay template stock adjustment:',err);return {ok:false,error:err}}
  }
  const newStock=Math.max(0,getStock(pi,si)+Number(delta||0));stockData[`${pi}-${si}`]=newStock;plan.stock=newStock;saveStock();return {ok:true,stock:newStock,localOnly:true};
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200)}
function categoryOf(product){const explicit=typeof product==='object'&&product?.category;if(explicit)return explicit;const name=String(typeof product==='string'?product:(product?.name||'')).toLowerCase();if(/spotify|youtube music|apple music/.test(name))return 'music';if(/crunchyroll/.test(name))return 'anime';if(/canva|adobe|capcut/.test(name))return 'design';if(/free fire|roblox|steam|playstation|xbox|nintendo|pubg|mobile legends/.test(name))return 'gaming';if(/chatgpt|claude|gemini|copilot|perplexity/.test(name))return 'ai';if(/google one|apple one|google play|icloud|duolingo/.test(name))return 'apps';if(/curso|coursera|udemy|educa|estudio|plantilla cv/.test(name))return 'education';if(/microsoft|office|windows|software/.test(name))return 'software';if(/vpn|cloud|utilidad|herramienta/.test(name))return 'utilities';return 'streaming'}
const BASE_CATEGORY_META=[['all','✨','Todas','Todo el catálogo'],['streaming','🎬','Streaming','Películas y series'],['gaming','🎮','Gaming','Juegos y recargas'],['ai','🤖','IA','Herramientas inteligentes'],['music','🎵','Música','Audio y entretenimiento'],['apps','📱','Apps','Aplicaciones y servicios'],['design','🎨','Diseño','Creatividad y recursos'],['education','📚','Educación','Estudio y aprendizaje'],['software','💻','Software','Productividad'],['utilities','🛠️','Utilidades','Herramientas digitales'],['offers','🔥','Ofertas','Precios especiales'],['new','🆕','Nuevos','Recién agregados'],['anime','🍥','Anime','Anime y contenido']];
let CATEGORY_META=[...BASE_CATEGORY_META];
let customCategories=[];
function categoryMetaRows(){return CATEGORY_META.filter(x=>!['all','offers','new'].includes(x[0]));}
function categoryLabel(key){return CATEGORY_META.find(x=>x[0]===key)?.[2]||key;}
async function loadCategories(){
 let fallback=BASE_CATEGORY_META.slice();try{const extra=JSON.parse(localStorage.getItem('nexoplay_custom_categories')||'[]');if(Array.isArray(extra)&&extra.length)fallback=[...fallback,...extra.map(x=>[x.slug,x.icon||'📁',x.name||x.slug,x.description||''])]}catch(_){} if(!supabaseClient){CATEGORY_META=fallback;updateCategoryFilterOptions();renderCategoryChips();return false}
 try{const {data,error}=await supabaseClient.from('nexoplay_catalog_categories').select('id,slug,name,icon,description,active,sort_order,is_system').eq('active',true).order('sort_order',{ascending:true}).order('name',{ascending:true});if(error)throw error;if(Array.isArray(data)&&data.length){const special=fallback.filter(x=>['all','offers','new'].includes(x[0]));const rows=data.filter(r=>!['all','offers','new'].includes(String(r.slug))).map(r=>[String(r.slug),String(r.icon||'📁'),String(r.name||r.slug),String(r.description||'')]);CATEGORY_META=[special.find(x=>x[0]==='all'),...rows,special.find(x=>x[0]==='offers'),special.find(x=>x[0]==='new')].filter(Boolean);customCategories=data.filter(r=>!r.is_system);updateCategoryFilterOptions();renderCategoryChips();return true}}catch(err){console.warn('NexoPlay categories:',err)}
 CATEGORY_META=fallback;updateCategoryFilterOptions();renderCategoryChips();return false;
}
function updateCategoryFilterOptions(){const el=document.getElementById('categoryFilter');if(!el)return;const current=el.value||'all';el.innerHTML=CATEGORY_META.map(x=>`<option value="${escapeHTML(x[0])}">${escapeHTML(x[2])}</option>`).join('');el.value=CATEGORY_META.some(x=>x[0]===current)?current:'all'}
function matchesCatalogCategory(p,cat){if(cat==='all')return true;if(cat==='offers')return !!p.offer;if(cat==='new')return !!p.isNew;return categoryOf(p)===cat}
function selectCategory(cat){const el=document.getElementById('categoryFilter');if(el)el.value=cat;document.querySelectorAll('.category-chip').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));const meta=CATEGORY_META.find(x=>x[0]===cat);const hint=document.getElementById('categoryHint');if(hint)hint.textContent=meta?meta[3]:'Explora el catálogo';applyCatalogTools();document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth',block:'start'})}
function renderCategoryChips(){const c=document.getElementById('categoryChips');if(!c)return;const counts={};products.forEach(p=>{const cat=categoryOf(p);counts[cat]=(counts[cat]||0)+1;if(p.offer)counts.offers=(counts.offers||0)+1;if(p.isNew)counts.new=(counts.new||0)+1});c.innerHTML=CATEGORY_META.map(([key,icon,label,sub])=>{const count=key==='all'?products.length:(counts[key]||0);return `<button class="category-chip ${key==='all'?'active':''}" data-cat="${key}" onclick="selectCategory('${key}')"><span class="cat-icon">${icon}</span><strong>${label}</strong><span>${count} producto${count===1?'':'s'}</span>${key!=='all'&&count>0?'<i class="cat-dot"></i>':''}</button>`}).join('')}

let favOnly=false;
let favorites=JSON.parse(localStorage.getItem('nexoplay_favorites')||'[]');
function isFavorite(i){return favorites.includes(i)}
function toggleFavorite(i,e){if(e)e.stopPropagation();favorites=isFavorite(i)?favorites.filter(x=>x!==i):[...favorites,i];localStorage.setItem('nexoplay_favorites',JSON.stringify(favorites));renderFavorites();renderFavoritesModal();applyCatalogTools();showToast(isFavorite(i)?'Agregado a favoritos':'Eliminado de favoritos')}
function productImageStyle(p){return p?.templateImage?` style="background-image:url('${escapeHTML(p.templateImage)}')"`:''}
function rankDiscountRate(){
 let uid=null;try{uid=(window.__nexoGetCurrentUser?.()||null)?.id||null}catch(_){}
 if(!uid)return 0;
 let st=null,rs=[];try{st=JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')[uid]||null;rs=JSON.parse(localStorage.getItem('nexoplay_rank_config_v2')||'[]')}catch(_){}
 if(!st||st.rankId!=='distribuidor')return 0;
 if(st.rankExpires&&new Date(st.rankExpires).getTime()<=Date.now())return 0;
 const r=Array.isArray(rs)?rs.find(x=>x.id==='distribuidor'):null;
 const configured=Number(r?.discount);
 return Math.min(100,Math.max(0,Number.isFinite(configured)?configured:40))/100;
}
function effectiveProductPrice(value){const n=Number(value||0);return Math.max(0,n*(1-rankDiscountRate()))}
function effectiveComboPrice(value){return effectiveProductPrice(value)}
function renderProducts(list=products){
 const grid=document.getElementById('grid');
 grid.innerHTML=list.map(p=>{const pi=products.indexOf(p);const plans=getActivePlans(p);const low=plans.length?Math.min(...plans.map(x=>getStock(pi,p.plans.indexOf(x)))):0;const minPrice=plans.length?Math.min(...plans.map(x=>effectiveProductPrice(x.price,pi))):0;return `<article class="product" onclick="openModal(${pi})"><div class="poster ${p.cls}"${productImageStyle(p)}><div class="product-badges"><span class="tag">DIGITAL</span>${[0,5,9].includes(pi)?'<span class="tag featured-tag">DESTACADO</span>':''}${plans.length&&low<=2&&low>0?'<span class="tag stock-low">ÚLTIMAS UNIDADES</span>':''}${!plans.length||low<=0?'<span class="tag stock-low">AGOTADO</span>':''}</div><button class="fav-btn ${isFavorite(pi)?'on':''}" onclick="toggleFavorite(${pi},event)" aria-label="Favorito">${isFavorite(pi)?'♥':'♡'}</button><strong>${escapeHTML(p.name)}</strong></div><div class="product-info"><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.desc)}</p><div class="product-bottom"><div><span class="from">DESDE</span><span class="price">${plans.length?`S/ ${minPrice.toFixed(2)}`:'Sin planes'}</span>${rankDiscountRate()>0?`<div style="font-size:9px;color:#67e8f9;font-weight:850;margin-top:3px">🏷️ ${Math.round(rankDiscountRate()*100)}% Distribuidor</div>`:''}<div class="status-row"><span class="stock-status ${!plans.length||low<=0?'out':low<=2?'low':'ok'}">${!plans.length?'Sin planes':low<=0?'Agotado':low<=2?'Últimas unidades':'Disponible'}</span></div></div><button class="add" onclick="event.stopPropagation();openModal(${pi})">${plans.length?'Ver planes':'Configurar'}</button></div></div></article>`}).join('');document.getElementById('empty').style.display=list.length?'none':'block';
}
function applyCatalogTools(){let list=[...products];const q=document.getElementById('search').value.toLowerCase().trim();const cat=document.getElementById('categoryFilter')?.value||'all';const sort=document.getElementById('sortFilter')?.value||'default';if(q)list=list.filter(p=>(p.name+' '+p.desc+' '+p.plans.map(x=>x.name+' '+x.desc).join(' ')).toLowerCase().includes(q));if(cat!=='all')list=list.filter(p=>matchesCatalogCategory(p,cat));if(favOnly)list=list.filter(p=>isFavorite(products.indexOf(p)));if(sort==='priceAsc')list.sort((a,b)=>Math.min(...a.plans.map(x=>x.price))-Math.min(...b.plans.map(x=>x.price)));if(sort==='priceDesc')list.sort((a,b)=>Math.min(...b.plans.map(x=>x.price))-Math.min(...a.plans.map(x=>x.price)));if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));if(sort==='stock')list.sort((a,b)=>Math.max(...b.plans.map((x,j)=>getStock(products.indexOf(b),j)))-Math.max(...a.plans.map((x,j)=>getStock(products.indexOf(a),j))));renderProducts(list)}
function filterProducts(){applyCatalogTools()}
function toggleFavOnly(){favOnly=!favOnly;document.getElementById('favOnlyBtn').classList.toggle('active',favOnly);applyCatalogTools()}
function clearCatalogTools(){document.getElementById('search').value='';document.getElementById('categoryFilter').value='all';document.getElementById('sortFilter').value='default';favOnly=false;document.getElementById('favOnlyBtn').classList.remove('active');applyCatalogTools()}
function renderFavorites(){const c=document.getElementById('favoritesGrid');const list=favorites.map(i=>products[i]).filter(Boolean);c.innerHTML=list.length?list.map(p=>{const i=products.indexOf(p);return `<div class="mini-card" onclick="openModal(${i})"><div class="mini-poster ${p.cls}"${productImageStyle(p)}></div><div>${escapeHTML(p.name)}</div></div>`}).join(''):'<div class="favorites-empty">Todavía no tienes favoritos. Pulsa ♡ en una tarjeta para guardarla.</div>'}

function filterProducts(){const q=document.getElementById('search').value.toLowerCase().trim();renderProducts(products.filter(p=>(p.name+' '+p.desc+' '+p.plans.map(x=>x.name+' '+x.desc).join(' ')).toLowerCase().includes(q)))}
function openModal(i){currentProduct=products[i];selectedPlan=0;document.getElementById('modalTitle').textContent=currentProduct.name;renderPlans();updatePlanInfo();document.getElementById('modalBg').classList.add('open')}
function renderPlans(){const pi=products.indexOf(currentProduct);const active=getActivePlans(currentProduct);if(!active.length){document.getElementById('plans').innerHTML='<div class="sale-empty">Este producto todavía no tiene planes publicados.</div>';return}const currentPlan=currentProduct.plans[selectedPlan];if(!currentPlan||currentPlan.active===false||!active.includes(currentPlan))selectedPlan=currentProduct.plans.indexOf(active[0]);document.getElementById('plans').innerHTML=active.map(x=>{const j=currentProduct.plans.indexOf(x),ss=getStock(pi,j);return `<div class="plan ${j===selectedPlan?'selected':''}" onclick="selectPlan(${j})"><div class="plan-row"><div><div class="plan-name">${escapeHTML(x.name)}</div><div class="plan-meta"><span class="plan-price">S/ ${effectiveProductPrice(x.price,pi).toFixed(2)}</span>${rankDiscountRate()>0?`<span style="font-size:9px;color:#67e8f9;font-weight:850">-${Math.round(rankDiscountRate()*100)}%</span>`:''}<span class="plan-stock ${ss<=0?'out':''}">${ss>0?'Stock: '+ss:'Agotado'}</span></div></div><button ${ss<=0?'disabled':''} onclick="event.stopPropagation();selectPlan(${j})">${ss>0?'Elegir':'Agotado'}</button></div><div class="plan-desc">${escapeHTML(x.desc||'Modalidad disponible.')}</div></div>`}).join('')}
function updatePlanInfo(){const pi=products.indexOf(currentProduct),active=getActivePlans(currentProduct),x=currentProduct?.plans?.[selectedPlan];if(!x||!active.includes(x)){document.getElementById('modalDescription').innerHTML='<span class="admin-muted">Selecciona una modalidad disponible.</span>';document.getElementById('modalBenefits').innerHTML='';document.getElementById('addBtn').disabled=true;document.getElementById('addBtn').style.opacity=.5;return}const ss=getStock(pi,selectedPlan);document.getElementById('modalDescription').innerHTML=`<strong>${escapeHTML(x.name)}</strong><br><br>${escapeHTML(x.desc||'Modalidad disponible.')}<br><br><span class="plan-stock ${ss<=0?'out':''}">${ss>0?'Stock disponible: '+ss:'Agotado'}</span>`;document.getElementById('modalBenefits').innerHTML=(Array.isArray(x.benefits)?x.benefits:[]).map(b=>`<li>${escapeHTML(b)}</li>`).join('');document.getElementById('addBtn').disabled=ss<=0;document.getElementById('addBtn').style.opacity=ss<=0?.5:1}
function selectPlan(j){selectedPlan=j;renderPlans();updatePlanInfo()}
function closeModal(){document.getElementById('modalBg').classList.remove('open')}
function outsideClose(e){if(e.target.id==='modalBg')closeModal()}
async function addSelectedToCart(){const pi=products.indexOf(currentProduct),x=currentProduct?.plans?.[selectedPlan],s=getStock(pi,selectedPlan);if(pi<0||!x){showToast('Selecciona un plan válido.');return}if(s<=0){showToast('Este plan está agotado.');return}const result=await adjustPlanStock(pi,selectedPlan,-1);if(!result.ok){showToast('No se pudo actualizar el stock. Inténtalo nuevamente.');return}cart.push({name:currentProduct.name,plan:x.name,price:effectiveProductPrice(x.price,pi),originalPrice:Number(x.price||0),productIndex:pi,planIndex:selectedPlan});window.__nexoLastCartAdd={name:currentProduct.name,plan:x.name};updateCart();renderProducts();renderPlans();updatePlanInfo();closeModal();toggleCart(true);if(typeof window.nxCartAddedFeedback==='function')window.nxCartAddedFeedback(currentProduct.name,x.name);showToast('✅ Agregado al carrito')}

/* ===== COMBOS ===== */
const combos=[
 {id:'stream-duo',name:'Combo Stream Duo',desc:'Netflix + Disney+ para una experiencia de entretenimiento completa.',items:[{pi:0,si:0},{pi:1,si:0}],price:13},
 {id:'stream-trio',name:'Combo Stream Trio',desc:'Netflix + Disney+ + HBO Max en una sola reserva.',items:[{pi:0,si:1},{pi:1,si:1},{pi:2,si:1}],price:22},
 {id:'anime-music',name:'Combo Anime + Música',desc:'Crunchyroll + Spotify para acompañar tus horas de entretenimiento.',items:[{pi:6,si:0},{pi:9,si:0}],price:14}
];
function comboStock(c){return Math.min(...c.items.map(x=>getStock(x.pi,x.si)))}
function comboBasePrice(c){return c.items.reduce((sum,x)=>sum+Number(products[x.pi].plans[x.si].price||0),0)}
function renderCombos(){const c=document.getElementById('comboGrid');if(!c)return;c.innerHTML=combos.map(combo=>{const stock=comboStock(combo),base=comboBasePrice(combo),displayPrice=effectiveComboPrice(combo.price),save=Math.max(0,base-displayPrice);return `<article class="combo-card"><div class="eyebrow">🔥 COMBO</div><h3 style="margin:7px 0">${escapeHTML(combo.name)}</h3><p class="info-text">${escapeHTML(combo.desc)}</p><div class="combo-items">${combo.items.map(x=>`<span class="combo-chip">${escapeHTML(products[x.pi].name)} · ${escapeHTML(products[x.pi].plans[x.si].name)}</span>`).join('')}</div><div><span class="combo-price">S/ ${displayPrice.toFixed(2)}</span>${rankDiscountRate()>0?` <span class="combo-save">-${Math.round(rankDiscountRate()*100)}%</span>`:''} <span class="combo-save">${save>0?`Ahorras S/ ${save.toFixed(2)}`:'Precio combo'}</span></div><div class="status-row" style="margin-top:8px"><span class="stock-status ${stock<=0?'out':stock<=2?'low':'ok'}">${stock<=0?'Agotado':stock<=2?`Últimas unidades (${stock})`:`Disponible (${stock})`}</span></div><button class="primary" ${stock<=0?'disabled':''} onclick="addComboToCart('${combo.id}')">Añadir combo</button></article>`}).join('')}
async function addComboToCart(id){const combo=combos.find(x=>x.id===id);if(!combo)return;const stock=comboStock(combo);if(stock<=0){showToast('Este combo está agotado.');return}const changed=[];for(const x of combo.items){const r=await adjustPlanStock(x.pi,x.si,-1);if(!r.ok){for(const y of changed)await adjustPlanStock(y.pi,y.si,1);showToast('No se pudo reservar el combo. Inténtalo nuevamente.');return}changed.push(x)}cart.push({name:combo.name,plan:combo.items.map(x=>`${products[x.pi].name} — ${products[x.pi].plans[x.si].name}`).join(' + '),price:effectiveComboPrice(combo.price),originalPrice:Number(combo.price||0),comboId:combo.id,comboItems:combo.items.map(x=>({pi:x.pi,si:x.si}))});updateCart();renderProducts();renderCombos();toggleCart(true);showToast('Combo añadido al carrito')}
async function releaseCartItemStock(item){if(item?.comboItems){for(const x of item.comboItems)await adjustPlanStock(x.pi,x.si,1);return true}if(item?.productIndex!==undefined&&item?.planIndex!==undefined){const r=await adjustPlanStock(item.productIndex,item.planIndex,1);return !!r.ok}return true}

function getDiscount(){return 0}
function cartSubtotal(){return cart.reduce((a,x)=>a+x.price,0)}
function cartTotal(){return Math.max(0,cartSubtotal())}
function updateCart(){if(typeof window.nxRenderCart==='function'){window.nxRenderCart();return}const items=document.getElementById('cartItems');if(items)items.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><div class="cart-item-top"><b>${escapeHTML(x.name)}</b><button class="remove" onclick="removeItem(${i})">Eliminar</button></div><div class="info-text">${escapeHTML(x.plan)} — S/ ${Number(x.price||0).toFixed(2)}</div></div>`).join(''):'<p class="info-text">Tu carrito está vacío.</p>';const total=cartTotal();const totalEl=document.getElementById('cartTotal');if(totalEl)totalEl.textContent=`S/ ${total.toFixed(2)}`}
function applyCoupon(){showToast('Los cupones promocionales están desactivados por ahora.')}
function previewReceipt(e){const f=e.target.files?.[0],img=document.getElementById('receiptPreview');if(!f){img.style.display='none';return}if(!f.type.startsWith('image/')){showToast('Selecciona una imagen.');e.target.value='';return}const r=new FileReader();r.onload=()=>{img.src=r.result;img.style.display='block'};r.readAsDataURL(f)}

async function removeItem(i){const x=cart[i];if(x){const ok=await releaseCartItemStock(x);if(!ok){showToast('No se pudo devolver el stock. Inténtalo nuevamente.');return}}cart.splice(i,1);updateCart();renderProducts();renderCombos();showToast('Producto eliminado y stock repuesto')}
function toggleCart(force){const p=document.getElementById('cartPanel');if(force===true)p.classList.add('open');else p.classList.toggle('open')}
function openPaymentModal(){document.getElementById('paymentModalBg').classList.add('open')}
function closePaymentModal(){document.getElementById('paymentModalBg').classList.remove('open')}
function paymentOutside(e){if(e.target.id==='paymentModalBg')closePaymentModal()}
function copyYape(){navigator.clipboard?.writeText(YAPE_NUMBER.replace(/\s/g,''));showToast('Número de Yape copiado')}
function openPlinModal(){document.getElementById('plinPaymentModalBg')?.classList.add('open')}
function closePlinModal(){document.getElementById('plinPaymentModalBg')?.classList.remove('open')}
function plinPaymentOutside(e){if(e.target.id==='plinPaymentModalBg')closePlinModal()}
function copyPlin(){navigator.clipboard?.writeText(PLIN_NUMBER.replace(/\s/g,''));showToast('Número de Plin copiado')}
function syncPlinUI(){const n=document.getElementById('plinNumber'),ln=document.getElementById('plinLargeNumber');if(n)n.textContent=PLIN_NUMBER;if(ln)ln.textContent=PLIN_NUMBER;document.querySelectorAll('#plinPaymentCard img,.payment-modal img[alt=\"QR de Plin\"]').forEach(img=>img.src=PLIN_IMAGE)}
function syncYapeUI(){
  const n=document.getElementById('yapeNumber'),ln=document.getElementById('yapeLargeNumber');
  if(n)n.textContent=YAPE_NUMBER;if(ln)ln.textContent=YAPE_NUMBER;
  document.querySelectorAll('#yapePaymentCard img,.payment-modal img[alt=\"Yape\"]').forEach(img=>img.src='images/yape.jpg');
}
function syncProfileAvatar(userObj=currentUser){
  const img=document.getElementById('profileAvatarImage');
  if(!img)return;
  const raw=userObj?.user_metadata?.avatar_url||userObj?.user_metadata?.picture||userObj?.user_metadata?.avatar||'';
  const url=typeof raw==='string'?raw.trim():'';
  img.onerror=()=>{img.onerror=null;img.src='images/profile-avatar.svg'};
  img.src=url||'images/profile-avatar.svg';
}

function getCheckoutMethod(){return document.querySelector('input[name="checkoutMethod"]:checked')?.value||'yape'}
function selectCheckoutMethod(method){
  document.getElementById('payYapeOption')?.classList.toggle('selected',method==='yape');
  document.getElementById('payPlinOption')?.classList.toggle('selected',method==='plin');
  document.getElementById('payWalletOption')?.classList.toggle('selected',method==='wallet');
  const y=document.getElementById('yapePaymentCard'),p=document.getElementById('plinPaymentCard'),w=document.getElementById('walletCheckoutBox'),receipt=document.getElementById('receiptInput');
  if(y){y.hidden=method!=='yape';y.style.display=method==='yape'?'block':'none'}
  if(p){p.hidden=method!=='plin';p.style.display=method==='plin'?'block':'none'}
  if(w){w.hidden=method!=='wallet';w.style.display=method==='wallet'?'block':'none'}
  if(receipt)receipt.disabled=method==='wallet';updateCheckoutWalletBalance()
}
function updateCheckoutWalletBalance(){const hint=document.getElementById('walletCheckoutHint'),box=document.getElementById('walletCheckoutBalance');const balance=Number(walletCache?.balance||0);if(currentUser&&supabaseClient){if(hint)hint.textContent=`Saldo disponible: S/ ${balance.toFixed(2)}`;if(box)box.innerHTML=`Saldo disponible: <span class="wallet-balance-inline">S/ ${balance.toFixed(2)}</span>`}else{if(hint)hint.textContent='Inicia sesión para pagar con saldo';if(box)box.textContent='Inicia sesión para consultar tu saldo.'}}
async function walletPurchase(amount,description){if(!currentUser||!supabaseClient)throw new Error('Inicia sesión para pagar con Wallet.');const {data,error}=await supabaseClient.rpc('wallet_spend_v1',{p_amount:Number(amount),p_description:description});if(error)throw error;const row=Array.isArray(data)?data[0]:data;if(row&&row.ok===false)throw new Error(row.message||'No se pudo completar el pago.');return row||{ok:true}}

async function checkout(){
  if(!cart.length){showToast('Agrega un producto al carrito primero.');return}
  const method=getCheckoutMethod();const discount=getDiscount();const subtotal=cartSubtotal();const total=cartTotal();const coupon=localStorage.getItem('nexoplay_coupon')||'';const orderId='NP-'+Date.now().toString().slice(-6);
  const checkoutBtn=document.getElementById('checkoutBtn');if(checkoutBtn){checkoutBtn.disabled=true;checkoutBtn.textContent=method==='wallet'?'Procesando Wallet…':'Preparando pedido…'}
  try{
    if(method==='wallet'){
      if(!currentUser){showToast('Inicia sesión para pagar con Wallet.');openProfile();return}
      if(!currentUser.user_metadata?.purchase_pin_hash){showToast('Tu cuenta todavía no tiene un PIN de compra configurado.');openProfile();return}
      if(!walletCache)await loadWalletData();const balance=Number(walletCache?.balance||0);if(balance<total){showToast(`Saldo insuficiente. Tienes S/ ${balance.toFixed(2)}.`);return}
      const confirmedPin=await requestPurchasePin();if(!confirmedPin){showToast('Compra cancelada.');return}
      await walletPurchase(total,`Compra ${orderId} — ${cart.map(x=>x.name).join(', ')}`);
      const orders=JSON.parse(localStorage.getItem('nexoplay_orders')||'[]');
      const paidOrder={id:orderId,ownerUserId:currentUser.id,date:new Date().toLocaleString('es-PE'),items:cart.map(x=>({name:x.name,plan:x.plan,price:x.price})),subtotal,discount,total,status:'Pagado con Wallet',paymentMethod:'Wallet'};
      orders.push(paidOrder);localStorage.setItem('nexoplay_orders',JSON.stringify(orders));
      // No vuelve a cobrar: solo registra la venta para el módulo de entregas.
      const saleSync=await createRemoteSale(paidOrder);
      cart=[];localStorage.removeItem('nexoplay_discount');localStorage.removeItem('nexoplay_coupon');updateCart();renderOrders();renderOrdersModal();renderProducts();renderCombos();await loadWalletData();
      if(saleSync.ok){showToast(`Pedido ${orderId} pagado y enviado a Ventas pendientes`)}else{showToast(`Pedido ${orderId} pagado. Quedó guardado y se reintentará la sincronización.`)}return;
    }
    if(WHATSAPP_NUMBER==='TU_NUMERO_WHATSAPP'){showToast('Configura tu número de WhatsApp en el código.');return}
    const receipt=document.getElementById('receiptInput')?.files?.[0];const lines=cart.map(x=>`• ${x.name} — ${x.plan} — S/ ${x.price.toFixed(2)}`).join('%0A');let msg=`*¡Hola! 👋 Quiero realizar un pedido en NexoPlay Digital* 🎬✨%0A%0A🧾 *N° de pedido:* ${orderId}%0A%0A📦 *Mi pedido:*%0A${lines}%0A%0A💰 *Subtotal:* S/ ${subtotal.toFixed(2)}%0A`;if(discount)msg+=`🏷️ *Descuento ${coupon}:* -S/ ${(subtotal-total).toFixed(2)}%0A`;msg+=`💵 *Total:* S/ ${total.toFixed(2)}%0A💳 *Método de pago:* ${method==='plin'?'Plin':'Yape'}%0A%0A`;msg+=receipt?'📎 *Ya tengo mi comprobante de pago y lo adjuntaré en este chat.*':'📎 *Aún debo adjuntar mi comprobante de pago.*';msg+=`%0A%0A🙏 *Quedo atento(a) a la confirmación de mi pedido. ¡Muchas gracias!* 😊✨`;
    // Yape/Plin solo preparan la solicitud por WhatsApp. No crean pedidos ni ventas
    // hasta que exista una verificación de pago fuera de este flujo.
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,'_blank');
    showToast(`Solicitud ${orderId} preparada por ${method==='plin'?'Plin':'Yape'}. Envía el comprobante por WhatsApp.`);
  }catch(err){console.error('NexoPlay checkout:',err);showToast(err?.message||'No se pudo completar el pago.')}finally{if(checkoutBtn){checkoutBtn.disabled=false;checkoutBtn.textContent='Continuar con mi pedido'}}
}
function getLocalOrdersForCurrentUser(){
  let orders=[];try{orders=JSON.parse(localStorage.getItem('nexoplay_orders')||'[]')}catch(_){orders=[]}
  // MIS PEDIDOS = únicamente compras Wallet del usuario autenticado.
  // Yape/Plin no pertenecen a este historial.
  if(!currentUser?.id)return [];
  return orders.filter(o=>o?.ownerUserId===currentUser.id && String(o?.paymentMethod||'').toLowerCase()==='wallet');
}
function renderOrders(){const c=document.getElementById('ordersContainer'),orders=getLocalOrdersForCurrentUser().slice().reverse();c.innerHTML=orders.length?orders.map(o=>`<div class="order-card"><strong>${escapeHTML(o.id)} · ${escapeHTML(o.status)}</strong><p>${escapeHTML(o.date)} · ${o.items.length} producto${o.items.length===1?'':'s'} · Total S/ ${Number(o.total).toFixed(2)}</p></div>`).join(''):'<div class="favorites-empty">Todavía no tienes pedidos guardados en este navegador.</div>'}
function renderFavoritesModal(){
  const c=document.getElementById('favoritesModalGrid');
  if(!c)return;
  const list=favorites.map(i=>products[i]).filter(Boolean);
  c.innerHTML=list.length?list.map(p=>{
    const i=products.indexOf(p);
    return `<div class="mini-card" onclick="closeFavorites();openModal(${i})"><div class="mini-poster ${p.cls}"${productImageStyle(p)}></div><div>${escapeHTML(p.name)}</div></div>`;
  }).join(''):'<div class="quick-modal-empty">Todavía no tienes favoritos.<br>Pulsa ♡ en cualquier plataforma para guardarla aquí.</div>';
}
function openFavorites(){renderFavoritesModal();document.getElementById('favoritesModalBg').classList.add('open')}
function closeFavorites(){document.getElementById('favoritesModalBg').classList.remove('open')}
function favoritesOutside(e){if(e.target.id==='favoritesModalBg')closeFavorites()}
function renderOrdersModal(){
  const c=document.getElementById('ordersModalContainer');
  if(!c)return;
  let orders=getLocalOrdersForCurrentUser().slice().reverse();
  c.innerHTML=orders.length?orders.map(o=>{
    const wallet=o.paymentMethod==='Wallet';
    return `<div class="quick-order-card">
      <div class="quick-order-head"><strong>${escapeHTML(o.id)}</strong><span class="quick-order-status">${escapeHTML(o.status)}</span></div>
      <div class="quick-order-meta">${escapeHTML(o.date)} · ${o.items.length} producto${o.items.length===1?'':'s'} · Total S/ ${Number(o.total).toFixed(2)}</div>
      <div class="quick-order-items">${o.items.map(x=>`• ${escapeHTML(x.name)} — ${escapeHTML(x.plan)} — S/ ${Number(x.price).toFixed(2)}`).join('<br>')}</div>
      ${wallet?`<div class="order-note">📦 <b>Entrega de cuenta:</b> tu pago con Wallet fue registrado. La cuenta se entrega manualmente después de que el administrador la prepare.</div><button class="order-view-btn" onclick="openOrderDelivery('${escapeHTML(o.id)}')">🔐 Ver estado de entrega / datos</button>`:''}
    </div>`
  }).join(''):'<div class="quick-modal-empty">Todavía no tienes pedidos guardados en este navegador.</div>';
}

function openOrders(){openPurchases()}
function closeOrders(){closePurchases()}
function ordersOutside(e){if(e.target.id==='ordersModalBg')closeOrders()}
function closePurchases(){document.getElementById('purchasesModalBg')?.classList.remove('open')}
function purchasesOutside(e){if(e.target.id==='purchasesModalBg')closePurchases()}
async function openPurchases(){
  if(!currentUser){openAuth('login');showToast('Inicia sesión para ver tus compras.');return}
  // Revalidamos el rol antes de consultar cualquier compra.
  await refreshAdminState();
  // Las compras son estrictamente privadas. El administrador gestiona ventas
  // desde Centro de administración y nunca usa esta vista como historial propio.
  if(isAdminUser()){
    const c=document.getElementById('purchasesContainer');
    if(c)c.innerHTML='<div class="quick-modal-empty" style="grid-column:1/-1"><div style="font-size:30px">🛡️</div><h3 style="margin:8px 0;color:#fff">Vista de administrador</h3><p>Las compras de clientes se gestionan desde Ventas. Esta sección solo muestra compras del cliente autenticado.</p></div>';
    document.getElementById('purchasesModalBg')?.classList.add('open');
    return;
  }
  document.getElementById('purchasesModalBg')?.classList.add('open');
  await renderPurchasesPage();
}
async function renderPurchasesPage(){
  const c=document.getElementById('purchasesContainer'); if(!c)return;
  if(isAdminUser()){c.innerHTML='<div class="quick-modal-empty" style="grid-column:1/-1">Las compras de clientes no se muestran en la cuenta de administrador.</div>';return}
  c.innerHTML='<div class="quick-modal-empty">Cargando tus compras…</div>';
  let rows=[];
  if(supabaseClient && currentUser){
    try{
      const {data,error}=await supabaseClient.from('nexoplay_orders').select('id,order_code,user_id,items,total,payment_method,payment_status,delivery_status,delivery_email,delivery_password,delivery_profile,delivery_pin,purchase_date,expiry_date,delivered_at,created_at,updated_at').eq('user_id',currentUser.id).order('created_at',{ascending:false}).limit(50);
      if(!error) rows=(data||[]).map(normalizeSaleRow).filter(r=>String(r.user_id||'')===String(currentUser.id));
    }catch(_){ }
  }
  if(!rows.length) rows=getLocalOrdersForCurrentUser().slice().reverse().filter(o=>String(o.ownerUserId||'')===String(currentUser.id)).map(o=>normalizeSaleRow({id:o.id,order_id:o.id,user_id:o.ownerUserId,items:o.items,total:o.total,payment_method:o.paymentMethod,status:o.deliveryStatus||'pending',account_email:o.deliveryEmail,account_password:o.deliveryPassword,account_profile:o.deliveryProfile,account_pin:o.deliveryPin,purchase_date:o.date}));
  c.innerHTML=rows.length?rows.map(renderPurchaseCard).join(''):'<div class="quick-modal-empty" style="grid-column:1/-1">Todavía no tienes compras registradas.</div>';
}
function purchaseDaysLeft(expiration){
  if(!expiration)return null;
  const raw=String(expiration);
  const d=/^\d{4}-\d{2}-\d{2}$/.test(raw)?new Date(raw+'T23:59:59'):new Date(raw);
  if(Number.isNaN(d.getTime()))return null;
  return Math.ceil((d-new Date())/86400000);
}
function purchaseDateShort(v){
  if(!v)return '—';
  try{return new Date(v).toLocaleDateString('es-PE',{day:'2-digit',month:'2-digit',year:'numeric'})}catch(_){return String(v)}
}
function renderPurchaseCard(o){
  const delivered=o.status==='delivered' || o.delivery_status==='delivered';
  const title=saleItemsText(o)||'Compra NexoPlay';
  const code=String(o.order_id||o.id||'—');
  const purchase=o.purchase_date||o.created_at;
  const expiration=o.expiration_date;
  const daysLeft=purchaseDaysLeft(expiration);
  const remainingLabel=daysLeft===null?'—':daysLeft<0?'Vencida':daysLeft===0?'Vence hoy':`${daysLeft} día${daysLeft===1?'':'s'}`;
  const remainingClass=daysLeft!==null&&daysLeft<0?'expired':'';
  const copy=(label,value)=>value?`<button class="pc-copy" type="button" onclick="copyDeliveryValue(${JSON.stringify(String(value))})">${label}</button>`:'';
  return `<article class="purchase-card">
    <div class="pc-top">
      <div>
        <div class="pc-title">${escapeHTML(title.split(' · ')[0]||'Compra')}</div>
        <div class="pc-meta"><span>Código: <span class="support-code">${escapeHTML(code)}</span></span><span>Total: <b>${money(o.total||0)}</b></span></div>
      </div>
      <span class="purchase-status ${delivered?'':'pending'}">${delivered?'✓ Entregada':'⏳ En proceso'}</span>
    </div>
    <div class="purchase-summary">
      <div class="purchase-summary-item"><span>Fecha de compra</span><b>${escapeHTML(purchaseDateShort(purchase))}</b></div>
      <div class="purchase-summary-item"><span>Método</span><b>${escapeHTML(o.payment_method||'Wallet')}</b></div>
      <div class="purchase-summary-item"><span>Productos</span><b>${Array.isArray(o.items)?o.items.length:1}</b></div>
    </div>
    ${delivered?`<div class="pc-data">
      <div class="pc-row"><span>Correo</span><span class="pc-value">${escapeHTML(o.account_email||'—')}</span>${copy('Copiar',o.account_email)}</div>
      <div class="pc-row"><span>Contraseña</span><span class="pc-value">${escapeHTML(o.account_password||'—')}</span>${copy('Copiar',o.account_password)}</div>
      <div class="pc-row"><span>Perfil</span><span class="pc-value">${escapeHTML(o.account_profile||'—')}</span>${copy('Copiar',o.account_profile)}</div>
      <div class="pc-row"><span>PIN</span><span class="pc-value">${escapeHTML(o.account_pin||'—')}</span>${copy('Copiar',o.account_pin)}</div>
    </div>
    <div class="purchase-lifecycle">
      <div class="purchase-life"><span>Compra</span><b>${escapeHTML(purchaseDateShort(purchase))}</b></div>
      <div class="purchase-life"><span>Vencimiento</span><b>${escapeHTML(purchaseDateShort(expiration))}</b></div>
      <div class="purchase-life remaining ${remainingClass}"><span>Días restantes</span><b>${escapeHTML(remainingLabel)}</b></div>
    </div>`:`<div class="customer-delivery pending"><p>Tu compra está registrada. La entrega aparecerá aquí cuando esté preparada.</p></div>`}
    <div class="pc-actions"><button class="order-view-btn purchase-help" onclick="openSupportForOrder('${escapeHTML(code)}')">🆘 Necesito ayuda con esta compra</button></div>
  </article>`;
}
function openTutorial(){document.getElementById('tutorialBg').classList.add('open')}function closeTutorial(){document.getElementById('tutorialBg').classList.remove('open')}function tutorialOutside(e){if(e.target.id==='tutorialBg')closeTutorial()}
let reviews=JSON.parse(localStorage.getItem('nexoplay_reviews')||'[]');function renderStars(r){return '★'.repeat(r)+'☆'.repeat(5-r)}
let authMode='login';
let currentUser=null;try{Object.defineProperty(window,'currentUser',{configurable:true,get:()=>currentUser,set:v=>{currentUser=v}})}catch(_){}

function setAuthMode(mode){
  authMode=mode;
  document.getElementById('loginForm').style.display=mode==='login'?'grid':'none';
  document.getElementById('registerForm').style.display=mode==='register'?'grid':'none';
  document.getElementById('profileView').style.display='none';
  document.getElementById('loginTab').classList.toggle('active',mode==='login');
  document.getElementById('registerTab').classList.toggle('active',mode==='register');
  document.getElementById('authTitle').textContent=mode==='login'?'👤 Iniciar sesión':'👤 Crear cuenta';
  setAuthMessage('');
}

function openProfile(){
  document.getElementById('authBg').classList.add('open');
  if(currentUser){showProfileView();}else{setAuthMode('login');}
}
function closeAccountSuccess(){document.getElementById('accountSuccessBg').classList.remove('open');showProfileView()}
function accountSuccessOutside(e){if(e.target.id==='accountSuccessBg')closeAccountSuccess()}
function contactRecovery(type){
  const email=document.getElementById('loginEmail').value.trim().toLowerCase();
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    setAuthMessage('Primero escribe tu correo electrónico en el campo de arriba para poder identificarte.','warning');
    document.getElementById('loginEmail').focus();
    return;
  }
  if(WHATSAPP_NUMBER==='TU_NUMERO_WHATSAPP'){setAuthMessage('Configura tu número de WhatsApp en el código.','error');return}
  const reason=type==='usuario'?'Olvidé mi nombre de usuario.':'Olvidé mi contraseña.';
  const msg=`*Hola NexoPlay 👋*%0A%0AQuiero solicitar ayuda para recuperar el acceso a mi cuenta.%0A%0A📧 *Me identifico con mi correo:* ${encodeURIComponent(email)}%0A📝 *Solicitud:* ${encodeURIComponent(reason)}%0A%0AQuedo atento(a) a su ayuda. ¡Gracias!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,'_blank');
}
function closeAuth(){document.getElementById('authBg').classList.remove('open')}
function authOutside(e){if(e.target.id==='authBg')closeAuth()}
function toggleSideMenu(e){if(e)e.stopPropagation();document.getElementById('sideMenu').classList.toggle('open')}
function closeSideMenu(){document.getElementById('sideMenu').classList.remove('open')}
document.addEventListener('click',e=>{if(!e.target.closest('.menu-wrap'))closeSideMenu()});

function setAuthMessage(text,type='error'){
  const el=document.getElementById('authMessage');
  el.textContent=text||'';
  el.className='auth-message'+(text?' show ':' ')+(type==='success'?'success':type==='warning'?'warning':'');
}
function authErrorMessage(err){
  const m=String(err?.message||err||'Error desconocido');
  const low=m.toLowerCase();
  if(low.includes('user already registered'))return 'Este correo ya está registrado. Intenta iniciar sesión.';
  if(low.includes('email address not authorized') || low.includes('email_address_not_authorized'))return 'Supabase no está autorizado para enviar correos a esta dirección con el proveedor de correo actual. No es un problema de tu correo.';
  if(low.includes('rate limit') || low.includes('too many requests') || low.includes('over_email_send_rate_limit') || low.includes('429'))return 'Supabase alcanzó el límite temporal de correos de prueba. Espera antes de volver a intentarlo o configuraremos un SMTP propio.';
  if(low.includes('email address is invalid') || low.includes('email_address_invalid') || low.includes('invalid email'))return 'El formato del correo electrónico no es válido.';
  if(low.includes('invalid login credentials'))return 'Correo o contraseña incorrectos.';
  if(low.includes('password'))return 'La contraseña debe cumplir los requisitos de Supabase.';
  return 'Supabase rechazó el registro: '+m;
}
function showAuthError(err){setAuthMessage(authErrorMessage(err),'error'); console.error('Supabase Auth error:',err);}

let pendingVerification={email:'',userId:'',password:''};
let otpExpiresAt=0;
let otpTimerInterval=null;

function openEmailCode(email,userId,password){
  pendingVerification={email,userId,password};
  document.getElementById('codeEmailAddress').textContent=email;
  document.getElementById('emailCodeInput').value='';
  setOtpMessage('');
  document.getElementById('emailCodeBg').classList.add('open');
  startOtpTimer();
  setTimeout(()=>document.getElementById('emailCodeInput').focus(),120);
}
function setOtpMessage(text,type='error'){const el=document.getElementById('otpMessage');if(!el)return;el.textContent=text||'';el.className='auth-message'+(text?' show ':' ')+(type==='success'?'success':type==='warning'?'warning':'')}
function closeEmailCode(){document.getElementById('emailCodeBg').classList.remove('open');if(otpTimerInterval){clearInterval(otpTimerInterval);otpTimerInterval=null}setOtpMessage('')}
function emailCodeOutside(e){if(e.target.id==='emailCodeBg')closeEmailCode()}
function startOtpTimer(){
  if(otpTimerInterval)clearInterval(otpTimerInterval);
  otpExpiresAt=Date.now()+10*60*1000;
  const timer=document.getElementById('otpTimer');
  const btn=document.getElementById('resendCodeBtn');
  btn.disabled=true;
  const tick=()=>{const left=Math.max(0,otpExpiresAt-Date.now());const sec=Math.ceil(left/1000);timer.textContent=left?'Código válido durante '+String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0'):'El código expiró. Puedes solicitar uno nuevo.';if(!left){clearInterval(otpTimerInterval);otpTimerInterval=null;btn.disabled=false}};
  tick();otpTimerInterval=setInterval(tick,1000);
}
async function callEmailCode(action,payload){
  if(!supabaseClient)throw new Error('No se pudo conectar con Supabase.');
  const {data,error}=await supabaseClient.functions.invoke('nexoplay-email-code',{body:{action,...payload}});
  if(error){
    let message=error?.message||'No se pudo conectar con el servicio de correo.';
    try{const ctx=error?.context;if(ctx?.json){const body=await ctx.json();message=body?.message||body?.error||message}}catch(_){}
    throw new Error(message);
  }
  const accepted=data?.ok===true || data?.success===true || data?.sent===true;
  const explicitlyFailed=data?.ok===false || data?.success===false || data?.sent===false;
  if(explicitlyFailed && !accepted)throw new Error(data?.message||data?.error||'No se pudo procesar el código.');
  return data||{ok:true};
}
async function hashPurchasePin(pin){
  const bytes=new TextEncoder().encode(String(pin));
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function verifyPurchasePin(pin){
  if(!/^\d{4}$/.test(String(pin||'')))return false;
  const stored=currentUser?.user_metadata?.purchase_pin_hash;
  if(!stored)return false;
  return (await hashPurchasePin(pin))===String(stored);
}
function requestPurchasePin(){
  return new Promise(resolve=>{
    let bg=document.getElementById('purchasePinConfirmBg');
    if(!bg){
      bg=document.createElement('div');bg.id='purchasePinConfirmBg';bg.className='tutorial-bg';bg.style.zIndex='9999';
      bg.onclick=e=>{if(e.target===bg){bg.remove();resolve(null)}};
      document.body.appendChild(bg);
    }
    // IMPORTANTE: tutorial-bg viene oculto por defecto (display:none).
    // Abrimos explícitamente la capa para que el PIN sea visible y no quede
    // el botón de Wallet bloqueado en “Procesando Wallet…”.
    bg.classList.add('open');
    bg.style.display='flex';
    bg.innerHTML='<div class="auth-modal" onclick="event.stopPropagation()"><div class="tutorial-modal-head"><div><h2>🔐 Confirmar compra</h2><p style="margin:4px 0 0;color:#858b99;font-size:9px">Ingresa tu PIN de compra de 4 dígitos.</p></div><button class="close" type="button">×</button></div><div class="quick-modal-body"><label class="auth-label">PIN de compra</label><input id="purchasePinConfirmInput" class="auth-input pin-input" inputmode="numeric" maxlength="4" autocomplete="one-time-code" placeholder="••••"><div id="purchasePinConfirmMsg" class="auth-message"></div><div class="support-actions" style="margin-top:12px;justify-content:flex-end"><button id="purchasePinCancel">Cancelar</button><button id="purchasePinConfirm" class="admin-btn primary">Confirmar compra</button></div></div></div>';
    const finish=value=>{bg.remove();resolve(value)};
    bg.querySelector('.close').onclick=()=>finish(null);bg.querySelector('#purchasePinCancel').onclick=()=>finish(null);
    bg.querySelector('#purchasePinConfirm').onclick=async()=>{const input=bg.querySelector('#purchasePinConfirmInput');const msg=bg.querySelector('#purchasePinConfirmMsg');const pin=input?.value.trim()||'';if(!/^\d{4}$/.test(pin)){msg.textContent='Ingresa exactamente 4 dígitos.';msg.className='auth-message show warning';return}if(!(await verifyPurchasePin(pin))){msg.textContent='PIN incorrecto. Inténtalo nuevamente.';msg.className='auth-message show error';input.select();return}finish(pin)};
    const input=bg.querySelector('#purchasePinConfirmInput');input.oninput=()=>{input.value=input.value.replace(/\D/g,'').slice(0,4)};setTimeout(()=>input.focus(),80);
  });
}

function togglePassword(id,btn){
  const input=document.getElementById(id);
  if(!input)return;
  const visible=input.type==='text';
  input.type=visible?'password':'text';
  if(btn)btn.textContent=visible?'Mostrar':'Ocultar';
}
async function registerUser(){
  if(!supabaseClient){setAuthMessage('No se pudo conectar con Supabase. Revisa la configuración.','error');return}
  const username=document.getElementById('registerUsername').value.trim();
  const email=document.getElementById('registerEmail').value.trim().toLowerCase();
  const phone=document.getElementById('registerPhone').value.trim();
  const password=document.getElementById('registerPassword').value;
  const password2=document.getElementById('registerPassword2').value;
  const purchasePin=document.getElementById('registerPurchasePin')?.value.trim()||'';
  setAuthMessage('');
  if(username.length<3){setAuthMessage('El nombre de usuario debe tener al menos 3 caracteres.');return}
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setAuthMessage('Escribe un correo electrónico válido, por ejemplo nombre@gmail.com.');return}
  if(!phone){setAuthMessage('Escribe tu número de teléfono.');return}
  if(password.length<6){setAuthMessage('La contraseña debe tener al menos 6 caracteres.');return}
  if(password!==password2){setAuthMessage('Las contraseñas no coinciden.');return}
  if(!/^\d{4}$/.test(purchasePin)){setAuthMessage('Tu PIN de compra debe tener exactamente 4 dígitos.');return}
  const purchasePinHash=await hashPurchasePin(purchasePin);
  const {data,error}=await supabaseClient.auth.signUp({email,password,options:{data:{username,phone,nexoplay_email_verified:false,purchase_pin_pending:false,purchase_pin_hash:purchasePinHash}}});
  if(error){showAuthError(error);return}
  if(!data?.user){setAuthMessage('No se pudo crear la cuenta. Intenta nuevamente.');return}
  currentUser=data.user;
  try{
    await callEmailCode('send',{user_id:data.user.id,email});
    currentUser=null;
    closeAuth();
    openEmailCode(email,data.user.id,password);
    // Revoca la sesión creada por signUp en segundo plano; el modal de verificación
    // no debe quedar esperando una segunda petición de red.
    void supabaseClient.auth.signOut().catch(err=>console.warn('NexoPlay signOut after register:',err));
  }catch(err){
    console.error('NexoPlay code send error:',err);
    setAuthMessage('La cuenta se creó, pero no pudimos enviar el código. Verifica la configuración de Resend e inténtalo de nuevo.','warning');
    currentUser=null;
    void supabaseClient.auth.signOut().catch(err=>console.warn('NexoPlay signOut after register error:',err));
  }
}
async function verifyEmailCode(){
  const code=document.getElementById('emailCodeInput').value.trim();
  if(!/^\d{6}$/.test(code)){setOtpMessage('Escribe el código de 6 dígitos.','warning');return}
  const verifyBtn=document.querySelector('#emailCodeBg .email-confirm-btn');
  if(verifyBtn){verifyBtn.disabled=true;verifyBtn.classList.add('loading');verifyBtn.textContent='Verificando...'}
  try{
    await callEmailCode('verify',{user_id:pendingVerification.userId,email:pendingVerification.email,code});

    // El código fue validado por nuestra Edge Function.
    // Recuperamos la sesión con la contraseña original y guardamos
    // una marca persistente para que el usuario NO tenga que volver
    // a introducir el código al iniciar sesión.
    const {data:loginData,error:loginError}=await supabaseClient.auth.signInWithPassword({
      email:pendingVerification.email,
      password:pendingVerification.password
    });
    if(loginError)throw loginError;

    const {data:updated,error:updateError}=await supabaseClient.auth.updateUser({
      data:{nexoplay_email_verified:true}
    });
    if(updateError)throw updateError;

    const {data:sessionData,error:sessionError}=await supabaseClient.auth.refreshSession();
    if(sessionError)throw sessionError;

    currentUser=sessionData?.session?.user||updated?.user||null;
    if(!currentUser)throw new Error('No se pudo recuperar la sesión después de verificar el correo.');

    closeEmailCode();
    pendingVerification={email:'',userId:'',password:''};
    document.getElementById('accountSuccessBg').classList.add('open');
  }catch(err){
    const msg=String(err?.message||err||'Error desconocido');
    const low=msg.toLowerCase();
    setOtpMessage(
      low.includes('incorrect')||low.includes('inválid')||low.includes('invalid')||low.includes('expir')||low.includes('not found')
        ?'El código es incorrecto o ya expiró. Solicita uno nuevo.'
        :'No pudimos verificar el código. Inténtalo nuevamente.',
      'error'
    );
    console.error('NexoPlay code verify error:',err);
  }finally{
    if(verifyBtn){verifyBtn.disabled=false;verifyBtn.classList.remove('loading');verifyBtn.textContent='Verificar código'}
  }
}
async function resendEmailCode(){
  if(!pendingVerification.email||!pendingVerification.userId)return;
  const btn=document.getElementById('resendCodeBtn');btn.disabled=true;
  try{await callEmailCode('send',{user_id:pendingVerification.userId,email:pendingVerification.email});startOtpTimer();setOtpMessage('Te enviamos un nuevo código a tu correo.','success')}catch(err){btn.disabled=false;setOtpMessage('No pudimos reenviar el código. Inténtalo nuevamente.','error');console.error(err)}
}
async function loginUser(){
  if(!supabaseClient){setAuthMessage('No se pudo conectar con Supabase. Revisa la configuración.','error');return}
  const email=document.getElementById('loginEmail').value.trim().toLowerCase();
  const password=document.getElementById('loginPassword').value;
  setAuthMessage('');
  if(!email||!password){setAuthMessage('Completa tu correo y contraseña.');return}
  const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error){showAuthError(error);return}
  const emailVerified =
    data.user?.email_confirmed_at ||
    data.user?.app_metadata?.nexoplay_email_verified===true ||
    data.user?.user_metadata?.nexoplay_email_verified===true;

  if(!emailVerified){
    currentUser=null;
    await supabaseClient.auth.signOut();
    setAuthMessage('Tu correo todavía no está verificado. Solicita un nuevo código para activar tu cuenta.','warning');
    pendingVerification={email,userId:data.user.id,password};
    try{
      await callEmailCode('send',{user_id:data.user.id,email});
      closeAuth();
      openEmailCode(email,data.user.id,password);
    }catch(err){
      console.error('NexoPlay login verification send error:',err);
      setAuthMessage('No pudimos reenviar el código. '+(err?.message||'Inténtalo nuevamente.'),'error');
    }
    return;
  }
  currentUser=data.user;
  // La sesión ya está autenticada; no bloqueamos la interfaz esperando el perfil.
  showToast('¡Bienvenido a NexoPlay!');
  showProfileView();
}
async function loadCurrentProfile(){
  if(!currentUser||!supabaseClient)return null;
  const {data,error}=await supabaseClient.from('profiles').select('username,phone').eq('id',currentUser.id).maybeSingle();
  if(error){console.error('NexoPlay profile error:',error);return null}
  return data;
}

async function showProfileView(){
  if(!currentUser)return;
  const userSnapshot=currentUser;
  const fallbackProfile={username:currentUser.user_metadata?.username||'usuario',phone:currentUser.user_metadata?.phone||''};
  const orders=getLocalOrdersForCurrentUser();
  const purchases=orders.reduce((sum,o)=>sum+(Array.isArray(o.items)?o.items.length:0),0);
  const spent=orders.reduce((sum,o)=>sum+Number(o.total||0),0);
  const joined=currentUser.created_at?new Date(currentUser.created_at).toLocaleDateString('es-PE',{day:'2-digit',month:'2-digit',year:'numeric'}):'—';
  let profileCache=fallbackProfile;
  const renderProfile=(profile)=>{
    if(!currentUser||currentUser.id!==userSnapshot.id)return;
    if(profile)profileCache=profile;
    const p=profileCache||fallbackProfile;
    document.getElementById('authTabs').style.display='none';
    document.getElementById('loginForm').style.display='none';
    document.getElementById('registerForm').style.display='none';
    document.getElementById('profileView').style.display='block';
    document.getElementById('authTitle').textContent='👤 Mi perfil';
    const username=p?.username||fallbackProfile.username||'usuario';
    document.getElementById('profileUsername').textContent='@'+username;
    document.getElementById('profileEmailSmall').textContent='Correo: '+(userSnapshot.email||'—');
    document.getElementById('profilePurchases').textContent=String(purchases);
    document.getElementById('profileOrdersCount').textContent=String(orders.length);
    document.getElementById('profileSpent').textContent='S/ '+spent.toFixed(2);
    document.getElementById('profileBalance').textContent=walletCache?money(walletCache.balance):'S/ 0.00';
    document.getElementById('profileDetails').innerHTML=`📧 Correo: ${escapeHTML(userSnapshot.email||'—')}<br>📱 Teléfono: ${escapeHTML(p?.phone||fallbackProfile.phone||'—')}<br>📅 Miembro desde: ${joined}`;
    document.getElementById('profileVerified').textContent='● Cuenta activa';
    document.getElementById('profileVerified').style.background='#12251a';
    document.getElementById('profileVerified').style.color='#86efac';
    setAuthMessage('');
    updateMenuUser(p);
  };
  // Renderiza el perfil inmediatamente con los datos de la sesión. Las consultas
  // secundarias quedan en segundo plano para no hacer esperar al usuario.
  renderProfile(fallbackProfile);
  void loadCurrentProfile().then(profile=>renderProfile(profile||fallbackProfile)).catch(()=>{});
  void loadWalletData().then(()=>renderProfile(profileCache)).catch(()=>{});
}
function updateMenuUser(profile){
  const c=document.getElementById('menuUser');
  if(!c)return;
  if(currentUser){
    const username=profile?.username||currentUser.user_metadata?.username||'usuario';
    c.innerHTML=`<strong>👤 @${escapeHTML(username)}</strong><span>${escapeHTML(currentUser.email||'')}</span>`;
  }else{c.innerHTML='<strong>👤 Invitado</strong><span>Inicia sesión para usar tu perfil.</span>'}
}

async function logoutUser(){
  const previousUser=currentUser;
  currentUser=null;
  adminState=false;
  walletCache=null;
  updateMenuUser(null);updateAdminMenu();
  closeAuth();
  showToast('Sesión cerrada');
  // Cierra la sesión de Supabase en segundo plano para que la interfaz no quede
  // bloqueada esperando la respuesta de red.
  if(supabaseClient){
    try{await supabaseClient.auth.signOut()}catch(err){
      console.warn('NexoPlay signOut:',err);
      if(previousUser){currentUser=previousUser;updateMenuUser(null);updateAdminMenu()}
    }
  }
}

async function initAuth(){
  if(!supabaseClient){updateMenuUser(null);return}
  const {data}=await supabaseClient.auth.getSession();
  currentUser=data?.session?.user||null;
  const sessionUserId=currentUser?.id||null;
  // La sesión se refleja de inmediato. Perfil, rol y sincronización se resuelven
  // después para que el inicio de sesión no quede esperando varias consultas.
  updateMenuUser(currentUser?{username:currentUser.user_metadata?.username||'usuario'}:null);
  syncProfileAvatar(currentUser);
  updateAdminMenu();
  renderOrders();renderOrdersModal();
  if(currentUser){
    void loadCurrentProfile().then(profile=>{if(currentUser?.id===sessionUserId)updateMenuUser(profile)}).catch(()=>{});
    void refreshAdminState().catch(()=>{});
    setTimeout(()=>{if(currentUser?.id===sessionUserId){syncUnsyncedLocalOrders();renderOrders();renderOrdersModal()}},250);
  }
  supabaseClient.auth.onAuthStateChange((_event,session)=>{
    currentUser=session?.user||null;
    const userId=currentUser?.id||null;
    updateMenuUser(currentUser?{username:currentUser.user_metadata?.username||'usuario'}:null);
    syncProfileAvatar(currentUser);
    updateAdminMenu();
    renderOrders();renderOrdersModal();
    if(userId){
      setTimeout(()=>{
        if(currentUser?.id!==userId)return;
        void loadCurrentProfile().then(profile=>{if(currentUser?.id===userId)updateMenuUser(profile)}).catch(()=>{});
        void refreshAdminState().catch(()=>{});
        void syncUnsyncedLocalOrders().catch(()=>{});
      },0);
    }
    if(document.getElementById('ordersModalBg')?.classList.contains('open'))loadCustomerSales();
  });
}

function renderReviews(){const c=document.getElementById('reviewsContainer'),s=document.getElementById('reviewSummary');if(!reviews.length){s.innerHTML='<div><div class="review-average">—</div></div><div><div class="review-stars">★★★★★</div><div class="review-count">Sé el primero en dejar una reseña.</div></div>';c.innerHTML='<div class="review-empty">Todavía no hay reseñas.</div>';return}const avg=(reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1);s.innerHTML=`<div><div class="review-average">${avg}</div></div><div><div class="review-stars">${renderStars(Math.round(avg))}</div><div class="review-count">${reviews.length} reseña${reviews.length===1?'':'s'}</div></div>`;c.innerHTML=reviews.slice().reverse().map(r=>`<div class="review-card"><div class="review-card-head"><span class="review-name">${escapeHTML(r.name)}</span><span class="review-date">${escapeHTML(r.date)}</span></div><div class="review-stars">${renderStars(r.rating)}</div><p>${escapeHTML(r.text)}</p></div>`).join('')}
function submitReview(e){e.preventDefault();const name=document.getElementById('reviewName').value.trim(),rating=Number(document.querySelector('input[name="rating"]:checked')?.value),text=document.getElementById('reviewText').value.trim();if(!name||!rating||!text)return;reviews.push({name,rating,text,date:new Date().toLocaleDateString('es-PE',{day:'2-digit',month:'2-digit',year:'numeric'})});localStorage.setItem('nexoplay_reviews',JSON.stringify(reviews));e.target.reset();renderReviews();showToast('¡Gracias por tu reseña!')}
/* ===== WALLET FRONTEND ===== */
let walletCache=null;try{Object.defineProperty(window,'walletCache',{configurable:true,get:()=>walletCache,set:v=>{walletCache=v}})}catch(_){}
function money(v){return 'S/ '+Number(v||0).toFixed(2)}
function openWallet(){document.getElementById('walletModalBg').classList.add('open');if(currentUser){document.getElementById('walletLoginNotice').style.display='none';loadWalletData()}else{document.getElementById('walletLoginNotice').style.display='block';renderWalletEmpty('Inicia sesión para consultar tu Wallet.')}}
function closeWallet(){document.getElementById('walletModalBg').classList.remove('open')}
function walletOutside(e){if(e.target.id==='walletModalBg')closeWallet()}
function focusWalletTopup(){if(!currentUser){showToast('Inicia sesión para usar Wallet.');openProfile();return}document.getElementById('walletTopupPanel')?.scrollIntoView({behavior:'smooth',block:'start'})}
function setWalletAmount(n){document.getElementById('walletTopupAmount').value=n}
function renderWalletEmpty(msg){document.getElementById('walletBalance').textContent='S/ 0.00';document.getElementById('walletTopups').textContent='S/ 0.00';document.getElementById('walletSpent').textContent='S/ 0.00';document.getElementById('walletMovements').textContent='0';document.getElementById('walletUpdated').textContent='—';document.getElementById('walletTransactions').innerHTML='<div class="wallet-empty">'+escapeHTML(msg)+'</div>';updateWalletMotivation(0)}
function updateWalletMotivation(topups){const pts=Math.max(0,Math.floor(Number(topups||0)));let level='Nivel Inicial',next=50; if(pts>=500){level='💎 Nexo Elite';next=1000}else if(pts>=250){level='👑 Nexo Premium';next=500}else if(pts>=100){level='⭐ Nexo Plus';next=250}else if(pts>=50){level='🔥 Nexo Activo';next=100};const base=next===1000?500:next===500?250:next===250?100:next===100?50:0;const pct=next>base?Math.min(100,Math.max(0,(pts-base)/(next-base)*100)):100;document.getElementById('walletLevelName').textContent=level;document.getElementById('walletPoints').textContent=pts+' pts';document.getElementById('walletProgressBar').style.width=pct+'%';document.getElementById('walletProgressText').textContent=pts>=500?'¡Has alcanzado uno de los niveles más altos!':`Te faltan ${Math.max(0,next-pts)} pts para el siguiente nivel.`}
async function loadWalletData(){
  if(!currentUser||!supabaseClient){renderWalletEmpty('Inicia sesión para consultar tu Wallet.');return}
  try{
    // Asegura que exista la fila y luego lee el registro real de Wallet.
    const {error:ensureError}=await supabaseClient.rpc('ensure_my_wallet');
    if(ensureError)throw ensureError;

    const {data:w,error}=await supabaseClient
  .from('wallets')
  .select('user_id,balance,total_topups,created_at,updated_at')
  .eq('user_id',currentUser.id)
  .maybeSingle();
    if(error)throw error;

    walletCache=w||{balance:0,total_topups:0,total_spent:0,updated_at:null};
    document.getElementById('walletBalance').textContent=money(walletCache.balance);
    document.getElementById('walletTopups').textContent=money(walletCache.total_topups);
    document.getElementById('walletSpent').textContent=money(0);
    document.getElementById('walletUpdated').textContent=walletCache.updated_at
      ?'Actualizado '+new Date(walletCache.updated_at).toLocaleString('es-PE')
      :'Saldo listo';
    updateWalletMotivation(walletCache.total_topups);

    const tx=await supabaseClient
      .from('wallet_transactions')
      .select('id,type,amount,balance_after,description,created_at')
      .eq('user_id',currentUser.id)
      .order('created_at',{ascending:false})
      .limit(30);
    if(tx.error)throw tx.error;
    const walletSpent=(tx.data||[]).filter(t=>Number(t.amount)<0).reduce((sum,t)=>sum+Math.abs(Number(t.amount)),0);
    document.getElementById('walletSpent').textContent=money(walletSpent);
    updateCheckoutWalletBalance();

    document.getElementById('walletMovements').textContent=String((tx.data||[]).length);
    document.getElementById('walletTransactions').innerHTML=(tx.data||[]).length
      ?(tx.data||[]).map(t=>{
        const positive=Number(t.amount)>=0;
        return `<div class="wallet-tx"><div class="wallet-tx-main"><strong>${escapeHTML(t.description||t.type||'Movimiento')}</strong><span>${new Date(t.created_at).toLocaleString('es-PE')} · Saldo ${money(t.balance_after)}</span></div><div class="${positive?'wallet-plus':'wallet-minus'}">${positive?'+':'−'}${money(Math.abs(Number(t.amount))).replace('S/ ','S/ ')}</div></div>`
      }).join('')
      :'<div class="wallet-empty">Todavía no tienes movimientos.</div>';
  }catch(err){
    console.error('NexoPlay Wallet:',err);
    document.getElementById('walletUpdated').textContent='No se pudo actualizar';
    document.getElementById('walletTransactions').innerHTML='<div class="wallet-empty">No se pudo consultar el Wallet. Revisa la conexión con Supabase.</div>';
    showToast('No se pudo actualizar el Wallet');
  }
}
function topupCouponText(amount){
  const n=Number(amount||0);
  if(n>=30)return '🎁 Por esta recarga recibirás un cupón de <strong>25% de descuento</strong>.';
  if(n>=20)return '🎁 Por esta recarga recibirás un cupón de <strong>15% de descuento</strong>.';
  return '💡 Recargas desde S/ 20 generan un cupón: <strong>15%</strong> de S/ 20 a S/ 29.99 y <strong>25%</strong> desde S/ 30.';
}
function updateTopupCoupon(){const el=document.getElementById('walletCouponInfo');if(el)el.innerHTML=topupCouponText(document.getElementById('walletTopupAmount')?.value)}
async function requestWalletTopup(){
  if(!currentUser){showToast('Inicia sesión para solicitar una recarga.');openProfile();return}
  const amount=Number(document.getElementById('walletTopupAmount')?.value);
  const method=document.getElementById('walletTopupMethod')?.value||'Yape';
  if(!Number.isFinite(amount)||amount<1||amount>1000){showToast('Ingresa un monto entre S/ 1 y S/ 1000.');return}
  walletWhatsApp(amount,method);
  showToast('Solicitud preparada. Envía el comprobante por WhatsApp.');
}
function walletWhatsApp(amount,method){
  if(WHATSAPP_NUMBER==='TU_NUMERO_WHATSAPP'){showToast('Configura tu WhatsApp.');return}
  const email=currentUser?.email||'cliente';
  const username=currentUser?.user_metadata?.username||currentUser?.user_metadata?.name||email.split('@')[0]||'cliente';
  const a=amount?`%0A💰 *Monto:* S/ ${Number(amount).toFixed(2)}%0A💳 *Método de pago:* ${encodeURIComponent(method||'Yape/Plin')}`:'';
  const msg=`*Hola NexoPlay 👋*%0AQuiero solicitar una recarga de mi Wallet.%0A👤 *Usuario:* ${encodeURIComponent(username)}%0A📧 *Correo:* ${encodeURIComponent(email)}${a}%0A%0A📎 *En breve envío mi comprobante realizado por este medio.*%0A%0AGracias. 🙌`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,'_blank');
}
let adminState=false;
async function refreshAdminState(){
  adminState=false;
  if(!currentUser||!supabaseClient){updateAdminMenu();return false}
  try{
    const {data,error}=await supabaseClient.rpc('is_admin');
    if(!error)adminState=data===true || (Array.isArray(data)&&data[0]===true);
  }catch(err){console.warn('NexoPlay admin check:',err)}
  updateAdminMenu();
  return adminState;
}
function isAdminUser(){return adminState===true}
function updateAdminMenu(){const b=document.getElementById('adminMenuBtn');if(b)b.style.display=isAdminUser()?'block':'none'}
async function openAdminPanel(){
  if(!(await refreshAdminState())){showToast('Acceso de administrador no autorizado.');return}
  const bg=document.getElementById('adminPanelBg');if(!bg)return;bg.style.display='flex';
  switchAdminTab('overview');
  loadAdminSales().catch(()=>{});
  loadCategories().catch(()=>{});
}
function closeAdminPanel(){const bg=document.getElementById('adminPanelBg');if(bg)bg.style.display='none'}
async function loadAdminClients(){
  const c=document.getElementById('adminClients');if(!c||!supabaseClient)return;
  if(!(await refreshAdminState())){c.innerHTML='<div class="admin-note">No tienes permisos de administrador.</div>';return}
  c.innerHTML='<div class="wallet-empty">Cargando clientes…</div>';
  try{
    const {data,error}=await supabaseClient.rpc('admin_list_wallet_clients');
    if(error)throw error;
    const clients=Array.isArray(data)?data:[];
    const rows=clients.map(u=>{
      const id=escapeHTML(u.user_id||u.id||'');
      const rawId=String(u.user_id||u.id||'');
      const currentBalance=Number(u.balance||0);
      return `<tr><td><strong>@${escapeHTML(u.username||'sin_usuario')}</strong><div class="admin-email">${escapeHTML(u.email||'—')}</div></td><td>${escapeHTML(u.phone||'—')}</td><td><input class="admin-balance" id="adminBal_${rawId}" data-current-balance="${currentBalance.toFixed(2)}" type="number" min="0" step="0.01" value="${currentBalance.toFixed(2)}"></td><td><button class="admin-save" onclick="saveAdminBalance('${rawId}')">Guardar</button></td></tr>`;
    }).join('');
    c.innerHTML=rows?`<div class="admin-scroll"><table class="admin-table"><thead><tr><th>Cliente</th><th>Teléfono</th><th>Saldo disponible</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="wallet-empty">No hay clientes registrados.</div>';
  }catch(err){console.error('NexoPlay admin:',err);c.innerHTML='<div class="admin-note">No se pudo cargar la tabla de clientes. Ejecuta el SQL de administración que acompaña este archivo y verifica que tu cuenta esté marcada como admin.</div>';}
}
async function saveAdminBalance(userId){
  if(!(await refreshAdminState())){showToast('No autorizado.');return}
  const input=document.getElementById('adminBal_'+userId);
  const balance=Number(input?.value);
  if(!Number.isFinite(balance)||balance<0){showToast('Saldo no válido.');return}

  let data=null,error=null;

  const currentBalance = Number(input?.dataset.currentBalance || 0);
const amount = Number((balance - currentBalance).toFixed(2));

if (amount === 0) {
  showToast('El saldo ya tiene ese valor.');
  return;
}

const result = await supabaseClient.rpc('admin_wallet_adjust_v2', {
  p_user_id: userId,
  p_amount: amount,
  p_type: 'adjustment',
  p_description: 'Ajuste manual de saldo desde panel administrador'
});

data = result.data;
error = result.error;

if (error) {
  console.error('NexoPlay admin balance:', error);
  showToast(error.message || 'No se pudo actualizar el saldo.');
  return;
}

  const row=Array.isArray(data)?data[0]:data;
  const finalBalance=Number(row?.balance??balance);
  showToast(`Saldo actualizado: ${money(finalBalance)}`);
  await loadAdminClients();

  // Si el administrador está modificando su propia cuenta, refrescar también su Wallet.
  if(currentUser?.id===userId)await loadWalletData();
}



/* ===== VENTAS PENDIENTES / ENTREGA DE CUENTAS =====
   Módulo aislado: no reemplaza Wallet, catálogo, favoritos, stock ni autenticación. */
let adminSalesCache=[];
let adminSalesTab='wallet';

function saleStatusLabel(status){return status==='delivered'?'Entregada':'Pendiente de entrega'}
function parseSaleItems(value){
  if(Array.isArray(value))return value;
  if(value&&typeof value==='object'){
    if(Array.isArray(value.items))return value.items;
    if(Array.isArray(value.productos))return value.productos;
    if(Array.isArray(value.detalle))return value.detalle;
    return [value];
  }
  if(typeof value==='string'){
    try{const parsed=JSON.parse(value);if(Array.isArray(parsed))return parsed;if(parsed&&typeof parsed==='object')return parseSaleItems(parsed)}catch(_){}
    return value.trim()?[{name:value.trim()}]:[];
  }
  return [];
}
function saleItemsText(o){
  const items=parseSaleItems(o?.items??o?.productos??o?.detalle??o?.p_items??o?.p_productos??[]);
  if(items.length)return items.map(x=>`${x.name||x.producto||x.platform||'Producto'} — ${x.plan||x.modalidad||''} — ${money(x.price??x.precio??x.monto??0)}`).join(' · ');
  return String(o?.items_text||o?.items_description||o?.detalle_texto||'').trim();
}
function saleDate(v){if(!v)return '—';try{return new Date(v).toLocaleString('es-PE')}catch(_){return String(v)}}

/* ===== SINCRONIZACIÓN REAL DE VENTAS =====
   El pago con Wallet sigue exactamente igual. Después de registrar el pago
   localmente, este módulo crea la venta en Supabase sin volver a cobrar.
   Si la red falla, el pedido queda guardado y se reintenta al abrir Mis pedidos.
*/
async function nexoplayRpcFallback(candidates){
  let lastError=null;
  for(const c of candidates){
    try{
      const {data,error}=await supabaseClient.rpc(c.name,c.params||{});
      if(!error)return {ok:true,data,name:c.name};
      lastError=error;
    }catch(err){lastError=err}
  }
  return {ok:false,error:lastError};
}
function normalizeSaleRow(s){
  if(!s||typeof s!=='object')return s;
  return {
    ...s,
    id:s.id??s.sale_id??s.venta_id,
    order_id:s.order_id??s.order_code??s.codigo_pedido??s.codigo??s.orden_id,
    user_id:s.user_id??s.usuario_id,
    customer_email:s.customer_email??s.user_email??s.email??s.correo??s.correo_usuario,
    customer_username:s.customer_username??s.user_username??s.username??s.usuario??s.nombre_usuario??s.cliente_usuario??s.cliente_nombre,
    items:parseSaleItems(s.items??s.productos??s.detalle??s.p_items??s.p_productos??[]),
    items_text:s.items_text??s.items_description??s.detalle_texto??s.descripcion_productos??s.product_details??'',
    total:Number(s.total??s.monto??s.precio_total??0),
    payment_method:s.payment_method??s.metodo_pago??s.metodo,
    payment_status:s.payment_status??s.estado_pago,
    status:s.status??s.delivery_status??s.estado_entrega??s.estado??'pending',
    account_email:s.account_email??s.delivery_email??s.correo_entrega,
    account_password:s.account_password??s.delivery_password??s.password_entrega,
    account_profile:s.account_profile??s.delivery_profile??s.perfil,
    account_pin:s.account_pin??s.delivery_pin??s.pin,
    purchase_date:s.purchase_date??s.fecha_compra,
    expiration_date:s.expiration_date??s.expiry_date??s.expiryDate??s.fecha_vencimiento,
    delivered_at:s.delivered_at??s.fecha_entrega,
    created_at:s.created_at??s.fecha_creacion
  };
}
async function createRemoteSale(order){
  if(String(order?.paymentMethod||'').toLowerCase()!=='wallet')return {ok:false,skipped:true,reason:'non-wallet'};
  if(!currentUser||!supabaseClient||!order?.id)return {ok:false,skipped:true};
  const items=Array.isArray(order.items)?order.items:[];
  const orderCode=String(order.id);
  const total=Number(order.total||0);
  const subtotal=Number(order.subtotal??total);
  const discount=Number(order.discount||0);
  const paymentMethod=String(order.paymentMethod||'Wallet');
  try{
    // La tabla real de este proyecto es nexoplay_orders. El Index anterior
    // intentaba crear la venta mediante RPCs que no coinciden con las firmas
    // expuestas en Supabase y por eso devolvían 404. Primero usamos la tabla
    // directamente e intentamos una segunda vez solo si ya existe el pedido.
    const existing=await supabaseClient.from('nexoplay_orders').select('id,order_code').eq('user_id',currentUser.id).eq('order_code',orderCode).maybeSingle();
    if(!existing.error && existing.data){return {ok:true,data:existing.data,name:'nexoplay_orders'};}
    const insertPayload={
      order_code:orderCode,user_id:currentUser.id,items,subtotal,discount,total,
      payment_method:paymentMethod,payment_status:'paid',delivery_status:'pending'
    };
    const ins=await supabaseClient.from('nexoplay_orders').insert(insertPayload).select('id,order_code').maybeSingle();
    if(!ins.error)return {ok:true,data:ins.data,name:'nexoplay_orders'};
    // Compatibilidad con instalaciones donde las RPC sí están disponibles.
    const payload={p_order_id:orderCode,p_items:items,p_total:total,p_payment_method:paymentMethod};
    const r=await nexoplayRpcFallback([
      {name:'create_sale_v1',params:payload},
      {name:'crear_venta',params:payload},
      {name:'crear_venta',params:{order_id:orderCode,items,total,payment_method:paymentMethod}},
      {name:'crear_venta',params:{p_orden_id:orderCode,p_items:items,p_total:total,p_metodo_pago:paymentMethod}}
    ]);
    if(!r.ok)throw ins.error||r.error||new Error('No se pudo registrar la venta.');
    return {ok:true,data:r.data,name:r.name};
  }catch(err){console.warn('NexoPlay create sale:',err);return {ok:false,error:err};}
}
async function syncUnsyncedLocalOrders(){
  if(!currentUser||!supabaseClient)return;
  // Solo sincroniza pedidos propiedad del usuario actual.
  // Esto evita que una sesión vea/registre compras hechas por otra cuenta.
  const orders=getLocalOrdersForCurrentUser();
  for(const order of orders.filter(o=>o?.ownerUserId===currentUser.id&&o?.id)){
    try{await createRemoteSale(order)}catch(_){}
  }
}
function renderCustomerSale(s){
  const delivered=s.status==='delivered' && (s.account_email||s.account_password);
  const title=escapeHTML(s.order_id||'Pedido');
  const itemText=escapeHTML(saleItemsText(s));
  // No mostrar estados intermedios ni "Datos en proceso" en Mis pedidos.
  if(!delivered)return '';
  return `<div class="customer-delivery">
    <h4>✅ ${title} · Cuenta lista</h4>
    <p>Tu cuenta ya fue entregada. Pulsa el botón para ver los datos de acceso.</p>
    <div class="delivery-data"><div class="delivery-data-row"><span>Producto</span><span>${itemText||'—'}</span></div><div class="delivery-data-row"><span>Vencimiento</span><span>${escapeHTML(saleDate(s.expiration_date))}</span></div></div>
    <button class="order-view-btn" onclick="openDeliveryModal('${String(s.id)}')">🔐 Ver datos de mi cuenta</button>
  </div>`;
}

async function loadCustomerSales(){
  const c=document.getElementById('customerSalesContainer');if(!c)return;
  if(!currentUser||!supabaseClient){c.innerHTML='<div class="quick-modal-empty">Inicia sesión para consultar el estado de tus entregas.</div>';return}
  c.innerHTML='';
  await syncUnsyncedLocalOrders();
  // Defensa contra registros antiguos/globales: solo se muestran ventas Wallet
  // cuyo código existe en los pedidos Wallet de ESTA cuenta.
  const allowedOrderIds=new Set(getLocalOrdersForCurrentUser().map(o=>String(o.id)));
  try{
    const {data,error}=await supabaseClient.from('nexoplay_orders').select('id,order_code,user_id,items,total,payment_method,payment_status,delivery_status,delivery_email,delivery_password,delivery_profile,delivery_pin,purchase_date,expiry_date,delivered_at,created_at,updated_at').eq('user_id',currentUser.id).eq('payment_method','Wallet').order('created_at',{ascending:false}).limit(30);
    if(error)throw error;
    const sales=(Array.isArray(data)?data:[]).map(normalizeSaleRow).filter(s=>allowedOrderIds.has(String(s.order_id)));
    c.innerHTML=sales.length?sales.map(renderCustomerSale).join(''):'';
    return sales;
  }catch(err){
    console.warn('NexoPlay customer sales table lookup:',err);
    try{
      const r=await nexoplayRpcFallback([
        {name:'obtener_datos_entrega',params:{p_user_id:currentUser.id}},
        {name:'obtener_datos_entrega',params:{user_id:currentUser.id}},
        {name:'obtener_datos_entrega',params:{p_usuario_id:currentUser.id}}
      ]);
      if(!r.ok)throw r.error||err;
      const raw=Array.isArray(r.data)?r.data:(r.data?[r.data]:[]);
      const allowedOrderIds=new Set(getLocalOrdersForCurrentUser().map(o=>String(o.id)));
      const sales=raw.map(normalizeSaleRow).filter(s=>String(s.payment_method||'').toLowerCase()==='wallet' && allowedOrderIds.has(String(s.order_id)));
      c.innerHTML=sales.length?sales.map(renderCustomerSale).join(''):'';
      return sales;
    }catch(fallbackErr){
      console.warn('NexoPlay customer sales RPC fallback:',fallbackErr);
      c.innerHTML=`<div class="quick-modal-empty">No se pudo cargar el estado de entrega.<br><small>${escapeHTML(fallbackErr?.message||err?.message||'Revisa tu conexión y el SQL del módulo de ventas.')}</small></div>`;
      return [];
    }
  }
}

async function openOrderDelivery(ref,byId=false){
  if(!currentUser||!supabaseClient){showToast('Inicia sesión para consultar tu entrega.');openProfile();return}
  // Si recibimos un código local, podemos validar antes de consultar. Si recibimos
  // el UUID remoto desde una tarjeta entregada, la validación se hace después de
  // leer la fila y comprobar que su order_code pertenece a esta cuenta.
  if(!byId){
    const ownsOrder=getLocalOrdersForCurrentUser().some(o=>String(o.id)===String(ref));
    if(!ownsOrder){showToast('Ese pedido no pertenece a esta cuenta.');return}
  }
  const modal=document.getElementById('deliveryModalBg'),c=document.getElementById('deliveryModalContent');
  if(!modal||!c)return;
  modal.classList.add('open');
  c.innerHTML='';
  try{
    await syncUnsyncedLocalOrders();
    let query=supabaseClient.from('nexoplay_orders').select('id,order_code,user_id,items,total,payment_method,payment_status,delivery_status,delivery_email,delivery_password,delivery_profile,delivery_pin,purchase_date,expiry_date,delivered_at,created_at,updated_at').eq('user_id',currentUser.id).eq('payment_method','Wallet');
    query=byId?query.eq('id',ref):query.eq('order_code',ref);
    const {data:rawData,error}=await query.maybeSingle();
    const data=rawData?normalizeSaleRow(rawData):rawData;
    if(error)throw error;
    if(data && !getLocalOrdersForCurrentUser().some(o=>String(o.id)===String(data.order_id))){
      c.innerHTML='<div class="customer-delivery pending"><h4>🔒 Pedido no disponible</h4><p>Este pedido no está vinculado a la cuenta actualmente iniciada.</p></div>';
      return;
    }
    if(!data){
      c.innerHTML=`<div class="customer-delivery pending"><h4>📦 ${escapeHTML(ref)} · Pago registrado</h4><p>Tu pago con Wallet está guardado, pero el pedido todavía está siendo procesado por el módulo de entregas.</p><button class="order-view-btn" onclick="openOrderDelivery('${escapeHTML(ref)}',false)">🔄 Intentar nuevamente</button></div>`;
      return;
    }
    if(data.status==='delivered'){
      c.innerHTML=`<div class="customer-delivery"><h4>✅ ${escapeHTML(data.order_id)} · Cuenta entregada</h4><p>Estos son los datos que el administrador preparó para ti.</p><div class="delivery-data">
        <div class="delivery-data-row"><span>Correo</span><span>${escapeHTML(data.account_email||'—')} <button class="copy-small" onclick="copyDeliveryValue(${JSON.stringify(String(data.account_email||''))})">Copiar</button></span></div>
        <div class="delivery-data-row"><span>Contraseña</span><span>${escapeHTML(data.account_password||'—')} <button class="copy-small" onclick="copyDeliveryValue(${JSON.stringify(String(data.account_password||''))})">Copiar</button></span></div>
        <div class="delivery-data-row"><span>Perfil</span><span>${escapeHTML(data.account_profile||'—')}</span></div>
        <div class="delivery-data-row"><span>PIN</span><span>${escapeHTML(data.account_pin||'—')}</span></div>
        <div class="delivery-data-row"><span>Compra</span><span>${escapeHTML(saleDate(data.purchase_date))}</span></div>
        <div class="delivery-data-row"><span>Vencimiento</span><span>${escapeHTML(saleDate(data.expiration_date))}</span></div>
      </div></div>`;
    }else{
      c.innerHTML=renderCustomerSale(data);
    }
  }catch(err){console.error('NexoPlay delivery lookup:',err);c.innerHTML=`<div class="customer-delivery pending"><h4>⚠️ No pudimos consultar el pedido</h4><p>${escapeHTML(err?.message||'Revisa tu conexión con Supabase.')}</p><button class="order-view-btn" onclick="openOrderDelivery('${escapeHTML(ref)}',${byId?'true':'false'})">🔄 Reintentar</button></div>`}
}

function openDeliveryModal(id){return openOrderDelivery(id,true)}
function closeDeliveryModal(){document.getElementById('deliveryModalBg')?.classList.remove('open')}
function deliveryOutside(e){if(e.target.id==='deliveryModalBg')closeDeliveryModal()}
async function copyDeliveryValue(value){try{await navigator.clipboard?.writeText(value||'');showToast('Dato copiado')}catch(_){showToast('No se pudo copiar automáticamente')}}

async function enrichAdminSales(rows){
  const sales=(Array.isArray(rows)?rows:[]).map(normalizeSaleRow).filter(s=>String(s.payment_method||'').toLowerCase()==='wallet');
  if(!sales.length||!supabaseClient)return sales;
  const clientMap=new Map();
  try{
    const {data,error}=await supabaseClient.rpc('admin_list_wallet_clients');
    if(!error && Array.isArray(data))data.forEach(u=>clientMap.set(String(u.user_id||u.id),u));
  }catch(_){ }
  const ids=[...new Set(sales.map(s=>String(s.user_id||'')).filter(Boolean))];
  if(ids.length){
    try{
      const {data}=await supabaseClient.from('profiles').select('id,username').in('id',ids);
      (data||[]).forEach(u=>{const k=String(u.id);clientMap.set(k,{...(clientMap.get(k)||{}),...u})});
    }catch(_){ }
  }
  return sales.map(s=>{
    const u=clientMap.get(String(s.user_id||''))||{};
    return {...s,customer_username:s.customer_username||u.username||'',customer_email:s.customer_email||u.email||u.correo||''};
  });
}
async function refreshAdminWorkspace(){try{await refreshAdminState();await loadAdminSales();if(typeof renderAdminInventory==='function')renderAdminInventory();if(typeof renderAdminOverview==='function')renderAdminOverview();showToast('Panel actualizado correctamente');}catch(err){console.warn('NexoPlay admin refresh:',err);showToast('No se pudo actualizar todo el panel.')}}
async function loadAdminSales(){
  if(!supabaseClient)return;
  const list=document.getElementById('adminSalesList');if(list)list.innerHTML='<div class="sale-empty">Cargando ventas…</div>';
  try{
    // La vista administrativa es la primera opción: puede devolver cliente,
    // correo y demás datos ya preparados para el panel.
    const r=await nexoplayRpcFallback([
      {name:'admin_list_sales_v1',params:{p_status:'all'}},
      {name:'listar_ventas',params:{p_status:'all'}},
      {name:'listar_ventas',params:{status:'all'}},
      {name:'listar_ventas',params:{p_estado:'all'}},
      {name:'listar_ventas',params:{}}
    ]);
    if(r.ok){
      adminSalesCache=await enrichAdminSales(Array.isArray(r.data)?r.data:(r.data?[r.data]:[]));
      adminSalesCache=adminSalesCache.map(s=>({...s,items:parseSaleItems(s.items),items_text:s.items_text||saleItemsText(s)}));
      updateAdminSalesKpis();renderAdminSales();
      if(adminSalesCache.length)return;
    }
    const direct=await supabaseClient.from('nexoplay_orders').select('id,order_code,user_id,items,total,payment_method,payment_status,delivery_status,delivery_email,delivery_password,delivery_profile,delivery_pin,purchase_date,expiry_date,delivered_at,created_at,updated_at').eq('payment_method','Wallet').order('created_at',{ascending:false}).limit(100);
    if(direct.error)throw direct.error;
    adminSalesCache=await enrichAdminSales(Array.isArray(direct.data)?direct.data:[]);
    adminSalesCache=adminSalesCache.map(s=>({...s,items:parseSaleItems(s.items),items_text:s.items_text||saleItemsText(s)}));
    updateAdminSalesKpis();renderAdminSales();
  }catch(err){
    console.error('NexoPlay admin sales:',err);
    adminSalesCache=[];
    const msg=String(err?.message||err||'');
    if(list)list.innerHTML=`<div class="admin-note">No se pudieron cargar las ventas. ${escapeHTML(msg)}</div>`;
    const st=document.getElementById('adminSalesStatus');if(st)st.textContent='Revisar SQL/RLS';
  }
}

function updateAdminSalesKpis(){
  const pending=adminSalesCache.filter(x=>x.status!=='delivered').length;
  const delivered=adminSalesCache.filter(x=>x.status==='delivered').length;
  const a=document.getElementById('adminPendingCount'),b=document.getElementById('adminDeliveredCount'),badge=document.getElementById('adminPendingBadge');
  if(a)a.textContent=String(pending);if(b)b.textContent=String(delivered);if(badge)badge.textContent=String(pending);if(document.getElementById('adminOverviewSection')?.classList.contains('active'))renderAdminOverview();
  const st=document.getElementById('adminSalesStatus');if(st)st.textContent='Sincronizado';
}

/* ===== CATÁLOGO DE PLANTILLAS · RPC SUPABASE =====
   Módulo aislado: usa las funciones SQL ya instaladas en Supabase.
   No depende de la tabla nexoplay_catalog_templates (que no existe en este proyecto).
   El resto del catálogo, Wallet, pedidos y autenticación permanece intacto.
*/
let catalogTemplateCache=[];
let catalogTemplateSource='rpc';
let editingCatalogTemplateId=null;

function templateContentFromRow(t){
  let content={};
  try{
    if(typeof t?.contenido==='object' && t.contenido!==null) content=t.contenido;
    else if(t?.contenido) content=JSON.parse(t.contenido);
  }catch(_){content={description:String(t?.contenido||'')}}
  if(!content||typeof content!=='object')content={description:String(t?.contenido||'')};
  return content;
}

function templateRowToCatalogRow(t,index=0){
  const content=templateContentFromRow(t);
  let plans=Array.isArray(content.plans)?content.plans:[];
  plans=plans.map((p,i)=>({
    name:p?.name||p?.nombre||['1Mes','3Mes','6Mes','1Año'][i],
    price:Number(p?.price??p?.precio??0),
    stock:Number(p?.stock??0),
    desc:p?.desc||p?.description||'Modalidad disponible.',
    benefits:Array.isArray(p?.benefits)?p.benefits:['Compra guiada','Stock visible','Soporte NexoPlay'],active:p?.active!==false
  }));
  const id=t?.id??t?.plantilla_id??t?.template_id??`rpc-${Date.now()}-${index}`;
  return {
    id,
    nombre:String(t?.nombre??t?.name??content.name??'Nueva plantilla'),
    name:String(t?.nombre??t?.name??content.name??'Nueva plantilla'),
    contenido:t?.contenido??JSON.stringify(content),
    producto_id:t?.producto_id??t?.product_id??null,
    plan_id:t?.plan_id??null,
    activo:t?.activo!==false,
    active:t?.activo!==false,
    category:content.category||'streaming',
    image_url:content.image_url||content.image||'',
    description:content.description||content.desc||'Plantilla digital personalizada.',
    plans,
    offer:!!content.offer,
    is_new:content.is_new!==false,
    sort_order:Number(content.sort_order??index)
  };
}

function templateProductFromRow(t,index){
  const row=templateRowToCatalogRow(t,index);
  return {
    name:row.name,
    cls:`pt${index+1}`,
    category:row.category,
    isNew:row.is_new,
    offer:row.offer,
    desc:row.description,
    plans:row.plans,
    templateId:String(row.id),
    templateImage:row.image_url||''
  };
}

function removeDynamicTemplates(){for(let i=products.length-1;i>=0;i--){if(products[i]?.templateId)products.splice(i,1)}}
function applyTemplateRows(rows){
  removeDynamicTemplates();
  catalogTemplateCache=(Array.isArray(rows)?rows:[]).map((r,i)=>templateRowToCatalogRow(r,i));
  catalogTemplateCache.forEach((row,i)=>products.push(templateProductFromRow(row,i)));
  renderCategoryChips();
  applyCatalogTools();
}

function normalizeRpcRows(data){
  if(Array.isArray(data))return data;
  if(data===null||data===undefined)return [];
  if(Array.isArray(data?.rows))return data.rows;
  if(Array.isArray(data?.data))return data.data;
  if(typeof data==='object')return [data];
  return [];
}

async function callTemplateRpc(name,candidates){
  let lastError=null;
  for(const params of candidates){
    try{
      const {data,error}=await supabaseClient.rpc(name,params||{});
      if(!error)return {ok:true,data,name};
      lastError=error;
    }catch(err){lastError=err}
  }
  return {ok:false,error:lastError,name};
}

function templatePayloadFromForm(){
  const name=document.getElementById('tplName')?.value.trim();
  const category=document.getElementById('tplCategory')?.value||'streaming';
  const image=document.getElementById('tplImage')?.value.trim()||'';
  const description=document.getElementById('tplDescription')?.value.trim()||'Nueva plantilla digital de NexoPlay.';
  const plans=templatePlansFromForm();
  const content={
    name,category,image_url:image,description,plans,
    offer:!!document.getElementById('tplOffer')?.checked,
    is_new:!!document.getElementById('tplNew')?.checked,
    sort_order:Number(document.getElementById('tplOrder')?.value||100)
  };
  return {name,content,contentText:JSON.stringify(content),plans};
}

const TEMPLATE_OVERRIDE_KEY='nexoplay_template_overrides_v6';
function readTemplateOverrides(){try{return JSON.parse(localStorage.getItem(TEMPLATE_OVERRIDE_KEY)||'{}')}catch(_){return {}}}
function saveTemplateOverrides(v){try{localStorage.setItem(TEMPLATE_OVERRIDE_KEY,JSON.stringify(v||{}))}catch(_){} }
function mergeTemplateOverrides(rows){
  const map=readTemplateOverrides();
  const remote=Array.isArray(rows)?rows.map(r=>({...r})):[];
  const seen=new Set();
  const merged=remote.map(r=>{const id=String(r?.id??r?.plantilla_id??'');if(!id)return r;seen.add(id);const o=map[id];if(!o)return r;return {...r,nombre:o.name??r.nombre,name:o.name??r.name,contenido:o.content??r.contenido,producto_id:o.producto_id??r.producto_id};});
  Object.entries(map).forEach(([id,o])=>{if(seen.has(id)||!o?.localOnly)return;merged.push({id, nombre:o.name, name:o.name, contenido:o.content, producto_id:o.producto_id??null, activo:true})});
  return merged;
}

async function loadCatalogTemplates(){
  if(!supabaseClient){catalogTemplateSource='local';return loadLocalCatalogTemplates()}
  try{
    const candidates=[
      ['obtener_plantillas_activas',[{}]],
      ['obtener_plantillas',[{}]],
      ['listar_plantillas',[{}]],
      ['admin_list_templates',[{}]]
    ];
    for(const [rpcName,rpcParams] of candidates){
      const r=await callTemplateRpc(rpcName,rpcParams);
      if(r.ok){
        const rows=normalizeRpcRows(r.data);
        catalogTemplateSource='rpc';
        applyTemplateRows(mergeTemplateOverrides(rows));
        return true;
      }
    }

    // Fallback directo para instalaciones donde las plantillas están expuestas
    // como tabla/vista. No altera el resto del catálogo.
    for(const tableName of ['nexoplay_catalog_templates','catalog_templates','nexoplay_templates']){
      try{
        const q=await supabaseClient.from(tableName).select('*').order('created_at',{ascending:true});
        if(!q.error && Array.isArray(q.data)){
          catalogTemplateSource='table';
          applyTemplateRows(mergeTemplateOverrides(q.data));
          return true;
        }
      }catch(_){}
    }
    console.warn('NexoPlay: no se encontró una fuente remota de plantillas publicada.');
  }catch(err){console.warn('NexoPlay templates RPC:',err)}
  catalogTemplateSource='local';
  return loadLocalCatalogTemplates();
}

function loadLocalCatalogTemplates(){
  let rows=[];try{rows=JSON.parse(localStorage.getItem('nexoplay_catalog_templates')||'[]')}catch(_){rows=[]}
  catalogTemplateSource='local';
  applyTemplateRows(rows);
  return false;
}

let templatePlanCount=4;
function templatePlansFromForm(){
  return [...document.querySelectorAll('#templatePlanGrid .template-plan-card')].map((card,i)=>({name:card.querySelector('.tpl-plan-name')?.value.trim()||`Plan ${i+1}`,price:Number(card.querySelector('.tpl-plan-price')?.value||0),stock:Number(card.querySelector('.tpl-plan-stock')?.value||0),desc:card.querySelector('.tpl-plan-desc')?.value.trim()||'Modalidad configurable desde NexoPlay.',benefits:['Compra guiada','Stock visible','Soporte NexoPlay'],active:card.querySelector('.tpl-plan-active')?.checked!==false})).filter(p=>p.name&&Number.isFinite(p.price)&&p.price>=0);
}
function renderTemplatePlanFields(plans=[]){
 const grid=document.getElementById('templatePlanGrid');if(!grid)return;const source=plans.length?plans:[{name:'1Mes',price:0,stock:0},{name:'3Mes',price:0,stock:0},{name:'6Mes',price:0,stock:0},{name:'1Año',price:0,stock:0}];templatePlanCount=Math.min(12,Math.max(1,source.length));grid.innerHTML=source.map((p,i)=>`<div class="template-plan-card" data-plan-index="${i}"><div class="plan-card-head"><strong>PLAN ${i+1}</strong><div style="display:flex;align-items:center;gap:7px"><label style="font-size:8px;color:#858b99"><input class="tpl-plan-active" type="checkbox" ${p.active===false?'':'checked'}> Publicado</label><button type="button" class="remove-plan" onclick="removeTemplatePlan(${i})">Quitar</button></div></div><div class="fields"><input class="tpl-plan-name" value="${escapeHTML(p.name||`Plan ${i+1}`)}" placeholder="Nombre del plan" required><input class="tpl-plan-price" type="number" min="0" step="0.01" value="${Number(p.price||0)}" placeholder="Precio"><input class="tpl-plan-stock" type="number" min="0" step="1" value="${Number(p.stock||0)}" placeholder="Stock"></div><input class="tpl-plan-desc" style="width:100%;margin-top:7px" value="${escapeHTML(p.desc||'Modalidad configurable desde NexoPlay.')}" placeholder="Descripción breve"></div>`).join('');updateTemplatePlanButtons()}
function updateTemplatePlanButtons(){document.querySelectorAll('#templatePlanGrid .remove-plan').forEach(b=>b.style.display=document.querySelectorAll('#templatePlanGrid .template-plan-card').length<=1?'none':'inline-block');const add=document.getElementById('templateAddPlanBtn');if(add)add.style.display=document.querySelectorAll('#templatePlanGrid .template-plan-card').length>=12?'none':'inline-block'}
function addTemplatePlan(){const plans=templatePlansFromForm();plans.push({name:`Plan ${plans.length+1}`,price:0,stock:0,desc:'Modalidad configurable desde NexoPlay.',active:true});renderTemplatePlanFields(plans)}
function removeTemplatePlan(i){const plans=templatePlansFromForm();if(plans.length<=1)return;plans.splice(i,1);renderTemplatePlanFields(plans)}
function fillTemplateForm(row){
 const t=templateRowToCatalogRow(row,0);document.getElementById('tplName').value=t.name||'';document.getElementById('tplCategory').value=t.category||'streaming';document.getElementById('tplImage').value=t.image_url||'';document.getElementById('tplDescription').value=t.description||'';renderTemplatePlanFields(t.plans||[]);document.getElementById('tplOffer').checked=!!t.offer;document.getElementById('tplNew').checked=t.is_new!==false;document.getElementById('tplOrder').value=Number(t.sort_order||100);const productId=document.getElementById('tplProductId');if(productId)productId.value=t.producto_id??'';editingCatalogTemplateId=t.id;const btn=document.querySelector('#templateForm button[type="submit"]');if(btn)btn.textContent='💾 Guardar cambios';const cancel=document.getElementById('tplCancelEdit');if(cancel)cancel.style.display='inline-block';document.getElementById('tplFormTitle')?.replaceChildren(document.createTextNode('Editar producto'));
}
function resetTemplateForm(){editingCatalogTemplateId=null;document.getElementById('templateForm')?.reset();renderTemplatePlanFields();const order=document.getElementById('tplOrder');if(order)order.value='100';const fresh=document.getElementById('tplNew');if(fresh)fresh.checked=true;const productId=document.getElementById('tplProductId');if(productId)productId.value='';const btn=document.querySelector('#templateForm button[type="submit"]');if(btn)btn.textContent='➕ Publicar producto';const cancel=document.getElementById('tplCancelEdit');if(cancel)cancel.style.display='none';document.getElementById('tplFormTitle')?.replaceChildren(document.createTextNode('Nuevo producto'))}

function fillBaseProductForm(index){
  const p=products[index]; if(!p)return;
  const plans=(Array.isArray(p.plans)?p.plans:[]).map(x=>({...x}));
  const name=document.getElementById('tplName'),cat=document.getElementById('tplCategory'),img=document.getElementById('tplImage'),desc=document.getElementById('tplDescription');
  if(name)name.value=p.name||'';
  if(cat)cat.value=p.category||'streaming';
  if(img)img.value=p.templateImage||p.image||'';
  if(desc)desc.value=p.desc||'';
  renderTemplatePlanFields(plans);
  editingCatalogTemplateId=`base:${index}`;
  const btn=document.querySelector('#templateForm button[type="submit"]');
  if(btn)btn.textContent='💾 Guardar cambios';
  const cancel=document.getElementById('tplCancelEdit');
  if(cancel)cancel.style.display='inline-block';
  document.getElementById('tplFormTitle')?.replaceChildren(document.createTextNode('Editar producto del catálogo'));
  window.__editingBaseProductIndex=index;
}
function saveBaseProductEdits(){
  const i=Number(window.__editingBaseProductIndex);
  if(!Number.isInteger(i)||!products[i])return false;
  const p=products[i];
  p.name=document.getElementById('tplName')?.value.trim()||p.name;
  p.category=document.getElementById('tplCategory')?.value||p.category;
  p.templateImage=document.getElementById('tplImage')?.value.trim()||p.templateImage||'';
  p.desc=document.getElementById('tplDescription')?.value.trim()||'';
  p.plans=templatePlansFromForm();
  try{
    const base=JSON.parse(localStorage.getItem('nexoplay_base_product_overrides')||'{}');
    base[String(i)]={name:p.name,category:p.category,templateImage:p.templateImage,desc:p.desc,plans:p.plans};
    localStorage.setItem('nexoplay_base_product_overrides',JSON.stringify(base));
    p.plans.forEach((pl,j)=>{stockData[`${i}-${j}`]=Number(pl.stock||0)});
    localStorage.setItem(STOCK_KEY,JSON.stringify(stockData));
    const activeMap=JSON.parse(localStorage.getItem('nexoplay_plan_active')||'{}');
    p.plans.forEach((pl,j)=>activeMap[`${i}-${j}`]=pl.active!==false);
    localStorage.setItem('nexoplay_plan_active',JSON.stringify(activeMap));
  }catch(_){}
  renderCategoryChips();applyCatalogTools();renderProducts();resetTemplateForm();
  showToast('Producto y planes actualizados correctamente.');
  return true;
}

async function saveCatalogTemplate(){
  if(String(editingCatalogTemplateId||'').startsWith('base:')){
    return saveBaseProductEdits();
  }
  if(!(await refreshAdminState())){showToast('No autorizado.');return false}
  if(!supabaseClient){showToast('No hay conexión con Supabase.');return false}
  const wasEditing=editingCatalogTemplateId!==null;
  const payload=templatePayloadFromForm();
  if(!payload.name||!payload.plans.length||payload.plans.some(p=>!Number.isFinite(p.price)||p.price<0||!Number.isFinite(p.stock)||p.stock<0)){showToast('Completa el nombre y los datos de los planes.');return false}
  const productIdRaw=document.getElementById('tplProductId')?.value.trim()||'';
  const productId=productIdRaw?Number(productIdRaw):null;
  if(productIdRaw && !Number.isInteger(productId)){showToast('ID de producto no válido.');return false}
  const result=wasEditing
    ?await callTemplateRpc('actualizar_plantilla',[
      {p_id:Number(editingCatalogTemplateId),p_nombre:payload.name,p_contenido:payload.contentText,p_producto_id:productId},
      {p_id:Number(editingCatalogTemplateId),p_nombre:payload.name,p_contenido:payload.contentText,p_producto_id:productId,p_plan_id:null},
      {plantilla_id:Number(editingCatalogTemplateId),p_nombre:payload.name,p_contenido:payload.contentText,p_producto_id:productId}
    ])
    :await callTemplateRpc('crear_plantilla',[
      {p_nombre:payload.name,p_contenido:payload.contentText,p_producto_id:productId},
      {p_nombre:payload.name,p_contenido:payload.contentText,p_producto_id:productId,p_plan_id:null},
      {nombre:payload.name,contenido:payload.contentText,producto_id:productId}
    ]);
  if(!result.ok){
    const id=wasEditing?String(editingCatalogTemplateId):`local-v6-${Date.now()}`;
    const map=readTemplateOverrides();
    map[id]={localOnly:!wasEditing,name:payload.name,content:payload.contentText,producto_id:productId};
    saveTemplateOverrides(map);
    const localRow={id,nombre:payload.name,name:payload.name,contenido:payload.contentText,producto_id:productId,activo:true};
    const without=Object.values(map).map((o,j)=>({id:Object.keys(map)[j],nombre:o.name,name:o.name,contenido:o.content,producto_id:o.producto_id,activo:true}));
    const merged=[...catalogTemplateCache.filter(x=>String(x.id)!==id),...without.map(r=>templateRowToCatalogRow(r,0))];
    removeDynamicTemplates();catalogTemplateCache=merged;catalogTemplateCache.forEach((row,i)=>products.push(templateProductFromRow(row,i)));
    renderCategoryChips();applyCatalogTools();renderAdminTemplates();resetTemplateForm();
    showToast('Guardado localmente. Se conservará al recargar; Supabase no aceptó el guardado remoto.');return true;
  }
  // Remote save succeeded: remove this key from the local fallback mirror.
  try{const map=readTemplateOverrides();delete map[String(editingCatalogTemplateId)];saveTemplateOverrides(map)}catch(_){}
  await loadCatalogTemplates();resetTemplateForm();
  showToast(wasEditing?'Producto actualizado correctamente.':'Producto publicado correctamente.');
  return true;
}

function renderAdminTemplates(){
 const c=document.getElementById('adminTemplates');if(!c)return;
 const categoryOptions=CATEGORY_META.filter(x=>!['all','offers','new'].includes(x[0])).map(x=>`<option value="${escapeHTML(x[0])}">${escapeHTML(x[2])}</option>`).join('');
 c.innerHTML=`<div class="admin-view-head"><div><div class="eyebrow">CATÁLOGO DINÁMICO</div><h3>🧩 Productos y planes</h3><p>Crea y edita productos publicados con todas sus modalidades desde un solo lugar.</p></div><div class="admin-actions"><button class="admin-btn" onclick="loadCatalogTemplates().then(()=>renderAdminTemplates())">↻ Actualizar publicados</button><button class="admin-btn" onclick="switchAdminTab('inventory')">📦 Ver inventario</button></div></div>
 <form id="templateForm" class="template-form" onsubmit="event.preventDefault();saveCatalogTemplate()"><div class="full"><strong id="tplFormTitle" style="font-size:13px">Nuevo producto</strong></div><div><label>Nombre</label><input id="tplName" placeholder="Ej. Spotify Premium" required></div><div><label>Categoría</label><select id="tplCategory">${categoryOptions||'<option value="streaming">Streaming</option>'}</select></div><div class="full"><label>Ruta de imagen</label><input id="tplImage" placeholder="images/mi-producto.jpg"></div><div class="full"><label>Descripción / contenido</label><textarea id="tplDescription" placeholder="Describe el producto para tus clientes…"></textarea></div><div class="full"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px"><label style="margin:0">Modalidades publicadas</label><button id="templateAddPlanBtn" class="template-add-plan" type="button" onclick="addTemplatePlan()">＋ Añadir plan</button></div><div id="templatePlanGrid" class="template-plan-grid"></div></div><div class="template-checks"><label><input id="tplOffer" type="checkbox">🔥 Oferta</label><label><input id="tplNew" type="checkbox" checked>🆕 Nuevo</label><label>Orden <input id="tplOrder" type="number" value="100" min="0"></label><input id="tplProductId" type="number" min="1" step="1" placeholder="ID producto (opcional)" title="ID de producto opcional"></div><div class="full" style="display:flex;gap:8px;flex-wrap:wrap"><button class="primary" type="submit">➕ Publicar producto</button><button id="tplCancelEdit" class="secondary" type="button" onclick="resetTemplateForm()" style="display:none">Cancelar edición</button></div></form>
 <div class="admin-card" style="margin-top:14px"><h4>📚 Productos publicados y gestionables</h4>
 <p class="admin-muted">Aquí puedes editar los productos que ya aparecen en tu catálogo y también los creados desde este panel. Cambia el número de planes, nombres, precios, stock, descripción y estado publicado.</p>
 <div class="template-list">
 ${products.map((t,i)=>`<div class="template-row"><div><strong>${escapeHTML(t.name||'Producto')}</strong><span>${escapeHTML(categoryLabel(t.category||'streaming'))} · ${Array.isArray(t.plans)?t.plans.length:0} plan${Array.isArray(t.plans)&&t.plans.length===1?'':'es'} · Catálogo actual</span></div><div style="display:flex;gap:7px;flex-wrap:wrap"><button class="tool-btn" onclick="fillBaseProductForm(${i})">✏️ Editar planes</button></div></div>`).join('')}
 ${catalogTemplateCache.map(t=>`<div class="template-row"><div><strong>${escapeHTML(t.name||t.nombre||'Producto')}</strong><span>${escapeHTML(categoryLabel(t.category||'streaming'))} · ${(t.plans||[]).length} plan${(t.plans||[]).length===1?'':'es'} · ID ${escapeHTML(t.id)}</span></div><div style="display:flex;gap:7px;flex-wrap:wrap"><button class="tool-btn" onclick="fillTemplateForm(catalogTemplateCache.find(x=>String(x.id)===String('${String(t.id)}')))">✏️ Editar</button><button class="danger-sale" onclick="deleteCatalogTemplate('${String(t.id)}')">Retirar</button></div></div>`).join('')}
 </div></div>`;
 renderTemplatePlanFields();
}

function categorySlugify(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||`categoria-${Date.now()}`}
let editingCategoryId=null;
async function loadAdminCategories(){
 const c=document.getElementById('adminCategories');if(!c)return;
 let rows=[];
 if(supabaseClient){try{const {data,error}=await supabaseClient.from('nexoplay_catalog_categories').select('id,slug,name,icon,description,active,sort_order,is_system').order('sort_order',{ascending:true}).order('name',{ascending:true});if(!error&&Array.isArray(data))rows=data}catch(err){console.warn('NexoPlay admin categories:',err)}}
 if(!rows.length){rows=categoryMetaRows().map((x,i)=>({id:`local-${x[0]}`,slug:x[0],name:x[2],icon:x[1],description:x[3],active:true,sort_order:i,is_system:true}));try{const extra=JSON.parse(localStorage.getItem('nexoplay_custom_categories')||'[]');rows=[...rows,...extra]}catch(_){} }
 c.innerHTML=`<div class="admin-view-head"><div><div class="eyebrow">ORGANIZACIÓN</div><h3>🏷️ Categorías</h3><p>Conservamos tus 13 categorías actuales y puedes renombrarlas, cambiar icono o añadir nuevas.</p></div><div class="admin-actions"><button class="admin-btn" onclick="loadCategories().then(()=>loadAdminCategories())">↻ Sincronizar</button></div></div><div class="category-manager"><div class="admin-card"><h4 id="categoryFormTitle">＋ Nueva categoría</h4><form class="category-form" onsubmit="event.preventDefault();saveAdminCategory()"><div><label>Nombre</label><input id="adminCatName" placeholder="Ej. Ofertas especiales" required></div><div class="row"><div><label>Icono</label><input id="adminCatIcon" maxlength="4" value="📁"></div><div><label>Slug</label><input id="adminCatSlug" placeholder="ofertas-especiales" required></div></div><div><label>Descripción</label><textarea id="adminCatDescription" placeholder="Texto corto que aparece en el catálogo…"></textarea></div><div><label>Orden</label><input id="adminCatOrder" type="number" min="0" value="50"></div><div class="admin-actions"><button class="admin-btn primary" type="submit">💾 Guardar categoría</button><button class="admin-btn" type="button" onclick="resetAdminCategoryForm()">Limpiar</button></div></form><div class="admin-note" style="margin-top:12px">🔒 Las categorías del sistema no se eliminan para evitar que el catálogo actual se quede sin clasificación. Sí puedes editarlas.</div></div><div class="admin-card"><h4>📚 Categorías disponibles</h4><div class="category-list">${rows.map(r=>`<div class="category-admin-row"><div class="category-admin-icon">${escapeHTML(r.icon||'📁')}</div><div><strong>${escapeHTML(r.name||r.slug)}</strong><span>${escapeHTML(r.slug||'')} · ${r.is_system?'Sistema':'Personalizada'}${r.description?` · ${escapeHTML(r.description)}`:''}</span></div><div class="category-admin-actions"><button onclick="editAdminCategory('${String(r.id)}')">✏️ Editar</button>${r.is_system?'':'<button class="danger-sale" onclick="deleteAdminCategory(\''+String(r.id)+'\')">Eliminar</button>'}</div></div>`).join('')}</div></div></div>`;
 window.__adminCategoryRows=rows;
}
function editAdminCategory(id){const r=(window.__adminCategoryRows||[]).find(x=>String(x.id)===String(id));if(!r)return;editingCategoryId=r.id;document.getElementById('adminCatName').value=r.name||'';document.getElementById('adminCatIcon').value=r.icon||'📁';document.getElementById('adminCatSlug').value=r.slug||'';document.getElementById('adminCatDescription').value=r.description||'';document.getElementById('adminCatOrder').value=Number(r.sort_order||0);document.getElementById('categoryFormTitle').textContent='✏️ Editar categoría'}
function resetAdminCategoryForm(){editingCategoryId=null;document.querySelector('#adminCategories form')?.reset();const icon=document.getElementById('adminCatIcon');if(icon)icon.value='📁';const order=document.getElementById('adminCatOrder');if(order)order.value='50';const title=document.getElementById('categoryFormTitle');if(title)title.textContent='＋ Nueva categoría'}
async function saveAdminCategory(){if(!(await refreshAdminState())){showToast('No autorizado.');return}const name=document.getElementById('adminCatName')?.value.trim();const icon=document.getElementById('adminCatIcon')?.value.trim()||'📁';const slug=categorySlugify(document.getElementById('adminCatSlug')?.value.trim()||name);const description=document.getElementById('adminCatDescription')?.value.trim()||'';const sort_order=Number(document.getElementById('adminCatOrder')?.value||50);if(!name){showToast('Escribe un nombre.');return}
 if(supabaseClient){try{let result;if(editingCategoryId&&!String(editingCategoryId).startsWith('local-'))result=await supabaseClient.from('nexoplay_catalog_categories').update({slug,name,icon,description,sort_order}).eq('id',editingCategoryId);else if(!editingCategoryId||String(editingCategoryId).startsWith('local-'))result=await supabaseClient.from('nexoplay_catalog_categories').insert({slug,name,icon,description,sort_order,active:true,is_system:false});if(result?.error)throw result.error;await loadCategories();resetAdminCategoryForm();await loadAdminCategories();showToast('Categoría guardada.');return}catch(err){console.warn('NexoPlay category save remote:',err)}}
 let extra=[];try{extra=JSON.parse(localStorage.getItem('nexoplay_custom_categories')||'[]')}catch(_){};const item={id:editingCategoryId||`local-${Date.now()}`,slug,name,icon,description,sort_order,active:true,is_system:false};const pos=extra.findIndex(x=>String(x.id)===String(item.id));if(pos>=0)extra[pos]=item;else extra.push(item);localStorage.setItem('nexoplay_custom_categories',JSON.stringify(extra));CATEGORY_META=[...BASE_CATEGORY_META,...extra.map(x=>[x.slug,x.icon,x.name,x.description])];updateCategoryFilterOptions();renderCategoryChips();resetAdminCategoryForm();await loadAdminCategories();showToast('Categoría guardada en este navegador. Ejecuta la migración SQL para compartirla entre dispositivos.')}
async function deleteAdminCategory(id){if(!(await refreshAdminState())){showToast('No autorizado.');return}const r=(window.__adminCategoryRows||[]).find(x=>String(x.id)===String(id));if(r?.is_system){showToast('Las categorías del sistema no se eliminan.');return}if(!confirm('¿Retirar esta categoría del panel?'))return;if(supabaseClient&&!String(id).startsWith('local-')){const {error}=await supabaseClient.from('nexoplay_catalog_categories').update({active:false}).eq('id',id);if(error){showToast(error.message||'No se pudo retirar.');return}}let extra=[];try{extra=JSON.parse(localStorage.getItem('nexoplay_custom_categories')||'[]')}catch(_){}extra=extra.filter(x=>String(x.id)!==String(id));localStorage.setItem('nexoplay_custom_categories',JSON.stringify(extra));await loadCategories();await loadAdminCategories();showToast('Categoría retirada.')}

function setAdminNavActive(tab){document.querySelectorAll('.admin-nav button[id^="adminNav"]').forEach(b=>b.classList.remove('active'));const map={overview:'adminNavOverview',inventory:'adminNavInventory',wallet:'adminNavWallet',pending:'adminNavPending',delivered:'adminNavDelivered',templates:'adminNavTemplates',categories:'adminNavCategories',catalog:'adminNavCatalog',support:'adminNavSupport'};document.getElementById(map[tab])?.classList.add('active')}
function switchAdminTab(tab){
 adminSalesTab=tab;setAdminNavActive(tab);
 const views=['adminOverviewSection','adminInventorySection','adminWalletView','adminSalesView','adminTemplatesView','adminCategoriesSection','adminCatalogSection','adminRanksSection','adminSupportSection'];views.forEach(id=>document.getElementById(id)?.classList.remove('active'));
 const view={overview:'adminOverviewSection',inventory:'adminInventorySection',wallet:'adminWalletView',pending:'adminSalesView',delivered:'adminSalesView',templates:'adminTemplatesView',categories:'adminCategoriesSection',catalog:'adminCatalogSection',ranks:'adminRanksSection',support:'adminSupportSection'}[tab]||'adminOverviewSection';document.getElementById(view)?.classList.add('active');
 if(tab==='overview')renderAdminOverview();
 if(tab==='inventory')renderAdminInventory();
 if(tab==='wallet')loadAdminClients();
 if(tab==='pending'||tab==='delivered'){if(!adminSalesCache.length)loadAdminSales();else renderAdminSales()}
 if(tab==='support')loadAdminSupport()
 if(tab==='templates')loadCatalogTemplates().then(()=>renderAdminTemplates());
 if(tab==='categories')loadAdminCategories();
 if(tab==='catalog')renderAdminCatalog();
}
function renderAdminOverview(){
 const c=document.getElementById('adminOverviewSection');if(!c)return;const allPlans=products.flatMap((p,pi)=>getActivePlans(p).map(x=>({p,pi,si:p.plans.indexOf(x),plan:x})));const totalStock=allPlans.reduce((n,x)=>n+getStock(x.pi,x.si),0);const low=allPlans.filter(x=>{const s=getStock(x.pi,x.si);return s>0&&s<=2}).length;const out=allPlans.filter(x=>getStock(x.pi,x.si)<=0).length;const invBadge=document.getElementById('adminInventoryBadge');if(invBadge)invBadge.textContent=String(low+out);const pending=adminSalesCache.filter(x=>x.status!=='delivered').length;const delivered=adminSalesCache.filter(x=>x.status==='delivered').length;
 c.innerHTML=`<div class="admin-view-head"><div><div class="eyebrow">VISIÓN GENERAL</div><h3>Todo bajo control. 👋</h3><p>Un vistazo rápido a tu operación sin tocar la lógica que ya funciona.</p></div><div class="admin-actions"><button class="admin-btn primary" onclick="switchAdminTab('inventory')">📦 Gestionar stock</button><button class="admin-btn" onclick="switchAdminTab('templates')">＋ Publicar producto</button></div></div><div class="admin-overview-grid"><div class="admin-stat purple"><div class="kicker">Productos</div><div class="big">${products.length}</div><div class="small">Catálogo visible</div></div><div class="admin-stat cyan"><div class="kicker">Planes activos</div><div class="big">${allPlans.length}</div><div class="small">Modalidades publicadas</div></div><div class="admin-stat green"><div class="kicker">Stock total</div><div class="big">${totalStock}</div><div class="small">Unidades disponibles</div></div><div class="admin-stat gold"><div class="kicker">Alertas</div><div class="big">${low+out}</div><div class="small">${low} bajas · ${out} agotadas</div></div></div><div class="admin-grid-2"><div class="admin-card"><h4>⚡ Accesos rápidos</h4><div class="admin-list"><div class="admin-list-row"><b>📦 Inventario</b><span>${allPlans.length} modalidades · ${low+out} alertas <button class="admin-btn" onclick="switchAdminTab('inventory')">Abrir</button></span></div><div class="admin-list-row"><b>⏳ Ventas pendientes</b><span>${pending} por entregar <button class="admin-btn" onclick="switchAdminTab('pending')">Abrir</button></span></div><div class="admin-list-row"><b>✅ Ventas entregadas</b><span>${delivered} completadas <button class="admin-btn" onclick="switchAdminTab('delivered')">Abrir</button></span></div><div class="admin-list-row"><b>🏷️ Categorías</b><span>${categoryMetaRows().length} visibles <button class="admin-btn" onclick="switchAdminTab('categories')">Gestionar</button></span></div><div class="admin-list-row"><b>🆘 Soporte</b><span>${adminSupportTickets.filter(t=>String(t.status||'open')!=='closed').length} tickets abiertos <button class="admin-btn" onclick="switchAdminTab('support')">Atender</button></span></div></div></div><div class="admin-card"><h4>🛡️ Estado del sistema</h4><p class="admin-muted">${supabaseClient?'Supabase conectado. Los planes con ID remoto usan stock real y los productos publicados como plantillas guardan sus modalidades en Supabase.':'Supabase no está conectado: el panel usa almacenamiento local donde no existe una fuente remota.'}</p><div class="admin-list-row"><b>Panel</b><span>Protegido por is_admin()</span></div><div class="admin-list-row"><b>Catálogo</b><span>${products.length} productos cargados</span></div></div></div>`;
}
function renderAdminCatalog(){const c=document.getElementById('adminCatalogSection');if(!c)return;c.innerHTML=`<div class="admin-view-head"><div><div class="eyebrow">CATÁLOGO</div><h3>🛍️ Vista de productos</h3><p>Consulta rápidamente qué vendes y cuántas modalidades tiene cada producto.</p></div></div><div class="admin-card"><div class="inventory-table-wrap"><table class="inventory-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Planes</th><th>Desde</th><th>Stock</th><th>Origen</th></tr></thead><tbody>${products.map((p,pi)=>{const plans=getActivePlans(p);const min=plans.length?Math.min(...plans.map(x=>Number(x.price||0))):0;const st=plans.reduce((n,x)=>n+getStock(pi,p.plans.indexOf(x)),0);return `<tr><td><div class="inventory-product"><div class="inventory-thumb ${p.cls}"${productImageStyle(p)}></div><div><strong>${escapeHTML(p.name)}</strong><span>${escapeHTML(p.desc||'')}</span></div></div></td><td>${escapeHTML(categoryLabel(categoryOf(p)))}</td><td>${plans.length}</td><td>${plans.length?money(min):'—'}</td><td>${st}</td><td><span class="inventory-source ${p.templateId?'remote':'local'}">${p.templateId?'Plantilla':'Catálogo base'}</span></td></tr>`}).join('')}</tbody></table></div></div>`}
async function toggleAdminPlanActive(pi,si){
 if(!(await refreshAdminState())){showToast('No autorizado.');return}
 const plan=products[pi]?.plans?.[si];if(!plan)return;const next=plan.active===false; // activar si estaba oculto
 if(plan.dbPlanId&&supabaseClient){try{const {error}=await supabaseClient.from('planes').update({activo:next}).eq('id',Number(plan.dbPlanId));if(error)throw error;plan.active=next;showToast(next?'Plan publicado.':'Plan ocultado.');await loadStockFromSupabase();renderAdminInventory();renderProducts();if(currentProduct===products[pi]){renderPlans();updatePlanInfo()}return}catch(err){showToast(err.message||'No se pudo cambiar el estado del plan.');return}}
 if(products[pi]?.templateId&&supabaseClient){try{const row=catalogTemplateCache.find(x=>String(x.id)===String(products[pi].templateId));const content=templateContentFromRow(row);const plans=Array.isArray(content.plans)?content.plans:[];if(!plans[si])throw new Error('Plan no encontrado.');plans[si].active=next;content.plans=plans;const r=await callTemplateRpc('actualizar_plantilla',[{p_id:Number(row.id),p_nombre:row.name,p_contenido:JSON.stringify(content),p_producto_id:row.producto_id??null},{plantilla_id:Number(row.id),p_nombre:row.name,p_contenido:JSON.stringify(content),p_producto_id:row.producto_id??null}]);if(!r.ok)throw r.error||new Error('No se pudo guardar.');plan.active=next;await loadCatalogTemplates();renderAdminInventory();renderProducts();showToast(next?'Plan publicado.':'Plan ocultado.');return}catch(err){showToast(err.message||'No se pudo cambiar el estado.');return}}
 plan.active=next;localStorage.setItem('nexoplay_plan_active',JSON.stringify(Object.fromEntries(products.flatMap((p,i)=>p.plans.map((x,j)=>[`${i}-${j}`,x.active!==false])))));renderAdminInventory();renderPlans();renderProducts();showToast(next?'Plan publicado en este navegador.':'Plan ocultado en este navegador.');
}

function renderAdminInventory(){const c=document.getElementById('adminInventory');if(!c)return;const q=(document.getElementById('adminInventorySearch')?.value||'').toLowerCase().trim();const cat=document.getElementById('adminInventoryCategory')?.value||'all';const rows=[];products.forEach((p,pi)=>getActivePlans(p).forEach(x=>{const si=p.plans.indexOf(x);if(q&&!(`${p.name} ${x.name}`.toLowerCase().includes(q)))return;if(cat!=='all'&&categoryOf(p)!==cat)return;rows.push({p,pi,x,si})}));
 const categories=CATEGORY_META.filter(x=>!['all','offers','new'].includes(x[0])).map(x=>`<option value="${escapeHTML(x[0])}">${escapeHTML(x[2])}</option>`).join('');
 c.innerHTML=`<div class="admin-view-head"><div><div class="eyebrow">CONTROL DE STOCK</div><h3>📦 Inventario</h3><p>Ajusta unidades plan por plan. Los cambios remotos se guardan en Supabase y los productos sin fila remota conservan su stock local.</p></div><div class="admin-actions"><button class="admin-btn" onclick="loadStockFromSupabase().then(()=>renderAdminInventory())">↻ Sincronizar</button></div></div><div class="inventory-toolbar"><input id="adminInventorySearch" value="${escapeHTML(q)}" placeholder="Buscar producto o plan…" oninput="renderAdminInventory()"><select id="adminInventoryCategory" onchange="renderAdminInventory()"><option value="all">Todas las categorías</option>${categories}</select><button class="admin-btn" onclick="switchAdminTab('templates')">＋ Producto</button></div><div class="inventory-table-wrap"><table class="inventory-table"><thead><tr><th>Producto</th><th>Plan</th><th>Precio</th><th>Stock</th><th>Origen</th><th>Acciones</th></tr></thead><tbody>${rows.length?rows.map(({p,pi,x,si})=>{const st=getStock(pi,si);const cls=st<=0?'out':st<=2?'low':'ok';const src=x.dbPlanId?'Supabase':p.templateId?'Plantilla':'Local';return `<tr><td><div class="inventory-product"><div class="inventory-thumb ${p.cls}"${productImageStyle(p)}></div><div><strong>${escapeHTML(p.name)}</strong><span>${escapeHTML(categoryLabel(categoryOf(p)))}</span></div></div></td><td><span class="inventory-plan">${escapeHTML(x.name)}</span></td><td>${money(x.price||0)}</td><td><span class="stock-pill ${cls}">${st<=0?'Agotado':st<=2?'Bajo':'Disponible'} · ${st}</span></td><td><span class="inventory-source ${x.dbPlanId||p.templateId?'remote':'local'}">${src}</span></td><td><div class="stock-controls"><button title="Restar 1" onclick="adjustAdminStock(${pi},${si},-1)">−</button><span id="invStock_${pi}_${si}" class="stock-number">${st}</span><button title="Sumar 1" onclick="adjustAdminStock(${pi},${si},1)">＋</button><button title="Añadir 10" onclick="adjustAdminStock(${pi},${si},10)">+10</button></div><button class="plan-toggle ${x.active===false?'off':'on'}" onclick="toggleAdminPlanActive(${pi},${si})">${x.active===false?'○ Oculto':'● Publicado'}</button></td></tr>`}).join(''):`<tr><td colspan="6"><div class="sale-empty">No encontramos modalidades con esos filtros.</div></td></tr>`}</tbody></table></div>`;
 if(cat!=='all'){const el=document.getElementById('adminInventoryCategory');if(el)el.value=cat}}
async function adjustAdminStock(pi,si,delta){if(!(await refreshAdminState())){showToast('No autorizado.');return}const r=await adjustPlanStock(pi,si,delta);if(!r.ok){showToast(r.error?.message||'No se pudo actualizar el stock.');return}renderAdminInventory();renderProducts();if(currentProduct&&products[pi]===currentProduct){renderPlans();updatePlanInfo()}showToast(`Stock actualizado: ${r.stock}`)}

function renderAdminSales(){
  const c=document.getElementById('adminSalesList');if(!c)return;
  const q=(document.getElementById('adminSalesSearch')?.value||'').toLowerCase().trim();
  let list=adminSalesCache.filter(s=>adminSalesTab==='pending'?s.status!=='delivered':s.status==='delivered');
  if(q)list=list.filter(s=>[s.order_id,s.customer_email,s.customer_username,s.items_text,s.account_email].join(' ').toLowerCase().includes(q));
  if(!list.length){c.innerHTML='<div class="sale-empty">No hay ventas en esta sección.</div>';return}
  c.innerHTML=list.map(renderAdminSale).join('');
}
function renderAdminSale(s){
  const delivered=s.status==='delivered';
  return `<div class="sale-admin-card"><div class="sale-admin-top"><div><strong>${escapeHTML(s.order_id||'Pedido')}</strong><div class="sale-admin-meta">${escapeHTML(s.customer_username||'cliente')} · ${escapeHTML(s.customer_email||'—')}<br>${escapeHTML(saleDate(s.created_at))} · ${escapeHTML(s.payment_method||'—')} · <b>${money(s.total||0)}</b></div></div><span class="sale-admin-status ${delivered?'delivered':'pending'}">${delivered?'✓ Entregada':'⏳ Pendiente'}</span></div><div class="sale-admin-items">${escapeHTML(s.items_text||'Sin detalle')}</div>${(()=>{const it=Array.isArray(s.items)?s.items:[];const first=it.find(x=>x&&typeof x==='object')||{};const has=first.profile_name||first.profile_id||first.extra_data||first.customer_name||first.customer_phone||Number(first.sale_amount||0)>0;return has?`<div class="admin-customer-data"><div><b>👤 Cliente de Distribuidor/VIP</b></div>${first.customer_name?`<span>Nombre: ${escapeHTML(first.customer_name)}</span>`:''}${first.customer_phone?`<span>WhatsApp: ${escapeHTML(first.customer_phone)}</span>`:''}${first.profile_name?`<span>Perfil: ${escapeHTML(first.profile_name)}</span>`:''}${first.profile_id?`<span>ID / Usuario: ${escapeHTML(first.profile_id)}</span>`:''}${first.extra_data?`<span>Datos extra: ${escapeHTML(first.extra_data)}</span>`:''}${Number(first.sale_amount||0)>0?`<span>Monto vendido: <b>${money(first.sale_amount)}</b></span>`:''}</div>`:''})()}${delivered?`<div class="customer-delivery"><p><b>Entregado:</b> ${escapeHTML(saleDate(s.delivered_at))}<br><b>Vencimiento:</b> ${escapeHTML(saleDate(s.expiration_date))}</p><div class="sale-admin-actions"><button onclick="openAdminSaleDetails('${String(s.id)}')">🔎 DETALLES</button><button onclick="openDeliveryEditor('${String(s.id)}')">✏️ EDITAR DATOS</button></div></div>`:`<div class="delivery-form" id="deliveryForm_${escapeHTML(s.id)}"><div><label>Correo de la cuenta</label><input id="delEmail_${escapeHTML(s.id)}" placeholder="correo@ejemplo.com"></div><div><label>Contraseña</label><input id="delPass_${escapeHTML(s.id)}" type="text" placeholder="Contraseña"></div><div><label>Perfil</label><input id="delProfile_${escapeHTML(s.id)}" placeholder="Ej. Piero"></div><div><label>PIN</label><input id="delPin_${escapeHTML(s.id)}" placeholder="Ej. 1234"></div><div><label>Fecha de compra</label><input id="delPurchase_${escapeHTML(s.id)}" type="date" value="${new Date().toISOString().slice(0,10)}"></div><div><label>Fecha de vencimiento</label><input id="delExpire_${escapeHTML(s.id)}" type="date"></div><div class="full"><label>Nota interna (opcional)</label><textarea id="delNote_${escapeHTML(s.id)}" placeholder="Observación interna sobre la entrega…"></textarea></div><div class="delivery-actions"><button class="primary-sale" onclick="deliverSale('${String(s.id)}')">📤 Marcar como entregada</button></div></div>`}</div>`;
}

function openAdminSaleDetails(id){
  const s=adminSalesCache.find(x=>String(x.id)===String(id));
  const bg=document.getElementById('adminSaleDetailsBg'),c=document.getElementById('adminSaleDetailsContent');
  if(!s||!bg||!c)return;
  const items=Array.isArray(s.items)?s.items:[];const expiry=s.expiration_date?new Date(s.expiration_date):null;const daysLeft=expiry&&!Number.isNaN(expiry.getTime())?Math.max(0,Math.ceil((expiry-new Date())/86400000)):null;
  c.innerHTML=`<div class="sale-detail-hero"><div><div class="eyebrow">FICHA DE VENTA</div><h3>${escapeHTML(s.order_id||'Pedido')}</h3><p>${escapeHTML(s.customer_username||'cliente')} · ${escapeHTML(s.customer_email||'—')}</p></div><span class="sale-admin-status delivered">✓ Entregada</span></div>
  <div class="sale-detail-grid">
    <div class="sale-detail-section"><h4>👤 Cliente</h4><div class="sale-detail-row"><span>Usuario</span><b>${escapeHTML(s.customer_username||'—')}</b></div><div class="sale-detail-row"><span>Correo</span><b>${escapeHTML(s.customer_email||'—')}</b></div><div class="sale-detail-row"><span>ID usuario</span><b>${escapeHTML(s.user_id||'—')}</b></div></div>
    <div class="sale-detail-section"><h4>🧾 Compra</h4><div class="sale-detail-row"><span>Código</span><b>${escapeHTML(s.order_id||'—')}</b></div><div class="sale-detail-row"><span>Método</span><b>${escapeHTML(s.payment_method||'—')}</b></div><div class="sale-detail-row"><span>Pago</span><b>${escapeHTML(s.payment_status||'—')}</b></div><div class="sale-detail-row"><span>Total</span><b>${money(s.total||0)}</b></div></div>
    <div class="sale-detail-section"><h4>📅 Fechas</h4><div class="sale-detail-row"><span>Compra</span><b>${escapeHTML(saleDate(s.purchase_date||s.created_at))}</b></div><div class="sale-detail-row"><span>Entrega</span><b>${escapeHTML(saleDate(s.delivered_at))}</b></div><div class="sale-detail-row"><span>Vencimiento</span><b>${escapeHTML(saleDate(s.expiration_date))}</b></div></div>
    <div class="sale-detail-section"><h4>🔐 Cuenta entregada <button class="copy-small" style="float:right" onclick="openDeliveryEditor('${String(s.id)}')">✏️ Editar datos</button></h4><div class="sale-detail-row"><span>Correo</span><b>${escapeHTML(s.account_email||'—')}</b></div><div class="sale-detail-row"><span>Contraseña</span><b>${escapeHTML(s.account_password||'—')}</b></div><div class="sale-detail-row"><span>Perfil</span><b>${escapeHTML(s.account_profile||'—')}</b></div><div class="sale-detail-row"><span>PIN</span><b>${escapeHTML(s.account_pin||'—')}</b></div></div>
    <div class="sale-detail-section sale-detail-full"><h4>📦 Productos</h4><div class="sale-detail-items">${items.length?items.map(x=>`<div class="sale-detail-item"><span>${escapeHTML(x.name||'Producto')} · ${escapeHTML(x.plan||'')}</span><b>${money(x.price||0)}</b></div>`).join(''):`<span>Sin detalle de productos.</span>`}</div></div>
    <div class="sale-detail-section sale-detail-full"><h4>🛡️ Seguimiento</h4><div class="sale-detail-row"><span>Estado de entrega</span><b>Entregada</b></div><div class="sale-detail-row"><span>Tiempo restante</span><b>${daysLeft===null?'—':daysLeft+' día'+(daysLeft===1?'':'s')}</b></div><div class="sale-detail-row"><span>Garantía</span><b>Según condiciones de la compra</b></div><div class="sale-detail-row"><span>Última actualización</span><b>${escapeHTML(saleDate(s.updated_at||s.delivered_at||s.created_at))}</b></div></div>
  </div>`;
  bg.classList.add('open');
}
function closeAdminSaleDetails(){document.getElementById('adminSaleDetailsBg')?.classList.remove('open')}
function adminSaleDetailsOutside(e){if(e.target.id==='adminSaleDetailsBg')closeAdminSaleDetails()}

async function deliverSale(id){
  if(!supabaseClient){showToast('No hay conexión con Supabase.');return}
  if(!(await refreshAdminState())){showToast('No autorizado.');return}
  const g=x=>document.getElementById(x+id)?.value?.trim()||'';
  const email=g('delEmail_'),pass=g('delPass_'),profile=g('delProfile_'),pin=g('delPin_'),purchase=g('delPurchase_'),expire=g('delExpire_'),note=g('delNote_');
  if(!email||!pass||!purchase||!expire){showToast('Completa correo, contraseña, fecha de compra y vencimiento.');return}
  if(new Date(expire)<new Date(purchase)){showToast('La fecha de vencimiento no puede ser anterior a la compra.');return}
  try{
    // Primero actualizamos la tabla real. Si la política/RLS lo impide,
    // conservamos las RPC como compatibilidad para instalaciones anteriores.
    const direct=await supabaseClient.from('nexoplay_orders').update({delivery_email:email,delivery_password:pass,delivery_profile:profile||null,delivery_pin:pin||null,purchase_date:purchase,expiry_date:expire,delivery_status:'delivered',delivered_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',id).select('id').maybeSingle();
    if(direct.error || !direct.data){
      const payload={p_sale_id:id,p_account_email:email,p_account_password:pass,p_account_profile:profile,p_account_pin:pin,p_purchase_date:purchase,p_expiration_date:expire,p_note:note};
      const r=await nexoplayRpcFallback([
        {name:'admin_deliver_sale_v1',params:payload},
        {name:'entregar_venta',params:payload},
        {name:'entregar_venta',params:{sale_id:id,account_email:email,account_password:pass,account_profile:profile,account_pin:pin,purchase_date:purchase,expiration_date:expire,note:note}},
        {name:'entregar_venta',params:{p_venta_id:id,p_correo:email,p_contrasena:pass,p_perfil:profile,p_pin:pin,p_fecha_compra:purchase,p_fecha_vencimiento:expire,p_nota:note}}
      ]);
      if(!r.ok)throw direct.error||r.error||new Error('No se pudo entregar la cuenta.');
    }
    showToast('Venta marcada como entregada.');
    await loadAdminSales();
  }catch(err){console.error('NexoPlay deliver sale:',err);showToast(err?.message||'No se pudo entregar la cuenta.')}
}

/* Compatibilidad: checkout ya registra la venta después del pago sin tocar Wallet. */

/* Extiende Mis pedidos con el estado real de entrega, sin eliminar el historial local. */
const __nexoOriginalOpenOrders=openOrders;
openOrders=function(){__nexoOriginalOpenOrders();setTimeout(()=>loadCustomerSales(),50)};

/* Refuerza el menú de administrador cuando la sesión cambia, sin tocar la función original. */
const __nexoOriginalOpenAdminPanel=openAdminPanel;
openAdminPanel=async function(){await __nexoOriginalOpenAdminPanel();await loadAdminSales();};


let adminSupportTickets=[];let adminSupportActive=null;
async function loadAdminSupport(){
 const root=document.getElementById('adminSupportRoot');if(!root)return;if(!(await refreshAdminState()))return;root.innerHTML='<div class="wallet-empty">Cargando tickets…</div>';adminSupportTickets=[];
 if(supabaseClient){try{const {data,error}=await supabaseClient.from('support_tickets').select('*').order('created_at',{ascending:false});if(!error)adminSupportTickets=data||[]}catch(_){} }
 const badge=document.getElementById('adminSupportBadge');if(badge)badge.textContent=String(adminSupportTickets.filter(t=>String(t.status||'open')!=='closed').length);renderAdminSupport();
}
function renderAdminSupport(){
 const root=document.getElementById('adminSupportRoot');if(!root)return;
 root.innerHTML=`<div class="admin-view-head"><div><div class="eyebrow">ATENCIÓN AL CLIENTE</div><h3>🆘 Centro de soporte</h3><p>Tickets privados. Solo tú y el cliente asociado pueden ver sus mensajes.</p></div></div><div class="support-shell" style="height:calc(100vh - 190px);border:1px solid #252938;border-radius:14px;overflow:hidden"><aside class="support-sidebar"><div class="support-ticket-list">${adminSupportTickets.length?adminSupportTickets.map(t=>`<button class="support-ticket ${String(t.id)===String(adminSupportActive?.id)?'active':''}" onclick="openAdminSupportTicket('${String(t.id)}')"><b>${escapeHTML(t.subject||t.category||'Solicitud')}</b><small>${escapeHTML(String(t.id).slice(0,8))} · ${escapeHTML(t.status||'open')}</small></button>`).join(''):'<div style="color:#858b99;font-size:9px;padding:10px">No hay tickets.</div>'}</div></aside><main id="adminSupportContent" class="support-content"><div class="support-empty"><div>🛟<br><span>Selecciona una solicitud.</span></div></div></main></div>`;
}
async function openAdminSupportTicket(id){
 const t=adminSupportTickets.find(x=>String(x.id)===String(id));if(!t||!supabaseClient)return;adminSupportActive=t;renderAdminSupport();const c=document.getElementById('adminSupportContent');if(!c)return;c.innerHTML=`<div class="support-head"><div class="support-actions" style="justify-content:space-between"><div><div class="eyebrow">${escapeHTML(String(t.id).slice(0,8))}</div><h3 style="margin:4px 0">${escapeHTML(t.subject||t.category||'Solicitud')}</h3><div style="color:#858b99;font-size:9px">Cliente: ${escapeHTML(t.user_id||'—')} · Compra: <span class="support-code">${escapeHTML(t.purchase_code||'—')}</span></div></div><button class="support-actions danger" onclick="closeSupportTicket('${String(t.id)}')">Cerrar ticket</button></div></div><div class="support-chat"><div id="adminSupportMessages" class="support-messages"></div><div class="support-chatbar"><input id="adminSupportImageInput" type="file" accept="image/*" style="display:none" onchange="supportPickImage(this,'adminSupportImageName')"><button class="support-attach" type="button" title="Enviar imagen" onclick="document.getElementById('adminSupportImageInput').click()">📷</button><textarea id="adminSupportInput" placeholder="Escribe tu respuesta…"></textarea><button class="admin-btn primary" onclick="sendAdminSupportMessage('${String(t.id)}')">Responder</button></div><div id="adminSupportImageName" style="display:none;font-size:8px;color:#858b99;padding:0 10px 7px"></div></div>`;await loadAdminSupportMessages(t.id)}
async function loadAdminSupportMessages(ticketId){const c=document.getElementById('adminSupportMessages');if(!c)return;const {data,error}=await supabaseClient.from('support_messages').select('*').eq('ticket_id',ticketId).order('created_at',{ascending:true});const msgs=error?[]:(data||[]);c.innerHTML=msgs.length?msgs.map(m=>`<div class="support-bubble ${m.sender_id===currentUser?.id?'me':''}">${supportMessageHTML(m.message||'')}<small>${escapeHTML(saleDate(m.created_at))}</small></div>`).join(''):'<div class="support-empty"><div>💬<br><span>Sin mensajes todavía.</span></div></div>';c.scrollTop=c.scrollHeight}
async function sendAdminSupportMessage(ticketId){const input=document.getElementById('adminSupportInput'),file=document.getElementById('adminSupportImageInput')?.files?.[0],text=input?.value.trim()||'';if(!text&&!file||!supabaseClient)return;if(!(await refreshAdminState()))return;try{const message=file?`[[IMAGE]]${await supportImageData(file)}[[TEXT]]${text}`:text;const {error}=await supabaseClient.from('support_messages').insert({ticket_id:ticketId,sender_id:currentUser.id,message});if(error)throw error;input.value='';const f=document.getElementById('adminSupportImageInput');if(f)f.value='';const l=document.getElementById('adminSupportImageName');if(l)l.style.display='none';await loadAdminSupportMessages(ticketId)}catch(e){console.error(e);showToast(e?.message||'No se pudo enviar la respuesta.')}}
async function closeSupportTicket(ticketId){if(!supabaseClient)return;if(!confirm('¿Cerrar este ticket y eliminar su conversación definitivamente?'))return;try{const {data,error}=await supabaseClient.rpc('admin_delete_support_ticket',{p_ticket_id:ticketId});if(error)throw error;if(data!==true){throw new Error('La función no confirmó la eliminación del ticket.')}adminSupportTickets=adminSupportTickets.filter(t=>String(t.id)!==String(ticketId));adminSupportActive=null;showToast('Ticket cerrado y eliminado correctamente.');await loadAdminSupport()}catch(e){console.error('Error al cerrar ticket:',e);showToast('No se pudo eliminar definitivamente el ticket.')}}

function supportMessageHTML(raw){
 const s=String(raw||'');
 if(s.startsWith('[[IMAGE]]')){
  const p=s.split('[[TEXT]]'),src=p[0].slice(9),caption=p[1]||'';
  if(/^data:image\//.test(src))return `<img class="support-image" src="${src}" alt="Imagen enviada" onclick="window.open(this.src,'_blank')">${caption?`<div style="margin-top:5px">${escapeHTML(caption)}</div>`:''}`;
 }
 return escapeHTML(s).replace(/\n/g,'<br>');
}
async function supportImageData(file){
 if(!file||!file.type.startsWith('image/'))throw new Error('Selecciona una imagen válida.');
 if(file.size>6*1024*1024)throw new Error('La imagen supera 6 MB.');
 const url=URL.createObjectURL(file);
 try{
  const img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=url});
  const max=1280,sc=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*sc));c.height=Math.max(1,Math.round(img.naturalHeight*sc));
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  return c.toDataURL('image/jpeg',.8);
 }finally{URL.revokeObjectURL(url)}
}
function supportPickImage(input,labelId){
 const l=document.getElementById(labelId);if(!l)return;
 l.textContent=input.files?.[0]?`📎 ${input.files[0].name}`:'';
 l.style.display=input.files?.[0]?'block':'none';
}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
document.getElementById('yapeNumber').textContent=YAPE_NUMBER;document.getElementById('yapeLargeNumber').textContent=YAPE_NUMBER;
syncYapeUI();syncPlinUI();selectCheckoutMethod(document.querySelector('input[name="checkoutMethod"]:checked')?.value||'yape');syncProfileAvatar(currentUser);
renderFavorites();renderOrders();renderFavoritesModal();renderOrdersModal();applyCatalogTools();updateCart();renderReviews();
renderCategoryChips();
initAuth();
loadCategories().catch(err=>console.warn('NexoPlay categories init:',err));
loadCatalogTemplates().catch(err=>console.warn('NexoPlay templates init:',err));
(async()=>{const ok=await loadStockFromSupabase();if(ok){renderCategoryChips();renderProducts();if(currentProduct){renderPlans();updatePlanInfo()}}else if(!SUPABASE_READY){console.warn('NexoPlay: falta configurar SUPABASE_URL y SUPABASE_ANON_KEY. Se usará el stock local hasta configurarlo.')}})();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}
document.addEventListener('DOMContentLoaded',()=>{try{renderCombos();updateCheckoutWalletBalance();applyCatalogTools()}catch(err){console.warn('NexoPlay UI init:',err)}});

function openDeliveryEditor(id){
  const s=adminSalesCache.find(x=>String(x.id)===String(id)); if(!s){showToast('No se encontró la entrega.');return}
  let bg=document.getElementById('deliveryEditorBg');
  if(!bg){bg=document.createElement('div');bg.id='deliveryEditorBg';bg.className='tutorial-bg';bg.style.zIndex='660';bg.onclick=e=>{if(e.target.id==='deliveryEditorBg')closeDeliveryEditor()};document.body.appendChild(bg)}
  bg.innerHTML=`<div class="auth-modal" onclick="event.stopPropagation()"><div class="tutorial-modal-head"><div><h2>✏️ Editar datos</h2><p style="margin:4px 0 0;color:#858b99;font-size:9px">Código: ${escapeHTML(s.order_id||'—')}</p></div><button class="close" onclick="closeDeliveryEditor()">×</button></div><div class="quick-modal-body"><div class="delivery-form" style="margin:0;border:0;padding:0"><div><label>Correo de la cuenta</label><input id="editDelEmail" value="${escapeHTML(s.account_email||'')}"></div><div><label>Contraseña</label><input id="editDelPass" value="${escapeHTML(s.account_password||'')}"></div><div><label>Perfil</label><input id="editDelProfile" value="${escapeHTML(s.account_profile||'')}"></div><div><label>PIN</label><input id="editDelPin" value="${escapeHTML(s.account_pin||'')}"></div><div><label>Fecha de compra</label><input id="editDelPurchase" type="date" value="${s.purchase_date?String(s.purchase_date).slice(0,10):''}"></div><div><label>Fecha de vencimiento</label><input id="editDelExpire" type="date" value="${s.expiration_date?String(s.expiration_date).slice(0,10):''}"></div><div class="full"><label>Nota interna</label><textarea id="editDelNote" placeholder="Observación interna…"></textarea></div><div class="delivery-actions"><button class="admin-btn" onclick="closeDeliveryEditor()">Cancelar</button><button class="admin-btn primary" onclick="saveDeliveryEditor('${String(id)}')">Actualizar y enviar</button></div></div></div></div>`;
  bg.style.zIndex='720';bg.style.display='flex';
}
function closeDeliveryEditor(){document.getElementById('deliveryEditorBg')?.remove()}
async function saveDeliveryEditor(id){
  if(!(await refreshAdminState())){showToast('No autorizado.');return}
  if(!supabaseClient){showToast('Supabase no está conectado.');return}
  const payload={delivery_email:document.getElementById('editDelEmail')?.value.trim()||null,delivery_password:document.getElementById('editDelPass')?.value||null,delivery_profile:document.getElementById('editDelProfile')?.value.trim()||null,delivery_pin:document.getElementById('editDelPin')?.value.trim()||null,purchase_date:document.getElementById('editDelPurchase')?.value||null,expiry_date:document.getElementById('editDelExpire')?.value||null,updated_at:new Date().toISOString()};
  const {error}=await supabaseClient.from('nexoplay_orders').update(payload).eq('id',id);
  if(error){showToast(error.message||'No se pudieron actualizar los datos.');return}
  showToast('Datos actualizados correctamente.');closeDeliveryEditor();await loadAdminSales();
}

/* ===== SOPORTE / TICKETS: UI preparada para Supabase ===== */
let supportTicketsCache=[];let supportActiveTicket=null;
const SUPPORT_REASONS=[['account_error','🏠 Error con mi cuenta'],['wrong_password','🔑 Contraseña incorrecta'],['wrong_profile_pin','🔐 PIN de perfil incorrecto'],['login_code','🔢 Código de inicio de sesión incorrecto'],['wrong_email','📧 Correo incorrecto'],['other','📝 Otro motivo']];
function closeSupport(){document.getElementById('supportModalBg')?.classList.remove('open')}
function supportOutside(e){if(e.target.id==='supportModalBg')closeSupport()}
async function openSupport(){
  if(!currentUser){openAuth('login');showToast('Inicia sesión para usar soporte.');return}
  await refreshAdminState();
  if(isAdminUser()){
    document.getElementById('supportModalBg')?.classList.remove('open');
    await openAdminPanel();
    switchAdminTab('support');
    return;
  }
  document.getElementById('supportModalBg')?.classList.add('open');await loadSupportTickets();
}
async function loadSupportTickets(){
 const list=document.getElementById('supportTicketList');if(!list)return;list.innerHTML='<div class="support-empty" style="height:auto;padding:20px 5px">Cargando…</div>';supportTicketsCache=[];
 if(supabaseClient){try{const {data,error}=await supabaseClient.from('support_tickets').select('*').eq('user_id',currentUser.id).order('created_at',{ascending:false});if(!error)supportTicketsCache=data||[]}catch(_){} }
 renderSupportTicketList();
}
function renderSupportTicketList(){const list=document.getElementById('supportTicketList');if(!list)return;list.innerHTML=supportTicketsCache.length?supportTicketsCache.map(t=>`<button class="support-ticket ${String(t.id)===String(supportActiveTicket?.id)?'active':''}" onclick="openSupportTicket('${String(t.id)}')"><b>${escapeHTML(t.subject||t.category||'Solicitud')}</b><small><span class="support-status">${escapeHTML(t.status||'open')}</span> · ${escapeHTML(String(t.id).slice(0,8))}</small></button>`).join(''):'<div style="color:#858b99;font-size:9px;line-height:1.5;padding:8px">Todavía no tienes solicitudes abiertas.</div>'}
function startSupportTicket(orderCode=''){
 const c=document.getElementById('supportContent');if(!c)return;c.innerHTML=`<div class="support-compose"><div class="eyebrow">NUEVA SOLICITUD</div><h3 style="margin:5px 0">¿Qué problema tiene tu cuenta?</h3><p style="color:#858b99;font-size:9px">Selecciona el motivo y te pediremos únicamente los datos necesarios.</p><div class="support-reasons">${SUPPORT_REASONS.map(([id,label])=>`<button class="support-reason" onclick="chooseSupportReason('${id}','${escapeHTML(orderCode)}')">${label}</button>`).join('')}</div></div>`;
}
function chooseSupportReason(reason,orderCode=''){
 const labels=Object.fromEntries(SUPPORT_REASONS);const extra=reason==='wrong_profile_pin'?'<div class="support-field"><label>Nombre del perfil</label><input id="ticketProfile" placeholder="Ej. Piero"></div>':reason==='wrong_email'?'<div class="support-field"><label>Correo correcto que debería tener</label><input id="ticketCorrectEmail" type="email" placeholder="correo@ejemplo.com"></div>':reason==='other'?'<div class="support-field"><label>Describe el problema</label><textarea id="ticketDescription" placeholder="Cuéntanos qué sucede con tu cuenta…"></textarea></div>':'<div class="support-field"><label>Describe brevemente el problema</label><textarea id="ticketDescription" placeholder="Cuéntanos qué sucede…"></textarea></div>';
 const c=document.getElementById('supportContent');c.innerHTML=`<div class="support-compose"><div class="eyebrow">${escapeHTML(labels[reason]||'SOPORTE')}</div><h3 style="margin:5px 0">Datos de la cuenta</h3><div class="support-field"><label>Código de compra</label><input id="ticketOrderCode" value="${escapeHTML(orderCode)}" placeholder="Ej. NP-847291"></div>${extra}<div class="support-actions" style="margin-top:12px"><button onclick="loadSupportTickets()">Cancelar</button><button class="admin-btn primary" onclick="createSupportTicket('${reason}')">Crear ticket y abrir chat</button></div></div>`;
}
async function createSupportTicket(reason){
 if(!currentUser||!supabaseClient){showToast('El soporte requiere la conexión con Supabase.');return}
 const orderCode=document.getElementById('ticketOrderCode')?.value.trim();const desc=document.getElementById('ticketDescription')?.value.trim()||'';const profile=document.getElementById('ticketProfile')?.value.trim()||null;const correctEmail=document.getElementById('ticketCorrectEmail')?.value.trim()||null;if(!orderCode){showToast('Ingresa tu código de compra.');return}
 const label=(Object.fromEntries(SUPPORT_REASONS)[reason]||'Soporte').replace(/^[^\p{L}\p{N}]+/u,'').trim();
 const payload={user_id:currentUser.id,category:reason,subject:label,status:'open',purchase_code:orderCode,profile_name:profile,account_email:correctEmail,description:desc};
 const {data,error}=await supabaseClient.from('support_tickets').insert(payload).select('*').single();if(error){showToast('No se pudo crear el ticket. Configura las tablas de soporte en Supabase.');console.error(error);return}
 supportTicketsCache.unshift(data);
 const details=[`🆘 Solicitud de soporte: ${label}`,`🧾 Código de compra: ${orderCode}`];
 if(profile)details.push(`👤 Nombre del perfil: ${profile}`);
 if(correctEmail)details.push(`📧 Correo indicado: ${correctEmail}`);
 if(desc)details.push(`📝 Descripción del problema:
${desc}`);
 const firstMessage=details.join('\n');
 try{await supabaseClient.from('support_messages').insert({ticket_id:data.id,sender_id:currentUser.id,message:firstMessage});}catch(e){console.warn('No se pudo guardar el resumen inicial del ticket:',e)}
 openSupportTicket(data.id);
}
async function openSupportTicket(id){const t=supportTicketsCache.find(x=>String(x.id)===String(id))||supportTicketsCache[0];if(!t||!supabaseClient)return;supportActiveTicket=t;renderSupportTicketList();const c=document.getElementById('supportContent');c.innerHTML=`<div class="support-head"><div class="support-actions" style="justify-content:space-between"><div><div class="eyebrow">${escapeHTML(String(t.id).slice(0,8))}</div><h3 style="margin:4px 0">${escapeHTML(t.subject||t.category||'Solicitud')}</h3><div style="color:#858b99;font-size:9px">Código de compra: <span class="support-code">${escapeHTML(t.purchase_code||'—')}</span></div></div><span class="support-status">${escapeHTML(t.status||'open')}</span></div></div><div class="support-chat"><div id="supportMessages" class="support-messages"></div><div class="support-chatbar"><input id="supportImageInput" type="file" accept="image/*" style="display:none" onchange="supportPickImage(this,'supportImageName')"><button class="support-attach" type="button" title="Enviar imagen" onclick="document.getElementById('supportImageInput').click()">📷</button><textarea id="supportMessageInput" placeholder="Escribe tu mensaje…"></textarea><button class="admin-btn primary" onclick="sendSupportMessage('${String(t.id)}')">Enviar</button></div><div id="supportImageName" style="display:none;font-size:8px;color:#858b99;padding:0 10px 7px"></div></div>`;await loadSupportMessages(t.id)}
async function loadSupportMessages(ticketId){const c=document.getElementById('supportMessages');if(!c)return;let msgs=[];try{const {data,error}=await supabaseClient.from('support_messages').select('*').eq('ticket_id',ticketId).order('created_at',{ascending:true});if(!error)msgs=data||[]}catch(_){}c.innerHTML=msgs.length?msgs.map(m=>`<div class="support-bubble ${m.sender_id===currentUser.id?'me':''}">${supportMessageHTML(m.message||'')}<small>${escapeHTML(saleDate(m.created_at))}</small></div>`).join(''):'<div class="support-empty"><div>💬<br><span>Este chat está listo. Escribe tu primer mensaje.</span></div></div>';c.scrollTop=c.scrollHeight}
async function sendSupportMessage(ticketId){const input=document.getElementById('supportMessageInput'),file=document.getElementById('supportImageInput')?.files?.[0],text=input?.value.trim()||'';if(!text&&!file)return;if(!supabaseClient)return;try{const message=file?`[[IMAGE]]${await supportImageData(file)}[[TEXT]]${text}`:text;const {error}=await supabaseClient.from('support_messages').insert({ticket_id:ticketId,sender_id:currentUser.id,message});if(error)throw error;input.value='';const f=document.getElementById('supportImageInput');if(f)f.value='';const l=document.getElementById('supportImageName');if(l)l.style.display='none';await loadSupportMessages(ticketId)}catch(e){console.error(e);showToast(e?.message||'No se pudo enviar el mensaje.')}}
async function openSupportForOrder(code=''){await openSupport();const bg=document.getElementById('supportModalBg');if(bg){bg.style.zIndex='700';bg.classList.add('open')}startSupportTicket(code)}

/* ===== RECUPERACIÓN DE CONTRASEÑA ===== */
function openRecovery(){const email=document.getElementById('loginEmail')?.value.trim()||'';recoveryPending={email:'',verified:false};document.getElementById('recoveryEmail').value=email;document.getElementById('recoveryCode').value='';document.getElementById('recoveryPassword').value='';document.getElementById('recoveryPassword2').value='';document.getElementById('recoveryModalBg')?.classList.add('open');setRecoveryStep(1)}
function closeRecovery(){document.getElementById('recoveryModalBg')?.classList.remove('open')}
function recoveryOutside(e){if(e.target.id==='recoveryModalBg')closeRecovery()}
function setRecoveryStep(n){['recoveryStep1','recoveryStep2','recoveryStep3'].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.style.display=i===n-1?'block':'none'});const m=document.getElementById('recoveryMessage');if(m){m.className='auth-message';m.textContent=''}}
let recoveryPending={email:'',verified:false};
async function sendRecoveryCode(){
 const email=document.getElementById('recoveryEmail').value.trim().toLowerCase();if(!email){setRecoveryMessage('Escribe tu correo.');return}
 if(!supabaseClient){setRecoveryMessage('Supabase no está conectado.');return}
 try{
   await callEmailCode('recovery_send',{email});
   recoveryPending={email,verified:false};
   setRecoveryStep(2);setRecoveryMessage('Código enviado. Revisa tu correo y escríbelo aquí.','success');
 }catch(err){setRecoveryMessage(err?.message||'No se pudo enviar el código de recuperación.','error');console.error('NexoPlay recovery send:',err)}
}
async function verifyRecoveryCode(){
 const email=recoveryPending.email||document.getElementById('recoveryEmail').value.trim().toLowerCase();
 const code=document.getElementById('recoveryCode').value.trim();
 if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setRecoveryMessage('Escribe un correo válido.');setRecoveryStep(1);return}
 if(!/^\d{6}$/.test(code)){setRecoveryMessage('Escribe el código de 6 dígitos.','warning');return}
 try{
   await callEmailCode('recovery_verify',{email,code});
   recoveryPending={email,verified:true};
   setRecoveryStep(3);setRecoveryMessage('Código verificado. Ahora crea una contraseña nueva.','success');
 }catch(err){setRecoveryMessage(err?.message||'El código es incorrecto o ya expiró.','error');console.error('NexoPlay recovery verify:',err)}
}
async function finishRecoveryPassword(){
 const p=document.getElementById('recoveryPassword').value,p2=document.getElementById('recoveryPassword2').value;
 if(!recoveryPending.verified){setRecoveryMessage('Primero verifica el código enviado a tu correo.','warning');setRecoveryStep(2);return}
 if(p.length<6||p!==p2){setRecoveryMessage('Las contraseñas no coinciden o tienen menos de 6 caracteres.','warning');return}
 if(!supabaseClient){setRecoveryMessage('Supabase no está conectado.');return}
 try{
   await callEmailCode('recovery_reset',{email:recoveryPending.email,password:p});
   setRecoveryMessage('Contraseña actualizada correctamente.','success');
   setTimeout(()=>{recoveryPending={email:'',verified:false};closeRecovery()},900);
 }catch(err){setRecoveryMessage(err?.message||'No se pudo actualizar la contraseña.','error');console.error('NexoPlay recovery reset:',err)}
}
function setRecoveryMessage(text,type=''){const m=document.getElementById('recoveryMessage');if(m){m.textContent=text;m.className='auth-message show '+type}}
/* Exposición controlada para módulos aislados añadidos después del script principal. */
window.__nexoGetCurrentUser=()=>currentUser;window.__nexoGetSupabase=()=>supabaseClient;



/* ===== NEXOPLAY RANGOS V3 — módulo aislado y seguro ===== */
(function(){
  const DEFAULT_RANKS=[
    {id:'cliente',name:'Cliente',icon:'🟢',description:'Tu rango de acceso inicial.',kind:'free',price:0,duration:null,active:true,order:1,goal:0,discount:0,autoGrant:true,benefits:['Acceso al catálogo','Wallet','Soporte estándar']},
    {id:'frecuente',name:'Cliente Frecuente',icon:'🔵',description:'Recompensa por tu constancia de compra.',kind:'progress',price:0,duration:null,active:true,order:2,goal:10,discount:0,autoGrant:true,benefits:['Beneficios de fidelidad','Promociones exclusivas','Prioridad moderada en soporte']},
    {id:'distribuidor',name:'Distribuidor',icon:'🟣',description:'Precios especiales y herramientas para vender.',kind:'paid',price:25,duration:60,active:true,order:3,goal:0,discount:40,autoGrant:true,benefits:['Hasta 40% de descuento','Panel personal de distribuidor','Soporte prioritario','Herramientas de venta']},
    {id:'vip',name:'VIP',icon:'👑',description:'El nivel premium para obtener el máximo de beneficios.',kind:'paid',price:50,duration:30,active:true,order:4,goal:0,discount:40,discountMode:'percent',discountProducts:'all',referralEnabled:true,autoGrant:true,benefits:['Hasta 40% de descuento','Panel personal de ventas','Sistema de referidos','Acceso a ruleta de premios','Atención prioritaria y directa con el administrador','Promociones exclusivas','Acceso anticipado']}
  ];
  const LS='nexoplay_rank_config_v2',LP='nexoplay_rank_progress_v2',LN='nexoplay_rank_notifications_v2',LA='nexoplay_rank_audit_v3';
  let adminRankSubtab='overview';
  function esc(v){return typeof escapeHTML==='function'?escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function read(k,f){try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??f}catch(_){return f}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){} }
  function ranks(){let r=read(LS,null);if(!Array.isArray(r)||!r.length){r=DEFAULT_RANKS.map(x=>({...x,benefits:[...(x.benefits||[])]}));save(LS,r)}return r}
  function progress(){return read(LP,{})}
  function notifications(){return read(LN,[])}
  function audit(){return read(LA,[])}
  function currentUser(){return window.__nexoGetCurrentUser?.()||null}
  function username(u){return u?.user_metadata?.username||u?.user_metadata?.name||u?.email||'Usuario'}
  function getUserState(uid){const p=progress();return p[uid]||{purchases:0,rankId:'cliente',rankSince:null,rankExpires:null}}
  function rankIsExpired(r,st){return !!(st?.rankExpires&&new Date(st.rankExpires).getTime()<=Date.now()&&r?.kind==='paid')}
  function currentRank(){const rs=ranks(),u=currentUser();if(!u)return rs.find(x=>x.id==='cliente')||rs[0];const p=progress(),st=p[u.id]||{};let r=rs.find(x=>x.id===st.rankId)||rs.find(x=>x.id==='cliente')||rs[0];if(rankIsExpired(r,st)){p[u.id]={...st,rankId:'cliente',rankSince:new Date().toISOString(),rankExpires:null};save(LP,p);r=rs.find(x=>x.id==='cliente')||rs[0]}return r}
  function purchasesCount(){const u=currentUser();return u?Number(getUserState(u.id).purchases||0):0}
  function addNotification(data){const ns=notifications();ns.unshift({id:Date.now()+Math.random(),read:false,created_at:new Date().toISOString(),...data});save(LN,ns.slice(0,200));updateAdminRanksBadge()}
  function addAudit(action,data={}){const a=audit();a.unshift({id:Date.now()+Math.random(),created_at:new Date().toISOString(),action,...data});save(LA,a.slice(0,300))}
  function openRanks(){const bg=document.getElementById('nexoRanksBg');if(!bg)return;if(!currentUser()){showToast?.('Inicia sesión para consultar tus rangos.');openProfile?.();return}bg.classList.add('open');bg.style.display='flex';renderUserRanks()}
  function closeRanks(){const bg=document.getElementById('nexoRanksBg');if(bg){bg.classList.remove('open');bg.style.display='none'}}
  function nexoRanksOutside(e){if(e.target.id==='nexoRanksBg')closeRanks()}
  function renderUserRanks(){
    const hero=document.getElementById('npRanksHero'),grid=document.getElementById('npRanksGrid');if(!hero||!grid)return;
    const rs=ranks().filter(x=>x.active!==false).sort((a,b)=>(a.order||0)-(b.order||0)),cur=currentRank(),count=purchasesCount();
    const nextProgress=rs.filter(x=>x.kind==='progress'&&Number(x.goal||0)>count).sort((a,b)=>Number(a.goal)-Number(b.goal))[0]||null;const goal=Number(nextProgress?.goal||rs.find(x=>x.id==='frecuente')?.goal||10);const pct=Math.min(100,goal?Math.round(count/goal*100):100);
    const st=currentUser()?getUserState(currentUser().id):{};const exp=st.rankExpires?new Date(st.rankExpires):null;
    hero.innerHTML=`<div class="np-rank-command"><div class="np-rank-current"><div class="np-current-kicker">TU RANGO ACTUAL</div><div class="np-current-row"><div class="np-current-orb">${esc(cur.icon||'🏆')}</div><div><div class="np-current-name">${esc(cur.name)}</div><div class="np-current-meta">${esc(cur.description||'')} ${exp?`· vence ${exp.toLocaleDateString('es-PE')}`:''}</div><span class="np-rank-status">● ${exp?'Activo hasta '+exp.toLocaleDateString('es-PE'):'Activo'}</span></div></div></div><div class="np-rank-progress"><div class="np-current-kicker">PROGRESO DE FIDELIDAD</div><div class="np-progress-big">${count} / ${goal} compras</div><div class="np-progress-track"><div class="np-progress-bar" style="width:${pct}%"></div></div><div class="np-progress-copy"><span>${pct>=100?'Meta alcanzada 🎉':'Sigue comprando para avanzar'}</span><span>${pct}%</span></div><div class="np-next-box">${nextProgress?`Siguiente desbloqueo: <b>${esc(nextProgress.name)}</b> al llegar a <b>${Number(nextProgress.goal)} compras</b>.`:'🎉 Ya alcanzaste la meta de fidelidad configurada.'}</div></div></div>`;
    grid.innerHTML=rs.map(r=>{const isCurrent=r.id===cur.id,isPaid=r.kind==='paid',unlocked=r.kind!=='progress'||count>=Number(r.goal||0);let badge=isCurrent?'<span class="np-card-badge current">Tu rango</span>':r.id==='vip'?'<span class="np-card-badge">Premium</span>':'';let action='';if(isCurrent)action='<button class="np-rank-btn" disabled>✓ Rango actual</button>';else if(r.kind==='progress')action=`<button class="np-rank-btn ${unlocked?'primary':''}" ${unlocked?'':'disabled'} onclick="nexoClaimProgressRank('${esc(r.id)}')">${unlocked?'🎉 Desbloquear':'🔒 '+Math.max(0,Number(r.goal||0)-count)+' compras restantes'}</button>`;else if(isPaid)action=`<button class="np-rank-btn ${r.id==='vip'?'gold':'primary'}" onclick="nexoBuyRank('${esc(r.id)}')">Adquirir por ${Number(r.price||0)} saldo</button>`;else action='<button class="np-rank-btn" disabled>No disponible</button>';return `<article class="np-rank-card ${isCurrent?'current':''} ${r.id==='vip'?'featured':''} ${!unlocked?'locked':''}"><div class="np-card-top"><div class="np-rank-icon">${esc(r.icon||'🏆')}</div>${badge}</div><h3>${esc(r.name)}</h3><p>${esc(r.description||'')}</p><div class="np-rank-price">${isPaid?`${Number(r.price||0)} saldo`:'Gratis'}</div><div class="np-rank-duration">${isPaid?`Activo por ${Number(r.duration||0)} días`:'Permanente'}${Number(r.discount||0)>0?` · ${Number(r.discount)}% descuento`:''}</div><ul class="np-benefits">${(r.benefits||[]).slice(0,6).map(b=>`<li>${esc(b)}</li>`).join('')}</ul>${action}</article>`}).join('');
  }
  async function nexoBuyRank(id){
    const r=ranks().find(x=>x.id===id);if(!r||r.kind!=='paid'||r.active===false)return;const u=currentUser();if(!u){showToast?.('Inicia sesión primero.');return}
    const st=getUserState(u.id);if(st.rankId===r.id&&!rankIsExpired(r,st)){showToast?.('Ya tienes este rango activo.');return}
    if(typeof requestPurchasePin!=='function'){showToast?.('El PIN de compra no está disponible.');return}const pin=await requestPurchasePin();if(!pin)return;
    try{const sb=window.__nexoGetSupabase?.();if(!sb)throw new Error('Supabase no está disponible.');if(typeof verifyPurchasePin==='function'&&!await verifyPurchasePin(pin))throw new Error('PIN incorrecto.');const {data,error}=await sb.rpc('wallet_spend_v1',{p_amount:Number(r.price),p_description:`Adquisición de rango ${r.name}`});if(error)throw error;const row=Array.isArray(data)?data[0]:data;if(row&&row.ok===false)throw new Error(row.message||'No se pudo completar el pago.');const p=progress();p[u.id]={...getUserState(u.id),rankId:r.id,rankSince:new Date().toISOString(),rankExpires:r.duration?new Date(Date.now()+Number(r.duration)*86400000).toISOString():null};save(LP,p);addNotification({type:'purchase',rankId:r.id,rankName:r.name,username:username(u),userId:u.id,amount:r.price,message:`${username(u)} adquirió ${r.name}.`});addAudit('purchase',{userId:u.id,rankId:r.id,rankName:r.name,amount:r.price});showToast?.(`¡${r.name} adquirido correctamente!`);renderUserRanks();if(typeof applyCatalogTools==='function')applyCatalogTools();if(typeof updateCart==='function')updateCart()}catch(e){showToast?.(e?.message||'No se pudo adquirir el rango.');}
  }
  function nexoClaimProgressRank(id){const r=ranks().find(x=>x.id===id),u=currentUser();if(!r||!u||r.kind!=='progress'||purchasesCount()<Number(r.goal||10))return;const p=progress();p[u.id]={...getUserState(u.id),rankId:r.id,rankSince:new Date().toISOString(),rankExpires:null};save(LP,p);addNotification({type:'unlock',rankId:r.id,rankName:r.name,username:username(u),userId:u.id,amount:0,message:`${username(u)} desbloqueó ${r.name} automáticamente.`});addAudit('unlock',{userId:u.id,rankId:r.id,rankName:r.name});showToast?.(`¡Rango ${r.name} desbloqueado!`);renderUserRanks();if(typeof applyCatalogTools==='function')applyCatalogTools();if(typeof updateCart==='function')updateCart()}
  function autoUnlockProgress(u){if(!u)return;const rs=ranks(),p=progress(),st=getUserState(u.id),eligible=rs.filter(r=>r.active!==false&&r.kind==='progress'&&Number(st.purchases||0)>=Number(r.goal||0)).sort((a,b)=>Number(b.goal||0)-Number(a.goal||0))[0];if(eligible&&eligible.id!==st.rankId){p[u.id]={...st,rankId:eligible.id,rankSince:new Date().toISOString(),rankExpires:null};save(LP,p);addNotification({type:'auto_unlock',rankId:eligible.id,rankName:eligible.name,username:username(u),userId:u.id,message:`${username(u)} alcanzó ${eligible.goal} compras y recibió ${eligible.name}.`});addAudit('auto_unlock',{userId:u.id,rankId:eligible.id,rankName:eligible.name});showToast?.(`🎉 ${eligible.name} desbloqueado automáticamente`);return true}return false}
  function recordSuccessfulPurchase(){const u=currentUser();if(!u)return;const p=progress(),st=getUserState(u.id);p[u.id]={...st,purchases:Number(st.purchases||0)+1};save(LP,p);autoUnlockProgress(u);renderUserRanks()}
  function setRankTabNav(){document.querySelectorAll('.admin-nav button[id^="adminNav"]').forEach(b=>b.classList.remove('active'));document.getElementById('adminNavRanks')?.classList.add('active')}
  function rankTypeLabel(r){return r.kind==='paid'?'Compra con Wallet':r.kind==='progress'?'Por progreso':'Gratis'}
  function rankCountUsers(id){return Object.values(progress()).filter(x=>x.rankId===id).length}
  function renderAdminRanks(){
    const root=document.getElementById('adminRanksRoot');if(!root)return;const rs=ranks().sort((a,b)=>(a.order||0)-(b.order||0)),ns=notifications(),ps=progress(),activeUsers=Object.values(ps).filter(x=>x.rankId&&x.rankId!=='cliente').length,unread=ns.filter(x=>!x.read).length;
    root.innerHTML=`<div class="np-admin-shell"><div class="np-admin-hero"><div class="np-admin-banner"><div class="eyebrow">MEMBERSHIP CONTROL CENTER</div><h3>🏆 Control de Rangos</h3><p>Este espacio administra exclusivamente membresías: configuración, reglas, usuarios, adquisiciones, desbloqueos automáticos y auditoría. No es un duplicado del Resumen.</p><div class="np-admin-actions"><button class="admin-btn primary" onclick="nexoNewRank()">＋ Crear nuevo rango</button><button class="admin-btn" onclick="renderAdminRanks()">↻ Actualizar</button></div></div><div class="np-admin-quick"><div class="np-admin-quick-card"><span>Próxima revisión</span><b>${unread} 🔔</b></div><div class="np-admin-quick-card"><span>Rango más usado</span><b>${rs.sort((a,b)=>rankCountUsers(b.id)-rankCountUsers(a.id))[0]?.name||'Cliente'}</b></div></div></div><div class="np-admin-metric"><div><span>Rangos configurados</span><b>${rs.length}</b></div><div><span>Usuarios con rango</span><b>${activeUsers}</b></div><div><span>Notificaciones</span><b>${unread}</b></div><div><span>Adquiribles</span><b>${rs.filter(x=>x.kind==='paid'&&x.active!==false).length}</b></div></div><div class="np-admin-workspace"><div class="np-admin-tabs"><button class="${adminRankSubtab==='overview'?'active':''}" onclick="nexoAdminSubtab('overview')">🎛️ Control</button><button class="${adminRankSubtab==='ranks'?'active':''}" onclick="nexoAdminSubtab('ranks')">🏆 Rangos</button><button class="${adminRankSubtab==='users'?'active':''}" onclick="nexoAdminSubtab('users')">👥 Usuarios</button><button class="${adminRankSubtab==='notifications'?'active':''}" onclick="nexoAdminSubtab('notifications')">🔔 Notificaciones ${unread?`<span class="sales-badge">${unread}</span>`:''}</button><button class="${adminRankSubtab==='audit'?'active':''}" onclick="nexoAdminSubtab('audit')">🧾 Auditoría</button></div><div id="nexoAdminRankSubarea"></div></div></div>`;
    nexoAdminSubtab(adminRankSubtab)
  }
  function nexoAdminSubtab(tab){adminRankSubtab=tab;const c=document.getElementById('nexoAdminRankSubarea');if(!c)return;const rs=ranks();
    if(tab==='overview'){const paid=rs.filter(r=>r.kind==='paid'),progressRanks=rs.filter(r=>r.kind==='progress');c.innerHTML=`<div class="np-admin-panel"><div class="np-admin-panel-head"><div><h4>🎛️ Centro de control</h4><p>Decide cómo funciona el programa sin mezclarlo con inventario, ventas o catálogo.</p></div><button class="admin-btn primary" onclick="nexoNewRank()">＋ Nuevo rango</button></div><div class="np-admin-rank-list"><div class="np-admin-rank"><div class="np-admin-rank-name">💳 Rangos de pago</div><div class="np-admin-rank-sub">Se cobran con Wallet y pueden tener vencimiento.</div><div class="np-admin-rank-meta"><span class="np-admin-chip"><strong>${paid.length}</strong> configurados</span><span class="np-admin-chip"><strong>${paid.filter(r=>r.active!==false).length}</strong> activos</span></div><div class="np-admin-actions"><button class="primary" onclick="nexoAdminSubtab('ranks')">Administrar precios</button></div></div><div class="np-admin-rank"><div class="np-admin-rank-name">📈 Rangos por progreso</div><div class="np-admin-rank-sub">Se desbloquean según la cantidad de compras.</div><div class="np-admin-rank-meta"><span class="np-admin-chip"><strong>${progressRanks.length}</strong> configurados</span><span class="np-admin-chip">Desbloqueo automático: <strong>ON</strong></span></div><div class="np-admin-actions"><button class="primary" onclick="nexoAdminSubtab('ranks')">Administrar metas</button></div></div></div><div class="np-manual-box"><h5>🧠 Reglas inteligentes activas</h5><div class="np-admin-rank-meta"><span class="np-admin-chip">✓ Cuenta compras después de checkout</span><span class="np-admin-chip">✓ Desbloquea metas automáticamente</span><span class="np-admin-chip">✓ Registra compras de rangos</span><span class="np-admin-chip">✓ Control manual disponible</span><span class="np-admin-chip">✓ Historial de cambios</span></div></div></div>`;return}
    if(tab==='notifications'){const ns=notifications();c.innerHTML=`<div class="np-admin-panel"><div class="np-admin-panel-head"><div><h4>🔔 Centro de notificaciones</h4><p>Aquí te llegan las adquisiciones de rangos y los desbloqueos automáticos. Puedes revisarlos y marcar todo como leído.</p></div><div class="np-admin-actions"><button class="admin-btn" onclick="nexoMarkNotificationsRead()">✓ Marcar todo leído</button><button class="admin-btn danger" onclick="nexoClearNotifications()">Limpiar</button></div></div><div class="np-notification-list">${ns.length?ns.slice(0,80).map(n=>`<div class="np-notification ${n.read?'':'unread'}"><div><strong>${n.type==='purchase'?'💳':'🎉'} ${esc(n.message||`${n.rankName||'Rango'} registrado`)}</strong><small>${esc(n.username||'Usuario')} · ${n.created_at?new Date(n.created_at).toLocaleString('es-PE'):''}</small></div><div class="np-notification-right"><span class="np-pill ${n.type==='purchase'?'ok':'warn'}">${n.amount?Number(n.amount)+' saldo':'Automático'}</span><button class="admin-btn" onclick="nexoMarkNotificationRead('${esc(n.id)}')">${n.read?'✓':'Leer'}</button></div></div>`).join(''):'<div class="np-empty">No hay notificaciones todavía.</div>'}</div></div>`;return}
    if(tab==='users'){const p=progress(),entries=Object.entries(p);c.innerHTML=`<div class="np-admin-panel"><div class="np-admin-panel-head"><div><h4>👥 Usuarios y asignaciones</h4><p>Busca por UUID registrado por el sistema. Desde aquí puedes otorgar, revocar o cambiar manualmente un rango.</p></div></div><div class="np-user-search"><input id="nexoUserFilter" placeholder="Buscar UUID o rango…" oninput="nexoRenderUserTable()"><select id="nexoUserRankFilter" onchange="nexoRenderUserTable()"><option value="all">Todos los rangos</option>${rs.map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}</select></div><div id="nexoUserTableRoot"></div><div class="np-manual-box"><h5>🛠️ Asignación manual</h5><div class="np-manual-grid"><input id="nexoManualUid" placeholder="UUID del usuario"><select id="nexoManualRank">${rs.map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}</select><input id="nexoManualDays" type="number" min="0" placeholder="Días (0 = permanente)"><button class="admin-btn primary" onclick="nexoManualAssign()">Otorgar</button></div></div></div>`;nexoRenderUserTable();return}
    if(tab==='audit'){const a=audit();c.innerHTML=`<div class="np-admin-panel"><div class="np-admin-panel-head"><div><h4>🧾 Auditoría de rangos</h4><p>Registro local de compras, desbloqueos automáticos y cambios manuales realizados desde este panel.</p></div></div><div class="np-admin-log">${a.length?a.slice(0,100).map(x=>`<div class="np-log"><div><b>${esc(x.action)}</b><div>${esc(x.rankName||x.rankId||'')} ${x.username?'· '+esc(x.username):''}</div></div><span>${x.created_at?new Date(x.created_at).toLocaleString('es-PE'):''}</span></div>`).join(''):'<div class="np-empty">Todavía no hay movimientos.</div>'}</div></div>`;return}
    c.innerHTML=`<div class="np-admin-panel"><div class="np-admin-panel-head"><div><h4>🏆 Configuración de rangos</h4><p>Cada rango tiene su propia tarjeta de administración. Edita precio, duración, meta, descuento y beneficios sin tocar el resto del panel.</p></div><div class="np-admin-actions"><button class="admin-btn primary" onclick="nexoNewRank()">＋ Crear rango</button><button class="admin-btn" onclick="nexoExportRankConfig()">⬇️ Backup</button><label class="admin-btn" style="display:inline-flex;align-items:center;cursor:pointer">⬆️ Importar<input type="file" accept="application/json" onchange="nexoImportRankConfig(this)" style="display:none"></label></div></div><div class="np-admin-toolbar2"><input id="nexoRankSearch" placeholder="Buscar rango…" oninput="nexoRenderRankCards()"><select id="nexoRankKindFilter" onchange="nexoRenderRankCards()"><option value="all">Todos los tipos</option><option value="free">Gratis</option><option value="progress">Por progreso</option><option value="paid">Compra con Wallet</option></select></div><div id="nexoRankCardsRoot"></div></div>`;nexoRenderRankCards();
  }
  function nexoRenderRankCards(){const c=document.getElementById('nexoRankCardsRoot');if(!c)return;const q=(document.getElementById('nexoRankSearch')?.value||'').toLowerCase(),kind=document.getElementById('nexoRankKindFilter')?.value||'all';const rs=ranks().filter(r=>(kind==='all'||r.kind===kind)&&(!q||(`${r.name} ${r.description}`.toLowerCase().includes(q)))).sort((a,b)=>(a.order||0)-(b.order||0));c.innerHTML=`<div class="np-admin-rank-list">${rs.map(r=>`<article class="np-admin-rank"><div class="np-admin-rank-top"><div><div class="np-admin-rank-name">${esc(r.icon||'🏆')} ${esc(r.name)}</div><div class="np-admin-rank-sub">${esc(rankTypeLabel(r))} · ${r.kind==='paid'?`${Number(r.price||0)} saldo · ${Number(r.duration||0)} días`:r.kind==='progress'?`Meta ${Number(r.goal||0)} compras`:'Permanente'}</div></div><span class="np-pill ${r.active!==false?'ok':'warn'}">${r.active!==false?'Activo':'Inactivo'}</span></div><div class="np-admin-rank-meta"><span class="np-admin-chip"><strong>${rankCountUsers(r.id)}</strong> usuarios</span><span class="np-admin-chip"><strong>${Number(r.discount||0)}%</strong> descuento</span><span class="np-admin-chip">Auto: <strong>${r.autoGrant!==false?'ON':'OFF'}</strong></span></div><div class="np-admin-actions"><button class="primary" onclick="nexoEditRank('${esc(r.id)}')">⚙️ Administrar</button><button onclick="nexoToggleRank('${esc(r.id)}')">${r.active!==false?'⏸️ Desactivar':'▶️ Activar'}</button><button onclick="nexoDuplicateRank('${esc(r.id)}')">⧉ Duplicar</button>${!['cliente','frecuente','distribuidor','vip'].includes(r.id)?`<button class="danger" onclick="nexoDeleteRank('${esc(r.id)}')">🗑️ Eliminar</button>`:''}</div><div id="nexoEditor_${esc(r.id)}" class="np-rank-editor"></div></article>`).join('')||'<div class="np-empty">No hay rangos con ese filtro.</div>'}</div>`}
  function nexoEditRank(id){const r=ranks().find(x=>x.id===id),el=document.getElementById('nexoEditor_'+id);if(!r||!el)return;el.classList.toggle('open');if(!el.classList.contains('open'))return;el.innerHTML=`<div class="np-form-grid"><div><label>Nombre</label><input id="nre_name_${id}" value="${esc(r.name)}"></div><div><label>Icono</label><input id="nre_icon_${id}" value="${esc(r.icon||'🏆')}"></div><div class="np-form-full"><label>Descripción</label><textarea id="nre_desc_${id}">${esc(r.description||'')}</textarea></div><div><label>Tipo de adquisición</label><select id="nre_kind_${id}"><option value="free" ${r.kind==='free'?'selected':''}>Gratis</option><option value="progress" ${r.kind==='progress'?'selected':''}>Por progreso</option><option value="paid" ${r.kind==='paid'?'selected':''}>Compra con Wallet</option></select></div><div><label>Precio en saldo</label><input id="nre_price_${id}" type="number" min="0" step="0.01" value="${Number(r.price||0)}"></div><div><label>Duración en días</label><input id="nre_duration_${id}" type="number" min="0" value="${Number(r.duration||0)}"></div><div><label>Meta de compras</label><input id="nre_goal_${id}" type="number" min="0" value="${Number(r.goal||0)}"></div><div><label>Orden de aparición</label><input id="nre_order_${id}" type="number" min="0" value="${Number(r.order||0)}"></div><div><label>Descuento %</label><input id="nre_discount_${id}" type="number" min="0" max="100" value="${Number(r.discount||0)}"></div><div class="np-form-full"><label>Beneficios, uno por línea</label><textarea id="nre_benefits_${id}">${esc((r.benefits||[]).join('\n'))}</textarea></div><div class="np-form-full np-checks"><label class="np-check"><input id="nre_auto_${id}" type="checkbox" ${r.autoGrant!==false?'checked':''}>Desbloqueo automático</label><label class="np-check"><input id="nre_visible_${id}" type="checkbox" ${r.visible!==false?'checked':''}>Visible al cliente</label></div></div><div class="np-admin-actions"><button class="primary" onclick="nexoSaveRank('${esc(id)}')">💾 Guardar cambios</button><button onclick="nexoEditRank('${esc(id)}')">Cerrar</button></div>`}
  function nexoSaveRank(id){const rs=ranks(),r=rs.find(x=>x.id===id);if(!r)return;const g=k=>document.getElementById(k);r.name=g('nre_name_'+id)?.value.trim()||r.name;r.icon=g('nre_icon_'+id)?.value.trim()||r.icon;r.description=g('nre_desc_'+id)?.value.trim()||'';r.kind=g('nre_kind_'+id)?.value||r.kind;r.price=Number(g('nre_price_'+id)?.value||0);r.duration=Number(g('nre_duration_'+id)?.value||0)||null;r.goal=Number(g('nre_goal_'+id)?.value||0);r.order=Number(g('nre_order_'+id)?.value||r.order||0);r.discount=Math.min(100,Math.max(0,Number(g('nre_discount_'+id)?.value||0)));r.benefits=(g('nre_benefits_'+id)?.value||'').split('\n').map(x=>x.trim()).filter(Boolean);r.autoGrant=!!g('nre_auto_'+id)?.checked;r.visible=!!g('nre_visible_'+id)?.checked;save(LS,rs);addAudit('update',{rankId:r.id,rankName:r.name});renderAdminRanks();showToast?.('Rango actualizado correctamente.')}
  function nexoToggleRank(id){const rs=ranks(),r=rs.find(x=>x.id===id);if(!r)return;r.active=r.active===false;save(LS,rs);addAudit(r.active?'activate':'deactivate',{rankId:r.id,rankName:r.name});renderAdminRanks();showToast?.(r.active?'Rango activado.':'Rango desactivado.')}
  function nexoDuplicateRank(id){const rs=ranks(),r=rs.find(x=>x.id===id);if(!r)return;const copy={...r,id:'rank-'+Date.now(),name:r.name+' — Copia',order:Math.max(...rs.map(x=>Number(x.order||0)))+1,benefits:[...(r.benefits||[])]};save(LS,[...rs,copy]);addAudit('duplicate',{rankId:copy.id,rankName:copy.name});renderAdminRanks();showToast?.('Rango duplicado. Ahora puedes configurarlo.')}
  function nexoDeleteRank(id){if(['cliente','frecuente','distribuidor','vip'].includes(id))return;if(!confirm('¿Eliminar este rango?'))return;const rs=ranks().filter(x=>x.id!==id);save(LS,rs);addAudit('delete',{rankId:id});renderAdminRanks();showToast?.('Rango eliminado.')}
  function nexoNewRank(){const rs=ranks(),r={id:'rank-'+Date.now(),name:'Nuevo rango',icon:'🏅',description:'Configura este nuevo nivel de membresía.',kind:'free',price:0,duration:null,active:true,visible:true,autoGrant:true,order:Math.max(...rs.map(x=>Number(x.order||0)))+1,goal:0,discount:0,benefits:['Beneficio personalizado']};save(LS,[...rs,r]);addAudit('create',{rankId:r.id,rankName:r.name});renderAdminRanks();setTimeout(()=>{adminRankSubtab='ranks';nexoAdminSubtab('ranks');setTimeout(()=>nexoEditRank(r.id),50)},30)}
  const nexoProfileCache=new Map();
  async function nexoLoadUserProfiles(ids){if(!supabaseClient||!ids.length)return;const missing=ids.filter(id=>!nexoProfileCache.has(String(id)));if(!missing.length)return;try{const {data,error}=await supabaseClient.from('profiles').select('id,username').in('id',missing);if(!error)(data||[]).forEach(u=>nexoProfileCache.set(String(u.id),u.username||''))}catch(_){} }
  async function nexoRenderUserTable(){const c=document.getElementById('nexoUserTableRoot');if(!c)return;const p=progress(),entries=Object.entries(p),rs=ranks(),q=(document.getElementById('nexoUserFilter')?.value||'').toLowerCase().trim(),rf=document.getElementById('nexoUserRankFilter')?.value||'all';await nexoLoadUserProfiles(entries.map(([uid])=>uid));const filtered=entries.filter(([uid,x])=>{const rn=rs.find(r=>r.id===x.rankId)?.name||'Cliente',un=nexoProfileCache.get(String(uid))||'';return (!q||uid.toLowerCase().includes(q)||rn.toLowerCase().includes(q)||un.toLowerCase().includes(q))&&(rf==='all'||x.rankId===rf)});c.innerHTML=`<div class="np-user-table"><table><thead><tr><th>Usuario</th><th>Rango</th><th>Compras</th><th>Desde</th><th>Vencimiento</th><th>Acciones</th></tr></thead><tbody>${filtered.length?filtered.map(([uid,x])=>{const r=rs.find(z=>z.id===x.rankId)||rs[0],un=nexoProfileCache.get(String(uid))||'';return `<tr><td title="${esc(uid)}"><strong>${un?'@'+esc(un):'@Sin usuario'}</strong><br><span style="font-size:8px;color:#6f7888">ID: ${esc(uid.slice(0,12))}…</span></td><td>${esc(r?.icon||'🏆')} ${esc(r?.name||'Cliente')}</td><td>${Number(x.purchases||0)}</td><td>${x.rankSince?new Date(x.rankSince).toLocaleDateString('es-PE'):'—'}</td><td>${x.rankExpires?new Date(x.rankExpires).toLocaleDateString('es-PE'):'Permanente'}</td><td><div style="display:flex;gap:5px;flex-wrap:wrap"><button class="admin-btn" onclick="nexoQuickAssign('${esc(uid)}')">Cambiar</button><button class="admin-btn danger" onclick="nexoRevokeRank('${esc(uid)}')">Revocar</button><button class="admin-btn" onclick="nexoResetPurchases('${esc(uid)}')">↺ Compras</button></div></td></tr>`}).join(''):'<tr><td colspan="6"><div class="np-empty">No hay asignaciones locales registradas todavía.</div></td></tr>'}</tbody></table></div>`}
  function nexoQuickAssign(uid){document.getElementById('nexoManualUid').value=uid;document.getElementById('nexoManualUid').focus()}
  function nexoManualAssign(){const uid=document.getElementById('nexoManualUid')?.value.trim(),rid=document.getElementById('nexoManualRank')?.value,days=Number(document.getElementById('nexoManualDays')?.value||0);if(!uid||!rid){showToast?.('Indica UUID y rango.');return}const r=ranks().find(x=>x.id===rid);if(!r)return;const p=progress(),old=getUserState(uid);p[uid]={...old,rankId:rid,rankSince:new Date().toISOString(),rankExpires:days>0?new Date(Date.now()+days*86400000).toISOString():null};save(LP,p);addNotification({type:'manual',rankId:rid,rankName:r.name,username:uid.slice(0,12)+'…',userId:uid,amount:0,message:`Asignación manual: ${r.name}.`});addAudit('manual_assign',{userId:uid,rankId:rid,rankName:r.name});showToast?.('Rango otorgado manualmente.');nexoRenderUserTable();updateAdminRanksBadge()}
  function nexoRevokeRank(uid){const p=progress(),st=p[uid];if(!st)return;const oldRank=ranks().find(r=>r.id===st.rankId);p[uid]={...st,rankId:'cliente',rankSince:new Date().toISOString(),rankExpires:null};save(LP,p);addNotification({type:'manual_revoke',rankName:oldRank?.name||'Rango',username:uid.slice(0,12)+'…',userId:uid,amount:0,message:`Se revocó manualmente el rango ${oldRank?.name||'asignado'}.`});addAudit('manual_revoke',{userId:uid,rankId:oldRank?.id,rankName:oldRank?.name});showToast?.('Rango revocado.');nexoRenderUserTable();updateAdminRanksBadge()}
  function nexoResetPurchases(uid){const p=progress(),st=p[uid];if(!st)return;if(!confirm('¿Restablecer el contador de compras de este usuario?'))return;p[uid]={...st,purchases:0};save(LP,p);addAudit('reset_purchases',{userId:uid});showToast?.('Contador de compras restablecido.');nexoRenderUserTable()}
  function nexoExportRankConfig(){const payload={version:3,exported_at:new Date().toISOString(),ranks:ranks(),progress:progress(),notifications:notifications(),audit:audit()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nexoplay-rangos-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);showToast?.('Backup de rangos exportado.')}
  function nexoImportRankConfig(input){const file=input?.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!Array.isArray(data.ranks))throw new Error('El archivo no contiene una configuración válida.');save(LS,data.ranks);if(data.progress&&typeof data.progress==='object')save(LP,data.progress);if(Array.isArray(data.notifications))save(LN,data.notifications);if(Array.isArray(data.audit))save(LA,data.audit);renderAdminRanks();updateAdminRanksBadge();showToast?.('Configuración de rangos importada correctamente.')}catch(e){showToast?.(e.message||'No se pudo importar el backup.')}};reader.readAsText(file);input.value=''}
  function nexoMarkNotificationsRead(){const ns=notifications().map(n=>({...n,read:true}));save(LN,ns);renderAdminRanks();}
  function nexoMarkNotificationRead(id){const ns=notifications().map(n=>String(n.id)===String(id)?{...n,read:true}:n);save(LN,ns);nexoAdminSubtab('notifications');updateAdminRanksBadge()}
  function nexoClearNotifications(){if(!confirm('¿Limpiar todas las notificaciones?'))return;save(LN,[]);renderAdminRanks();}
  function updateAdminRanksBadge(){const b=document.getElementById('adminRanksBadge');if(b)b.textContent=String(notifications().filter(x=>!x.read).length)}
  window.openRanks=openRanks;window.closeRanks=closeRanks;window.nexoRanksOutside=nexoRanksOutside;window.nexoBuyRank=nexoBuyRank;window.nexoClaimProgressRank=nexoClaimProgressRank;window.renderAdminRanks=renderAdminRanks;window.nexoAdminSubtab=nexoAdminSubtab;window.nexoEditRank=nexoEditRank;window.nexoSaveRank=nexoSaveRank;window.nexoToggleRank=nexoToggleRank;window.nexoDuplicateRank=nexoDuplicateRank;window.nexoDeleteRank=nexoDeleteRank;window.nexoNewRank=nexoNewRank;window.nexoRenderRankCards=nexoRenderRankCards;window.nexoRenderUserTable=nexoRenderUserTable;window.nexoQuickAssign=nexoQuickAssign;window.nexoManualAssign=nexoManualAssign;window.nexoRevokeRank=nexoRevokeRank;window.nexoResetPurchases=nexoResetPurchases;window.nexoExportRankConfig=nexoExportRankConfig;window.nexoImportRankConfig=nexoImportRankConfig;window.nexoMarkNotificationsRead=nexoMarkNotificationsRead;window.nexoMarkNotificationRead=nexoMarkNotificationRead;window.nexoClearNotifications=nexoClearNotifications;window.updateAdminRanksBadge=updateAdminRanksBadge;
  const oldSet=window.setAdminNavActive;window.setAdminNavActive=function(tab){if(typeof oldSet==='function')oldSet(tab);if(tab==='ranks')setRankTabNav()};
  const oldSwitch=window.switchAdminTab;window.switchAdminTab=function(tab){if(tab==='ranks'){adminSalesTab='ranks';setAdminNavActive('ranks');document.querySelectorAll('.admin-view').forEach(v=>v.classList.remove('active'));document.getElementById('adminRanksSection')?.classList.add('active');adminRankSubtab='overview';renderAdminRanks();updateAdminRanksBadge();return}if(typeof oldSwitch==='function')oldSwitch(tab)};
  const oldCheckout=window.checkout;if(typeof oldCheckout==='function'&&!oldCheckout.__nexoRankWrapped){const wrappedCheckout=async function(){const before=getLocalOrdersForCurrentUser().length;const result=await oldCheckout.apply(this,arguments);try{const after=getLocalOrdersForCurrentUser().length;if(after>before)recordSuccessfulPurchase()}catch(_){}return result};wrappedCheckout.__nexoRankWrapped=true;window.checkout=wrappedCheckout}
  updateAdminRanksBadge();
})();



(function(){
  const DIST_RANK='distribuidor';
  const ORDERS_KEY='nexoplay_orders';
  const CUSTOMER_KEY='nexoplay_distributor_customer_v1';
  let distributorSales=[];
  function user(){return window.__nexoGetCurrentUser?.()||null}
  function esc(v){return typeof escapeHTML==='function'?escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function getRankState(){const u=user();if(!u)return null;try{const p=JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}');return p[u.id]||null}catch(_){return null}}
  function isDistributor(){const st=getRankState();if(!st||st.rankId!==DIST_RANK)return false;if(st.rankExpires&&new Date(st.rankExpires).getTime()<=Date.now())return false;return true}
  function isVIP(){const st=getRankState();if(!st||st.rankId!=='vip')return false;if(st.rankExpires&&new Date(st.rankExpires).getTime()<=Date.now())return false;return true}
  function isBusiness(){return isDistributor()||isVIP()}
  function distCustomer(){try{return JSON.parse(localStorage.getItem(CUSTOMER_KEY)||'null')}catch(_){return null}}
  function saveCustomer(v){try{localStorage.setItem(CUSTOMER_KEY,JSON.stringify(v||{}))}catch(_){}
  }
  function getOrders(){try{return JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')}catch(_){return []}}
  function saveOrders(v){try{localStorage.setItem(ORDERS_KEY,JSON.stringify(v))}catch(_){}
  }
  function distOrders(){const u=user();if(!u)return [];return getOrders().filter(o=>o?.ownerUserId===u.id&&o?.distributorCustomer)}
  function normalizePhone(v){return String(v||'').replace(/\D/g,'')}
  function waNumber(v){let n=normalizePhone(v);if(n.startsWith('9')&&n.length===9)n='51'+n;return n}
  function openWhatsApp(phone,msg){const n=waNumber(phone);if(!n){showToast?.('Número de WhatsApp no válido.');return}window.open('https://wa.me/'+n+'?text='+encodeURIComponent(msg),'_blank')}
  function accountMessage(s){const c=s.distributorCustomer||{};return `Hola ${c.name||'\u{1F44B}'} \u{1F60A}\n\nTe entrego los datos de tu cuenta NexoPlay:\n\n\u{1F4E6} Producto: ${saleText(s)}\n\u{1F4E7} Correo: ${s.deliveryEmail||'Pendiente'}\n\u{1F511} Contraseña: ${s.deliveryPassword||'Pendiente'}\n\u{1F464} Perfil: ${s.deliveryProfile||'-'}\n\u{1F522} PIN: ${s.deliveryPin||'-'}\n\u{1F4C5} Vencimiento: ${s.deliveryExpire||'Pendiente'}\n\nGracias por tu compra. \u{2764}\u{FE0F}`}
  function expiryMessage(s){const c=s.distributorCustomer||{};return `Hola ${c.name||'\u{1F44B}'} \u{1F60A}\n\n\u{23F3} Recordatorio NexoPlay\nTu cuenta ${saleText(s)} vence el ${s.deliveryExpire||'próximamente'}.\n\nSi deseas renovarla, comunícate con tu distribuidor. \u{2764}\u{FE0F}`}
  function saleText(s){const items=Array.isArray(s.items)?s.items:[];return items.map(x=>x.name||'Producto').join(', ')||'Cuenta digital'}
  function injectCheckoutBox(){let box=document.getElementById('distributorCheckoutBox');if(!box)return;if(!isBusiness()){box.style.display='none';box.innerHTML='';return}box.style.display='block';if(document.getElementById('distCustomerName')&&document.getElementById('distCustomerPhone'))return;const c=distCustomer()||{};box.innerHTML=`<div class="distributor-checkout-head"><strong>👤 Datos del cliente</strong><span>Distribuidor · VIP</span></div><div class="distributor-field"><label>Nombre del cliente</label><input id="distCustomerName" maxlength="80" placeholder="Ej. Juan Pérez" value="${esc(c.name||'')}"></div><div class="distributor-field"><label>📱 WhatsApp del cliente</label><input id="distCustomerPhone" maxlength="20" inputmode="tel" placeholder="9XXXXXXXX" value="${esc(c.phone||'')}"></div><div class="distributor-field"><label>💰 Monto vendido</label><input id="distSaleAmount" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="Ej. 25.00" value="${esc(c.saleAmount||'')}"></div><div class="distributor-summary">💡 El monto vendido es lo que tú cobraste a tu cliente. Se usará para calcular tu <b>Total vendido</b> en el Panel de ventas.</div>`}
  function styleCheckout(){const ids=['payYapeOption','payPlinOption','yapePaymentCard','plinPaymentCard','receiptInput'];ids.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display=isBusiness()?(id==='receiptInput'?'none':'none'):''});const wallet=document.getElementById('payWalletOption');if(wallet)wallet.style.display=isBusiness()?'block':'';if(isBusiness()){const radio=document.querySelector('input[name="checkoutMethod"][value="wallet"]');if(radio){radio.checked=true;selectCheckoutMethod?.('wallet')}}const note=document.getElementById('orderNote');if(note&&isBusiness())note.innerHTML='📈 <b>Modo negocio:</b> compra con tu Wallet y registra los datos de tu cliente antes de confirmar.';injectCheckoutBox()}
  function validCustomer(){const name=document.getElementById('distCustomerName')?.value.trim()||'',phone=document.getElementById('distCustomerPhone')?.value.trim()||'',saleAmount=Number(document.getElementById('distSaleAmount')?.value||0);if(name.length<2){showToast?.('Escribe el nombre de tu cliente.');return null}if(normalizePhone(phone).length<9){showToast?.('Ingresa un WhatsApp válido para tu cliente.');return null}if(!(saleAmount>0)){showToast?.('Indica el monto vendido a tu cliente.');return null}const c={name,phone,saleAmount:Number(saleAmount.toFixed(2))};saveCustomer(c);return c}
  function refreshMenu(){const b=document.getElementById('distributorMenuBtn');if(b){b.style.display=isBusiness()?'block':'none';b.textContent=isVIP()?'📈 Panel de ventas VIP':'📈 Panel de ventas'}}
  function renderPanel(){const root=document.getElementById('distributorPanelContent');if(!root)return;if(!isBusiness()){root.innerHTML='<div class="distributor-empty">🔒 Este panel es exclusivo para usuarios con rango Distribuidor o VIP activo.</div>';return}const u=user(),orders=distOrders(),delivered=orders.filter(x=>x.deliveryStatus==='delivered').length,pending=orders.length-delivered,active=orders.filter(x=>x.deliveryStatus==='delivered'&&(!x.deliveryExpire||new Date(x.deliveryExpire)>=new Date())).length,total=orders.reduce((a,x)=>a+Number(x.distributorCustomer?.saleAmount||x.total||0),0),profileName=u?.user_metadata?.username||u?.user_metadata?.name||u?.email?.split('@')[0]||'Distribuidor';root.innerHTML=`<div class="distributor-hero"><div class="distributor-hero-card"><div class="eyebrow">CUENTA PROFESIONAL</div><h3>Vende con más control. 🚀</h3><p>Gestiona tus clientes, sigue tus entregas y envía los datos o recordatorios directamente por WhatsApp. Las ventas pendientes esperan tu cuenta asignada.</p><span class="distributor-status">● ${isVIP()?'VIP activo':'Distribuidor activo'}</span></div><div class="distributor-client-card"><h4>👤 Tu cuenta</h4><div class="mini-client"><div class="mini-client-avatar">🟣</div><div><div class="mini-client-name">@${esc(profileName)}</div><div class="mini-client-sub">${esc(u?.email||'')}<br>Rango ${isVIP()?'VIP':'Distribuidor'} · ${isVIP()?'40%':'40%'} descuento</div></div></div><div class="distributor-alert" style="margin-top:12px"><b>📌 Flujo:</b> compra → espera entrega → tú recibes los datos → envías a tu cliente.</div></div></div><div class="distributor-kpis"><div class="distributor-kpi"><span>Ventas</span><b>${orders.length}</b></div><div class="distributor-kpi"><span>Entregadas</span><b>${delivered}</b></div><div class="distributor-kpi"><span>Pendientes</span><b>${pending}</b></div><div class="distributor-kpi"><span>Total vendido</span><b>${money?.(total)||('S/ '+total.toFixed(2))}</b></div></div><div class="distributor-workspace"><div class="distributor-panel-card"><h4>👥 Mis clientes y ventas</h4><p>Busca por nombre, WhatsApp, pedido o producto.</p><input id="distributorSearch" class="distributor-search" placeholder="🔎 Buscar cliente…" oninput="window.renderDistributorPanel()"><div id="distributorSalesList" class="distributor-sales-list"></div></div><div class="distributor-panel-card"><h4>⚡ Acciones rápidas</h4><p>Accesos pensados para trabajar rápido.</p><div class="distributor-new-sale"><h5>🛒 Nueva venta</h5><p>Regresa al catálogo, selecciona la cuenta y el carrito te pedirá los datos de tu cliente automáticamente.</p><button onclick="closeDistributorPanel();document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'})">＋ Crear nueva venta</button></div><div class="distributor-new-sale" style="margin-top:9px"><h5>📦 Mis cuentas</h5><p>Consulta tus entregas y abre los datos disponibles para cada venta.</p><button onclick="window.renderDistributorPanel();document.getElementById('distributorSearch')?.focus()">Ver mis cuentas</button></div><div class="distributor-new-sale" style="margin-top:9px"><h5>🧾 Historial</h5><p>${orders.length} ventas registradas en este dispositivo.</p><button onclick="window.renderDistributorPanel()">↻ Actualizar</button></div></div></div>`;renderSalesList()}
  function renderSalesList(){const c=document.getElementById('distributorSalesList');if(!c)return;const q=(document.getElementById('distributorSearch')?.value||'').toLowerCase().trim();const list=distOrders().filter(s=>!q||`${s.id} ${s.distributorCustomer?.name||''} ${s.distributorCustomer?.phone||''} ${saleText(s)}`.toLowerCase().includes(q)).reverse();if(!list.length){c.innerHTML='<div class="distributor-empty">📦 Todavía no tienes ventas registradas.</div>';return}c.innerHTML=list.map(s=>{const d=s.deliveryStatus==='delivered';return `<div class="distributor-sale"><div class="distributor-sale-top"><div><strong>${esc(s.id)}</strong><div class="distributor-sale-meta">👤 ${esc(s.distributorCustomer?.name||'Cliente')} · 📱 ${esc(s.distributorCustomer?.phone||'—')}<br>${esc(saleText(s))} · ${esc(s.date||'')}</div></div><span class="distributor-sale-status ${d?'delivered':''}">${d?'✓ Entregada':'⏳ Pendiente'}</span></div><div class="distributor-sale-data"><div class="distributor-sale-row"><span>Compra NexoPlay</span><b>${money?.(s.total)||('S/ '+Number(s.total||0).toFixed(2))}</b></div><div class="distributor-sale-row highlight"><span>💰 Monto vendido</span><b>${money?.(s.distributorCustomer?.saleAmount||s.total)||('S/ '+Number(s.distributorCustomer?.saleAmount||s.total||0).toFixed(2))}</b></div><div class="distributor-sale-row"><span>Vencimiento</span><b>${esc(s.deliveryExpire||'Pendiente de entrega')}</b></div>${d?`<div class="distributor-sale-row"><span>Cuenta</span><b>${esc(s.deliveryEmail||'—')}</b></div>`:''}</div>${d?`<div class="distributor-sale-actions"><button class="wa" onclick="sendDistributorData('${esc(s.id)}')">📤 Enviar datos</button><button class="wa" onclick="sendDistributorReminder('${esc(s.id)}')">⏰ Recordar vencimiento</button><button class="copy" onclick="copyDistributorData('${esc(s.id)}')">📋 Copiar datos</button></div>`:'<div class="distributor-alert" style="margin-top:9px">⏳ <b>Esperando entrega.</b> El administrador debe asignar los datos de la cuenta antes de habilitar las acciones de WhatsApp.</div>'}</div>`}).join('')}
  window.renderDistributorPanel=()=>{renderPanel()};
  window.openDistributorPanel=()=>{if(!user()){showToast?.('Inicia sesión primero.');openProfile?.();return}if(!isBusiness()){showToast?.('El Panel de ventas es exclusivo para Distribuidores y VIP.');return}document.getElementById('distributorPanelBg')?.classList.add('open');renderPanel()};
  window.closeDistributorPanel=()=>document.getElementById('distributorPanelBg')?.classList.remove('open');
  window.distributorOutside=e=>{if(e.target.id==='distributorPanelBg')window.closeDistributorPanel()};
  window.closeDistributorSuccess=()=>document.getElementById('distributorSuccessBg')?.classList.remove('open');
  window.distributorSuccessOutside=e=>{if(e.target.id==='distributorSuccessBg')window.closeDistributorSuccess()};
  window.sendDistributorData=id=>{const s=distOrders().find(x=>String(x.id)===String(id));if(!s||s.deliveryStatus!=='delivered'){showToast?.('Los datos todavía no están disponibles.');return}openWhatsApp(s.distributorCustomer?.phone,accountMessage(s))};
  window.sendDistributorReminder=id=>{const s=distOrders().find(x=>String(x.id)===String(id));if(!s||s.deliveryStatus!=='delivered'){showToast?.('La cuenta todavía no está entregada.');return}openWhatsApp(s.distributorCustomer?.phone,expiryMessage(s))};
  window.copyDistributorData=async id=>{const s=distOrders().find(x=>String(x.id)===String(id));if(!s)return;try{await navigator.clipboard.writeText(accountMessage(s));showToast?.('Datos copiados.')}catch(_){showToast?.('No se pudo copiar automáticamente.')}};
  function hookCart(){const oldUpdate=window.updateCart;if(typeof oldUpdate==='function'&&!oldUpdate.__distWrapped){const wrapped=function(){oldUpdate.apply(this,arguments);setTimeout(()=>styleCheckout(),0)};wrapped.__distWrapped=true;window.updateCart=wrapped;setTimeout(styleCheckout,0)}
    const oldCheckout=window.checkout;if(typeof oldCheckout==='function'&&!oldCheckout.__distWrapped){const wrappedCheckout=async function(){if(!isBusiness())return oldCheckout.apply(this,arguments);const c=validCustomer();if(!c)return;const radio=document.querySelector('input[name="checkoutMethod"][value="wallet"]');if(radio){radio.checked=true;selectCheckoutMethod?.('wallet')}if(!currentUser){showToast?.('Inicia sesión para continuar.');return}if(!walletCache)await loadWalletData?.();const total=typeof cartTotal==='function'?cartTotal():0;const balance=Number(walletCache?.balance||0);if(balance<total){showToast?.(`Saldo insuficiente. Necesitas S/ ${total.toFixed(2)} y tienes S/ ${balance.toFixed(2)}.`);return}const before=new Set(getOrders().map(o=>o.id));await oldCheckout.apply(this,arguments);const orders=getOrders();const created=orders.filter(o=>!before.has(o.id)&&o.ownerUserId===currentUser.id).sort((a,b)=>String(b.id).localeCompare(String(a.id)))[0];if(created){created.distributorCustomer=c;created.deliveryStatus='pending';created.deliveryEmail=null;created.deliveryPassword=null;created.deliveryProfile=null;created.deliveryPin=null;created.deliveryExpire=null;const all=orders.map(o=>o.id===created.id?created:o);saveOrders(all);try{localStorage.setItem('nexoplay_last_distributor_sale',created.id)}catch(_){}document.getElementById('distributorSuccessText').textContent='Tu pedido '+created.id+' fue registrado. Puedes consultar el estado y los datos de tu cuenta desde tu Panel de ventas.';document.getElementById('distributorSuccessBg')?.classList.add('open');renderPanel()}};wrappedCheckout.__distWrapped=true;window.checkout=wrappedCheckout}
  }
  function syncDeliveryFromRemote(){const u=user();if(!u||!supabaseClient)return;const local=distOrders();if(!local.length)return;Promise.resolve().then(async()=>{try{const ids=local.map(x=>x.id);const {data}=await supabaseClient.from('nexoplay_orders').select('id,order_code,delivery_status,delivery_email,delivery_password,delivery_profile,delivery_pin,expiry_date').eq('user_id',u.id).in('order_code',ids);if(!Array.isArray(data))return;let orders=getOrders(),changed=false;data.forEach(r=>{const i=orders.findIndex(o=>String(o.id)===String(r.order_code));if(i<0)return;const next={...orders[i],deliveryStatus:r.delivery_status||orders[i].deliveryStatus,deliveryEmail:r.delivery_email||orders[i].deliveryEmail,deliveryPassword:r.delivery_password||orders[i].deliveryPassword,deliveryProfile:r.delivery_profile||orders[i].deliveryProfile,deliveryPin:r.delivery_pin||orders[i].deliveryPin,deliveryExpire:r.expiry_date||orders[i].deliveryExpire};if(JSON.stringify(next)!==JSON.stringify(orders[i])){orders[i]=next;changed=true}});if(changed){saveOrders(orders);if(document.getElementById('distributorPanelBg')?.classList.contains('open'))renderPanel()}}catch(_){}})}
  function init(){refreshMenu();hookCart();syncDeliveryFromRemote();const origInitAuth=window.initAuth;if(typeof origInitAuth==='function'&&!origInitAuth.__distRefresh){/* auth already initialized; polling keeps UI in sync without changing auth */setInterval(()=>{refreshMenu();styleCheckout();if(document.getElementById('distributorPanelBg')?.classList.contains('open'))syncDeliveryFromRemote()},1500)} }
  init();
})();



(function(){
  function user(){return window.__nexoGetCurrentUser?.()||null}
  function isDistributor(){const u=user();if(!u)return false;try{const p=JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}'),s=p[u.id];return !!s&&s.rankId==='distribuidor'&&(!s.rankExpires||new Date(s.rankExpires).getTime()>Date.now())}catch(_){return false}}
  const old=window.nexoBuyRank;
  if(typeof old==='function'&&!old.__safeWrapped){
    const wrapped=async function(id){
      try{
        let rs=[];try{rs=JSON.parse(localStorage.getItem('nexoplay_rank_config_v2')||'[]')}catch(_){rs=[]}
        const r=rs.find(x=>x.id===id);
        if(!r||r.kind!=='paid')return old.apply(this,arguments);
        if(!walletCache)await loadWalletData?.();
        const balance=Number(walletCache?.balance||0),price=Number(r.price||0);
        if(balance<price){
          showToast?.(`❌ Saldo insuficiente. Necesitas ${money?.(price)||('S/ '+price.toFixed(2))} y tienes ${money?.(balance)||('S/ '+balance.toFixed(2))}.`);
          return;
        }
        return old.apply(this,arguments);
      }catch(e){console.error('NexoPlay rank safety:',e);showToast?.('No se pudo validar el saldo. Inténtalo nuevamente.');}
    };wrapped.__safeWrapped=true;window.nexoBuyRank=wrapped;
  }
})();



(function(){
  const CFG='nexoplay_rank_product_discounts_v1', REF='nexoplay_vip_referral_ui_v1';
  const getCfg=()=>{try{return JSON.parse(localStorage.getItem(CFG)||'{}')}catch(_){return {}}};
  const setCfg=v=>localStorage.setItem(CFG,JSON.stringify(v));
  function ensureVipRankDefaults(){try{const key='nexoplay_vip_discount_migration_v2';if(localStorage.getItem(key)==='1')return;const rs=getRanks();const vip=rs.find(r=>r.id==='vip');if(vip&&Number(vip.discount||0)<=0){vip.discount=40;vip.discountMode='percent';vip.discountProducts='all';vip.referralEnabled=true;localStorage.setItem('nexoplay_rank_config_v2',JSON.stringify(rs));}localStorage.setItem(key,'1')}catch(_){}}
  const user=()=>window.__nexoGetCurrentUser?.()||null;
  const esc=v=>typeof escapeHTML==='function'?escapeHTML(String(v??'')):String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const getRanks=()=>{try{return JSON.parse(localStorage.getItem('nexoplay_rank_config_v2')||'[]')}catch(_){return []}};
  const getProgress=()=>{try{return JSON.parse(localStorage.getItem('nexoplay_rank_progress_v2')||'{}')}catch(_){return {}}};
  function state(){const u=user(),p=getProgress();return u?p[u.id]||{rankId:'cliente'}:null}
  function rank(){const st=state();return getRanks().find(r=>r.id===st?.rankId)||null}
  function isVIP(){const r=rank(),st=state();return r?.id==='vip'&&(!st?.rankExpires||new Date(st.rankExpires).getTime()>Date.now())}
  function isDist(){const r=rank(),st=state();return r?.id==='distribuidor'&&(!st?.rankExpires||new Date(st.rankExpires).getTime()>Date.now())}
  function isBusiness(){return isVIP()||isDist()}
  function activeProductIds(rankId){const cfg=getCfg();const r=cfg[rankId];return Array.isArray(r?.products)?r.products.map(Number):null}
  function discountRateForProduct(pi){const r=rank();if(!r)return 0;const ids=activeProductIds(r.id);if(ids&&ids.length&&!ids.includes(Number(pi)))return 0;return Math.min(100,Math.max(0,Number(r.discount||0)))/100}
  function frequentDollarDiscount(pi,price){const cfg=getCfg().frecuente||{};const ids=Array.isArray(cfg.products)?cfg.products.map(Number):[];return ids.includes(Number(pi))?Math.max(0,Number(price)-1):Number(price)}
  const oldEffective=window.effectiveProductPrice;
  window.effectiveProductPrice=function(value,pi){let n=Number(value||0);if(pi!==undefined&&pi!==null){const r=rank();if(r?.id==='frecuente'&&!isDist()&&!isVIP())return frequentDollarDiscount(pi,n);const d=discountRateForProduct(pi);return Math.max(0,n*(1-d))}return typeof oldEffective==='function'?oldEffective(value):n};
  const oldCombo=window.effectiveComboPrice;
  window.effectiveComboPrice=function(value){const n=Number(value||0);const r=rank();if(!r)return n;if(r.id==='frecuente')return n;const d=discountRateForProduct(-1);return Math.max(0,n*(1-d))};
  function patchPriceContexts(){
    if(window.currentProduct){}
    try{document.querySelectorAll('.product').forEach(card=>{});}catch(_){ }
  }
  // Recalculate cart line prices when a rank is active; existing cart objects retain originalPrice.
  function repriceCart(){try{if(!Array.isArray(window.cart))return;window.cart.forEach(x=>{if(x.productIndex!==undefined){const base=Number(x.originalPrice??x.price??0);x.price=window.effectiveProductPrice(base,x.productIndex)}else if(x.comboId){x.price=window.effectiveComboPrice(Number(x.originalPrice??x.price??0))}});updateCart?.()}catch(_){} }
  function profileName(){const u=user();return u?.user_metadata?.username||u?.user_metadata?.name||u?.email?.split('@')[0]||'VIP'}
  async function ensureVipCode(){
    if(!isVIP()||!window.__nexoGetSupabase)return null;
    const sb=window.__nexoGetSupabase();if(!sb)return null;const u=user();if(!u)return null;
    try{
      let {data,error}=await sb.from('nexoplay_vip_referral_codes').select('id,code,uses,remaining_uses').eq('owner_user_id',u.id).maybeSingle();
      if(error)throw error;
      if(data&&Number(data.remaining_uses)>0)return data;
      const code='VIP-'+Math.random().toString(36).slice(2,8).toUpperCase();
      if(data){const r=await sb.from('nexoplay_vip_referral_codes').update({code,uses:0,remaining_uses:1,updated_at:new Date().toISOString()}).eq('id',data.id).eq('owner_user_id',u.id);if(r.error)throw r.error;return {...data,code,uses:0,remaining_uses:1}}
      const r=await sb.from('nexoplay_vip_referral_codes').insert({owner_user_id:u.id,code,uses:0,remaining_uses:1}).select('id,code,uses,remaining_uses').single();if(r.error)throw r.error;return r.data;
    }catch(e){console.warn('NexoPlay VIP code:',e);return null}
  }
  function openVip(){if(!isVIP()){showToast?.('El Centro VIP es exclusivo para usuarios VIP.');return}document.getElementById('nexoVipBg')?.classList.add('open');renderVip()}
  function closeVip(){document.getElementById('nexoVipBg')?.classList.remove('open')}
  function renderVip(){const c=document.getElementById('nexoVipBody');if(!c)return;const st=state(),r=rank();c.innerHTML=`<div class="nx-vip-hero"><div class="nx-vip-card"><div class="nx-vip-kicker">CÓDIGO PERSONAL</div><div id="nxVipCode" class="nx-vip-code">Generando…</div><div class="nx-vip-muted">Este código puede ser utilizado una vez por otra cuenta para adquirir Distribuidor.</div><div class="nx-vip-actions"><button class="nx-ref-btn primary" onclick="copyNexoVipCode()">📋 Copiar código</button><button class="nx-ref-btn" onclick="shareNexoVipCode()">📤 Compartir</button><button class="nx-ref-btn" onclick="refreshNexoVipCode()">♻️ Actualizar</button></div></div><div class="nx-vip-card"><div class="nx-vip-kicker">TU MEMBRESÍA</div><h3 style="font-size:24px;margin:8px 0">👑 ${esc(r?.name||'VIP')}</h3><div class="nx-vip-muted">${st?.rankExpires?'Activo hasta '+new Date(st.rankExpires).toLocaleDateString('es-PE'):'Activo'}</div><div class="nx-vip-stats"><div class="nx-vip-stat"><span>Descuento</span><b>${Number(r?.discount||0)}%</b></div><div class="nx-vip-stat"><span>Compras</span><b>${Number(st?.purchases||0)}</b></div><div class="nx-vip-stat"><span>Referidos</span><b id="nxVipUses">0</b></div></div></div></div><div class="nx-vip-section"><h3>⚡ Beneficios VIP</h3><div class="nx-vip-benefits"><div class="nx-vip-benefit"><b>🏷️ Precios especiales</b>Descuentos configurados por administración.</div><div class="nx-vip-benefit"><b>🎰 Ruleta de premios</b>Acceso cuando esté habilitada.</div><div class="nx-vip-benefit"><b>🆘 Atención prioritaria</b>Soporte directo y preferente.</div><div class="nx-vip-benefit"><b>📈 Centro de ventas</b>Usa el mismo panel de ventas y gestión de clientes que Distribuidor.</div><div class="nx-vip-benefit"><b>🔗 Referidos de un solo uso</b>Tu código se consume una vez y Supabase genera el siguiente automáticamente al volver a abrir/actualizar el Centro VIP.</div></div><div class="nx-save-row"><button class="nx-ref-btn primary" onclick="closeNexoVip();openDistributorPanel()">📈 Abrir Centro de ventas</button></div></div>`;
    ensureVipCode().then(d=>{const el=document.getElementById('nxVipCode');if(el)el.textContent=d?.code||'No disponible';const u=document.getElementById('nxVipUses');if(u)u.textContent=String(d?.uses||0)});
  }
  async function refreshVipCode(){await ensureVipCode();renderVip()}
  async function copyVipCode(){const el=document.getElementById('nxVipCode'),code=el?.textContent;if(!code||code==='Generando…'||code==='No disponible')return;try{await navigator.clipboard.writeText(code);showToast?.('Código VIP copiado.')}catch(_){showToast?.('No se pudo copiar el código.')}}
  function shareVipCode(){const code=document.getElementById('nxVipCode')?.textContent||'';if(!code||code==='Generando…')return;const text=`🎁 Usa mi código ${code} en NexoPlay para adquirir Distribuidor.`;if(navigator.share)navigator.share({text}).catch(()=>{});else openWhatsApp('',text)}
  async function redeemReferral(){const input=document.getElementById('nexoReferralInput'),code=input?.value.trim().toUpperCase();if(!code){showToast?.('Ingresa un código.');return}const sb=window.__nexoGetSupabase?.();const u=user();if(!u||!sb){showToast?.('Inicia sesión para usar un referido.');return}try{const {data,error}=await sb.rpc('submit_vip_referral',{p_code:code});if(error)throw error;const row=Array.isArray(data)?data[0]:data;if(!row?.ok)throw new Error(row?.message||'Código inválido o ya utilizado.');showToast?.('✅ Código registrado correctamente. Esperando a que el VIP que te lo compartió verifique la solicitud.');closeNexoReferral();if(input)input.value='';}catch(e){console.error('NexoPlay referral V5:',e);showToast?.(e?.message||'No se pudo registrar la solicitud.')}}
  function openReferral(){if(!user()){showToast?.('Inicia sesión primero.');openProfile?.();return}document.getElementById('nexoReferralBg')?.classList.add('open');setTimeout(()=>document.getElementById('nexoReferralInput')?.focus(),50)}
  function closeReferral(){document.getElementById('nexoReferralBg')?.classList.remove('open')}
  function outsideReferral(e){if(e.target.id==='nexoReferralBg')closeReferral()}
  ensureVipRankDefaults();
  function addMenuButtons(){const m=document.getElementById('sideMenu');if(!m)return;if(!document.getElementById('vipMenuBtn')){const b=document.createElement('button');b.id='vipMenuBtn';b.style.display='none';b.textContent='👑 Centro VIP';b.onclick=()=>{closeSideMenu?.();openVip()};m.insertBefore(b,document.getElementById('distributorMenuBtn')||m.lastElementChild)}if(!document.getElementById('distReferralMenuBtn')){const b=document.createElement('button');b.id='distReferralMenuBtn';b.style.display='none';b.textContent='🔗 Adquirir Distribuidor por código';b.onclick=()=>{closeSideMenu?.();openReferral()};m.insertBefore(b,document.getElementById('distributorMenuBtn')||m.lastElementChild)}}
  function refreshMenu(){addMenuButtons();const v=document.getElementById('vipMenuBtn'),d=document.getElementById('distReferralMenuBtn');if(v)v.style.display=isVIP()?'block':'none';if(d)d.style.display=isDist()?'none':'block'}
  function addRankButtons(){const grid=document.getElementById('npRanksGrid');if(!grid)return;const cards=[...grid.querySelectorAll('.np-rank-card')];cards.forEach(card=>{const title=card.querySelector('h3')?.textContent?.trim();if(title==='Distribuidor'&&!card.querySelector('.nx-referral-card-btn')){const b=document.createElement('button');b.className='np-rank-btn nx-referral-card-btn';b.textContent='🔗 Adquirir con código';b.onclick=e=>{e.stopPropagation();openReferral()};card.appendChild(b)}})}
  // VIP/Distribuidor product pricing: inject product index into the existing effective-price calls by wrapping render helpers.
  const oldRenderProducts=window.renderProducts;
  if(typeof oldRenderProducts==='function'&&!oldRenderProducts.__nxVip){
    const f=function(list){const out=oldRenderProducts.apply(this,arguments);setTimeout(()=>{try{document.querySelectorAll('#grid .product').forEach(card=>{const name=card.querySelector('.product-info h3')?.textContent?.trim();const pi=products.findIndex(p=>p.name===name);if(pi<0)return;const base=products[pi].plans.filter(x=>x.active!==false).map(x=>Number(x.price||0));const min=base.length?Math.min(...base):0;const shown=window.effectiveProductPrice(min,pi);const price=card.querySelector('.price');if(price)price.textContent=base.length?`S/ ${shown.toFixed(2)}`:'Sin planes';const oldTag=card.querySelector('[data-nx-discount]');if(oldTag)oldTag.remove();const d=discountRateForProduct(pi);if(d>0&&price){const tag=document.createElement('div');tag.dataset.nxDiscount='1';tag.style.cssText='font-size:9px;color:#67e8f9;font-weight:850;margin-top:3px';tag.textContent=`🏷️ ${Math.round(d*100)}% ${rank()?.name||''}`;price.parentElement?.appendChild(tag)}})}catch(_){ }},0);return out};f.__nxVip=true;window.renderProducts=f}
  const oldAdd=window.addSelectedToCart;
  if(typeof oldAdd==='function'&&!oldAdd.__nxVip){
    const f=async function(){const pi=products.indexOf(window.currentProduct),x=window.currentProduct?.plans?.[window.selectedPlan];if(pi>=0&&x){const base=Number(x.price||0);if(Array.isArray(window.cart)){const before=window.cart.length;const out=await oldAdd.apply(this,arguments);if(window.cart.length>before){const item=window.cart[window.cart.length-1];item.originalPrice=base;item.price=window.effectiveProductPrice(base,pi);window.updateCart?.()}return out}}return oldAdd.apply(this,arguments)};f.__nxVip=true;window.addSelectedToCart=f}
  const oldOpenRanks=window.openRanks;if(typeof oldOpenRanks==='function'&&!oldOpenRanks.__nxVip){const f=function(){const out=oldOpenRanks.apply(this,arguments);setTimeout(addRankButtons,40);return out};f.__nxVip=true;window.openRanks=f}
  const oldUpdateCart=window.updateCart;if(typeof oldUpdateCart==='function'&&!oldUpdateCart.__nxVip){const f=function(){try{if(Array.isArray(window.cart))window.cart.forEach(x=>{if(x.productIndex!==undefined){const base=Number(x.originalPrice??x.price??0);x.price=window.effectiveProductPrice(base,x.productIndex)}})}catch(_){}return oldUpdateCart.apply(this,arguments)};f.__nxVip=true;window.updateCart=f}
  // Make rank purchases with Wallet keep existing flow; only add referral acquisition for Distribuidor.
  const oldBuy=window.nexoBuyRank;if(typeof oldBuy==='function'&&!oldBuy.__nxReferral){const f=async function(id){if(id==='distribuidor'&&document.getElementById('nexoReferralInput')?.value.trim())return window.redeemNexoReferral?.();return oldBuy.apply(this,arguments)};f.__nxReferral=true;window.nexoBuyRank=f}
  // Admin custom sections.
  function adminDiscountConfig(){return getCfg()}
  function renderAdminExtras(){const root=document.getElementById('nexoAdminRankSubarea');if(!root)return;try{ensureVipRankDefaults();const cfg=adminDiscountConfig(),rs=getRanks(),dr=rs.find(r=>r.id==='distribuidor')||{discount:40},vr=rs.find(r=>r.id==='vip')||{discount:40};const checked=(rid,pi)=>Array.isArray(cfg[rid]?.products)?cfg[rid].products.includes(pi):true;const productChecks=(rid)=>products.map((p,pi)=>`<label class="nx-product-check"><input type="checkbox" data-nx-rank="${rid}" value="${pi}" ${checked(rid,pi)?'checked':''}> ${esc(p.name)}</label>`).join('');const freq=Array.isArray(cfg.frecuente?.products)?cfg.frecuente.products:[];const benefits=cfg.benefits||{};const benefitRow=(id,label,def)=>`<label class="nx-product-check"><input type="checkbox" data-nx-benefit="${id}" ${benefits[id]!==false&&def?'checked':''}> ${label}</label>`;root.innerHTML=`<div class="np-admin-panel"><div class="np-admin-panel-head"><div><h4>🎯 Reglas comerciales inteligentes</h4><p>Controla descuentos por producto sin modificar los precios base del catálogo.</p></div><button class="admin-btn" onclick="renderAdminRanks();setTimeout(openAdminCommercial,20)">↻ Actualizar</button></div><div class="nx-admin-extra-grid"><div class="nx-admin-extra-card"><h4>🟣 Distribuidor · ${Number(dr.discount||40)}%</h4><p>Selecciona los productos donde se aplica el descuento del Distribuidor.</p><div class="nx-product-checks">${productChecks('distribuidor')}</div><div class="nx-save-row"><button onclick="saveNexoRankProductDiscounts('distribuidor')">💾 Guardar Distribuidor</button><button class="secondary" onclick="selectAllNexoDiscounts('distribuidor',true)">Todos</button><button class="secondary" onclick="selectAllNexoDiscounts('distribuidor',false)">Ninguno</button></div></div><div class="nx-admin-extra-card"><h4>👑 VIP · ${Number(vr.discount||40)}%</h4><p>Selecciona los productos donde se aplica el descuento del VIP.</p><div class="nx-product-checks">${productChecks('vip')}</div><div class="nx-save-row"><button onclick="saveNexoRankProductDiscounts('vip')">💾 Guardar VIP</button><button class="secondary" onclick="selectAllNexoDiscounts('vip',true)">Todos</button><button class="secondary" onclick="selectAllNexoDiscounts('vip',false)">Ninguno</button></div></div><div class="nx-admin-extra-card"><h4>🔵 Cliente Frecuente · S/1</h4><p>Selecciona exactamente en qué productos se descuenta S/1.</p><div class="nx-product-checks">${products.map((p,pi)=>`<label class="nx-product-check"><input type="checkbox" data-nx-rank="frecuente" value="${pi}" ${freq.includes(pi)?'checked':''}> ${esc(p.name)}</label>`).join('')}</div><div class="nx-save-row"><button onclick="saveNexoRankProductDiscounts('frecuente')">💾 Guardar Cliente Frecuente</button><button class="secondary" onclick="selectAllNexoDiscounts('frecuente',true)">Todos</button><button class="secondary" onclick="selectAllNexoDiscounts('frecuente',false)">Ninguno</button></div></div><div class="nx-admin-extra-card"><h4>⚙️ Beneficios por rango</h4><p>Activa/desactiva los beneficios visuales y comerciales sin tocar la lógica de compras.</p><div class="nx-product-checks">${benefitRow('roulette','🎰 Ruleta de premios',true)}${benefitRow('priority','🆘 Atención prioritaria',true)}${benefitRow('sales','📈 Panel de ventas',true)}${benefitRow('referrals','🔗 Referidos VIP',true)}</div><div class="nx-save-row"><button onclick="saveNexoBenefitsConfig()">💾 Guardar beneficios</button></div><div class="nx-admin-note" style="margin-top:10px">La activación de un beneficio aquí controla su disponibilidad en la interfaz; la seguridad de pagos y códigos de referido sigue dependiendo de Supabase.</div></div></div></div>`}catch(e){console.error('NexoPlay admin commercial:',e);root.innerHTML='<div class="np-admin-panel"><div class="np-empty">No se pudo cargar este panel. Recarga la página e inténtalo nuevamente.</div></div>'}}
  function saveNexoBenefitsConfig(){const cfg=getCfg();cfg.benefits=cfg.benefits||{};document.querySelectorAll('[data-nx-benefit]').forEach(el=>{cfg.benefits[el.dataset.nxBenefit]=!!el.checked});setCfg(cfg);showToast?.('Beneficios guardados.');renderAdminExtras()}
  function saveDiscounts(rid){const els=[...document.querySelectorAll(`input[data-nx-rank="${rid}"]`)];const cfg=getCfg();cfg[rid]={...(cfg[rid]||{}),products:els.filter(x=>x.checked).map(x=>Number(x.value))};setCfg(cfg);showToast?.('Configuración de descuentos guardada.');window.renderProducts?.();window.updateCart?.();}
  function selectAll(rid,val){document.querySelectorAll(`input[data-nx-rank="${rid}"]`).forEach(x=>x.checked=!!val)}
  window.saveNexoRankProductDiscounts=saveDiscounts;window.selectAllNexoDiscounts=selectAll;window.saveNexoBenefitsConfig=saveNexoBenefitsConfig;window.openNexoVip=openVip;window.closeNexoVip=closeVip;window.nexoVipOutside=e=>{if(e.target.id==='nexoVipBg')closeVip()};window.copyNexoVipCode=copyVipCode;window.shareNexoVipCode=shareVipCode;window.refreshNexoVipCode=refreshVipCode;window.openNexoReferral=openReferral;window.closeNexoReferral=closeReferral;window.nexoReferralOutside=outsideReferral;window.redeemNexoReferral=redeemReferral;
  // Add an independent administration button and section without changing existing tabs.
  function ensureAdminExtras(){const nav=document.querySelector('.admin-nav'),main=document.querySelector('.admin-main');if(!nav||!main)return;if(!document.getElementById('adminNavCommercial')){const sep=document.createElement('div');sep.className='nav-sep';sep.dataset.nxExtra='1';nav.appendChild(sep);const b=document.createElement('button');b.id='adminNavCommercial';b.className='nx-admin-section-button';b.textContent='🎯 Descuentos y beneficios';b.onclick=()=>openAdminCommercial();nav.appendChild(b)}if(!document.getElementById('adminCommercialSection')){const s=document.createElement('section');s.id='adminCommercialSection';s.className='admin-view';s.innerHTML='<div id="nexoAdminCommercialRoot"></div>';main.appendChild(s)}}
  function openAdminCommercial(){if(typeof refreshAdminState==='function'&&!isAdminUser()){refreshAdminState().then(ok=>{if(ok)openAdminCommercial();});return}ensureAdminExtras();document.querySelectorAll('.admin-view').forEach(v=>v.classList.remove('active'));document.getElementById('adminCommercialSection')?.classList.add('active');document.querySelectorAll('.admin-nav button').forEach(b=>b.classList.remove('active'));document.getElementById('adminNavCommercial')?.classList.add('active');const root=document.getElementById('nexoAdminCommercialRoot');if(root){root.innerHTML='<div id="nexoAdminRankSubarea"></div>';renderAdminExtras()}}
  window.openAdminCommercial=openAdminCommercial;
  const obs=new MutationObserver(()=>{ensureAdminExtras();refreshMenu();if(document.getElementById('npRanksGrid'))setTimeout(addRankButtons,10)});obs.observe(document.body,{childList:true,subtree:true});
  setInterval(()=>{refreshMenu();if(isVIP())ensureVipCode().catch(()=>{});},2500);
  setTimeout(()=>{refreshMenu();ensureAdminExtras()},500);
})();
