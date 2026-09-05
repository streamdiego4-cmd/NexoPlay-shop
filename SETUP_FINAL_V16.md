# NexoPlay V16 — puesta en marcha final

Esta es la versión final del código. No contiene secretos privados. La única configuración que obligatoriamente debe hacerse en tu cuenta es registrar los secretos y desplegar las Edge Functions.

## A. Base de datos

Como la versión anterior pudo haber creado `nexoplay_vip_referral_requests` con un alias interno `user_id`, ejecuta **una sola vez**:

`supabase/migration_v16_final.sql`

Esta migración es aditiva e idempotente y deja la tabla compatible con las funciones de referidos existentes (`submit_vip_referral`, `review_vip_referral_request`, `vip_get_referred_clients`, etc.).

## B. Nexo IA

En Supabase → Edge Functions → Secrets:

- `AI_API_KEY` = tu clave de OpenAI (ya la tienes)
- `AI_MODEL` = `gpt-5.6-luna` (opcional)

No necesitas `AI_API_URL`.

`nexo-ai` usa la Responses API. Para preguntas de actualidad (estrenos, partidos, horarios, resultados, etc.) habilita automáticamente `web_search`.

## C. Deploy

Con Node.js 20+ en la terminal de VS Code:

```powershell
npx supabase@latest login
npx supabase@latest functions deploy nexo-ai --project-ref xwyjmgbiipgifnrdebsu
npx supabase@latest functions deploy nexo-push --project-ref xwyjmgbiipgifnrdebsu
```

También puedes ejecutar:

```powershell
./scripts/deploy-nexo.ps1
```

## D. Push al teléfono

Genera las claves:

```powershell
npx web-push generate-vapid-keys
```

En Supabase → Edge Functions → Secrets crea:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (ejemplo: `mailto:tu-correo@dominio.com`)
- `NEXO_PUSH_SECRET` (una cadena aleatoria larga)

En `js/nexo-config.js`, pega **solo** la `VAPID_PUBLIC_KEY` en `vapidPublicKey`.

## E. Push automático con la web cerrada

En Supabase crea un Database Webhook:

- Tabla: `public.nexoplay_notifications`
- Evento: `INSERT`
- URL: `https://xwyjmgbiipgifnrdebsu.supabase.co/functions/v1/nexo-push`
- Header: `x-nexo-push-secret: <el mismo valor usado en NEXO_PUSH_SECRET>`

La función `nexo-push` acepta ese secreto y, si la notificación es para `audience=admin`, busca los perfiles cuyo `role=admin`.

## F. Prueba final

1. Despliega la web mediante HTTPS o usa localhost durante las pruebas.
2. Inicia sesión.
3. Abre el Centro de notificaciones y pulsa Activar notificaciones.
4. Acepta el permiso del navegador.
5. Prueba una compra y un ticket.
6. Prueba un referido VIP.
7. Prueba Nexo con preguntas de catálogo y una pregunta actual.
8. Con VAPID + Webhook configurados, cierra la página y prueba un nuevo evento.

No pongas `AI_API_KEY`, `VAPID_PRIVATE_KEY` ni `NEXO_PUSH_SECRET` en `index.html` ni en archivos JavaScript públicos.
