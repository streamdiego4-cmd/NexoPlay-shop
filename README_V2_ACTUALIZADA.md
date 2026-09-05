# NexoPlay V2 — actualización funcional + visual

Esta versión parte del NexoPlay V2 que ya tenía el nuevo diseño y corrige los problemas reportados en pruebas.

## Cambios principales
- Tema claro/blanco para cliente y módulos no administrativos.
- Panel administrador conserva su fondo oscuro.
- Buscador y tarjetas sin bordes/sombras negras no deseadas.
- Categorías y textos adaptados a fondo claro.
- Carrito con confirmación visible de producto agregado.
- Total del carrito recalculado con la misma fuente de estado que usa checkout.
- Corrección del conflicto `window.cart`/estado interno que provocaba que checkout creyera que el carrito estaba vacío.
- Comprobante obligatorio para Yape/Plin antes de continuar.
- Datos extra: Nombre de perfil, ID/Usuario y Datos extra, sin valores `undefined`.
- Cupones demo desactivados y UI de cupón retirada del checkout.
- Nexo como mascota flotante, con modal de asistencia.
- Nexo puede comparar planes usando el catálogo cargado localmente.
- El endpoint de IA queda opcional para consultas actuales de estrenos, disponibilidad y deportes.
- Carga diferida de posters.

## Instalación
1. Extrae el ZIP.
2. Reemplaza/coloca tu carpeta `images` original dentro de la carpeta del proyecto.
3. Abre la carpeta en VS Code.
4. Ejecuta `index.html` con Live Server.
5. Revisa `CONFIGURACION.md` para los parámetros del proyecto.

## Nexo IA
Configura un endpoint seguro de backend/Edge Function en `window.NEXO_AI_ENDPOINT`. No pongas claves secretas de IA en el frontend.

## Prueba mínima obligatoria
- Abrir producto > elegir plan > Agregar al carrito.
- Confirmar que aparece `Agregado al carrito` y que el total cambia.
- Abrir carrito > completar datos extra si corresponde.
- Yape/Plin sin comprobante: debe bloquear y pedir comprobante.
- Con comprobante: continuar debe preparar WhatsApp con el total y datos extra.
- Wallet: validar saldo/PIN según la configuración existente.
