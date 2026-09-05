# NexoPlay V5 — mejora integral sin retroceder

Esta versión conserva la base funcional de V2/V4 y añade una capa V5 enfocada en experiencia, negocio y referidos.

## Incluido
- Perfil rediseñado: Nexo Puntos, rango, Wallet, compras, dinámicas, acciones rápidas y correo completo.
- Ruleta Nexo: un giro cada 24 h, premios en Nexo Puntos y estado visible.
- Centro VIP rediseñado con código de un solo uso, solicitudes separadas por VIP y gestión de referidos.
- Moderación: usar un código ya no activa Distribuidor inmediatamente; crea una solicitud pendiente para el VIP propietario del código.
- Cada VIP solo ve sus propias solicitudes/clientes. No existe acción para revocar el rango desde Centro VIP.
- Clientes verificados: usuario, correo completo, Wallet, cantidad de compras y fecha de verificación. No se exponen detalles privados de compras.
- Panel de ventas más visual y campo `Monto vendido`; el KPI Total vendido usa ese monto.
- Service Worker actualizado a V5 para evitar servir CSS/JS antiguos.

## Importante: Supabase
Ejecuta `supabase/migration_v5_vip_referrals.sql` en el SQL Editor de tu proyecto Supabase. Esta migración crea las solicitudes moderadas y las funciones RPC usadas por el Centro VIP.

Sin esa migración, el diseño V5 sí carga, pero la moderación y la consulta remota de clientes no pueden funcionar de forma segura.

## Seguridad
La consulta de clientes se realiza mediante funciones RPC `security definer` y se limita al VIP propietario de cada referido. El frontend no recibe datos de compras detalladas ni movimientos privados.

## Compatibilidad
La lógica existente de catálogo, Wallet, checkout, administración, rangos y entrega se conserva. Los nuevos archivos V5 están cargados al final para reducir el riesgo de romper funciones existentes.
