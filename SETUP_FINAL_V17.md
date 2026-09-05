# NexoPlay V17 — paquete final

Este paquete incluye la interfaz Nexo, Nexo IA, la base de notificaciones/push, los scripts de Supabase y una comprobación automática del proyecto.

## 1. En el PC

Instala Node.js 20+.

Abre una terminal en esta carpeta y ejecuta:

```powershell
npm run check
```

## 2. Supabase

Inicia sesión una vez:

```powershell
npm run supabase:login
```

La base de datos debe tener aplicada la migración `supabase/migration_v16_final.sql`.

Despliega las funciones:

```powershell
npm run deploy
```

## 3. Secretos de Nexo IA

En Supabase > Edge Functions > Secrets:

- `AI_API_KEY` = tu clave de OpenAI
- `AI_MODEL` = `gpt-5.6-luna` (puedes cambiarlo por otro modelo habilitado en tu cuenta)

No pongas esta clave en JavaScript público.

## 4. Notificaciones push

Genera las claves VAPID:

```powershell
npm run generate-vapid
```

Guarda la clave pública en `js/nexo-config.js` en `vapidPublicKey` y las claves privadas como secretos de Supabase:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `NEXO_PUSH_SECRET`

Después crea en Supabase un Database Webhook para `INSERT` sobre `public.nexoplay_notifications` apuntando a la Edge Function `nexo-push` y enviando el header `x-nexo-push-secret` con el mismo secreto.

## 5. Último paso de la app

Sirve la carpeta mediante localhost o HTTPS. Inicia sesión y, desde el Centro de notificaciones de Nexo, activa las notificaciones del navegador.

La aplicación no pide permisos automáticamente.

## Seguridad

No publiques `AI_API_KEY`, `VAPID_PRIVATE_KEY`, `NEXO_PUSH_SECRET` ni una Service Role Key en el frontend.
