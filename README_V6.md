# NexoPlay V6 — cambios finales

Esta versión conserva el runtime existente y añade una capa V6 para:
- persistir y rehidratar ediciones de productos/planes base guardadas desde administración;
- corregir rutas relativas de imágenes de catálogo/inventario cuando el CSS se sirve desde /css;
- separar Centro VIP (membresía/beneficios/contacto) del Panel de Referidos (código, solicitudes y clientes);
- mantener el código de referido exclusivamente en Panel de Referidos;
- aplicar una ruleta diferenciada por rango (Cliente Frecuente, Distribuidor y VIP) sin habilitarla al rango Cliente;
- rediseñar visualmente los modales de compras, autenticación, recuperación y referido con una estética clara;
- añadir carruseles de nombres de plataformas;
- mantener la compatibilidad con el runtime V2/V5 existente.

La migración `supabase/migration_v5_vip_referrals.sql` sigue siendo necesaria para el flujo de referidos moderados.
