# NexoPlay V10 — reparación final de soporte y consola

Esta versión mantiene la interfaz/funciones de V9 y añade solo:

- botones y aviso de compra pendiente con fondo claro/acentos;
- el formulario de soporte guarda un primer mensaje con el motivo y todos los datos capturados (descripción, perfil, correo indicado, código), para que aparezcan en el chat del administrador;
- rutas de imágenes de CSS corregidas;
- favicon declarado;
- migración `supabase/migration_v10_fix_support_and_referrals.sql` que incluye los RPC de referidos VIP, columnas de soporte y la tabla de categorías usada por el catálogo.

## Supabase
Ejecuta `supabase/migration_v10_fix_support_and_referrals.sql` una vez en el SQL Editor de tu proyecto. Esto es necesario para eliminar los 404 de RPC/categorías que dependen del backend remoto.
