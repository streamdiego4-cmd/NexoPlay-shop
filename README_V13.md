# NexoPlay V13

## Novedades
- Robot Nexo flotante dibujado en SVG/CSS, con uniforme visual y acceso al asistente.
- Nexo IA usa el catálogo como fuente de verdad para precios, planes y beneficios y permite conectar una Edge Function.
- `window.NEXO_AI_ENDPOINT` puede apuntar a una URL propia; si no existe, se usa automáticamente la Edge Function de Supabase configurada en el runtime.
- Centro de notificaciones dentro de la app.
- Permiso opcional para notificaciones del navegador.
- Service Worker con eventos `push` y `notificationclick`.
- Suscripción Web Push opcional mediante `NEXO_VAPID_PUBLIC_KEY`.
- Migración `supabase/migration_v13_notifications.sql` y Edge Function `supabase/functions/nexo-push` para la parte servidor.
- Suscripciones y notificaciones no activan prompts automáticamente: el usuario debe aceptar.

## Para notificaciones push reales con la aplicación cerrada
1. Ejecuta la migración V13 en Supabase.
2. Genera una pareja VAPID y configura en el frontend solo la clave pública como `window.NEXO_VAPID_PUBLIC_KEY`.
3. Configura `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VAPID_SUBJECT` como secretos de Supabase.
4. Publica `supabase/functions/nexo-push`.
5. Desde eventos reales de negocio (nueva compra, nueva solicitud, ticket, etc.) llama a esa función con las suscripciones destinatarias.

La UI de notificaciones y la base de push están preparadas, pero no se afirma que una notificación remota pueda enviarse hasta configurar esas claves y conectar los eventos del backend.
