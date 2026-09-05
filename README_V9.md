# NexoPlay V9 FINAL

Hotfix final sobre V8.

- Corrige el contraste de botones dentro de Mis Compras.
- Corrige el modal de detalles de venta para que quede encima del panel de Distribuidor/VIP.
- Evita el error de compatibilidad del render de perfil entre legacy-runtime y el perfil V5.
- Añade favicon explícito.
- Incluye assets locales de respaldo para las miniaturas de plataformas para evitar 404 por imágenes ausentes.

Nota Supabase: si el navegador sigue mostrando 404 en `/rpc/vip_list_referral_requests`, `/rpc/vip_get_referred_clients` o `/rpc/my_vip_referral_status`, esas funciones todavía no existen en el proyecto remoto de Supabase. Debe ejecutarse la migración `supabase/migration_v5_vip_referrals.sql` en el SQL Editor del proyecto.
