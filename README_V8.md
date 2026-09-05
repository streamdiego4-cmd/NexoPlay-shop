# NexoPlay V8 — correcciones puntuales

Esta versión parte de NexoPlay V7 y realiza una pasada enfocada en los problemas reportados en pruebas visuales.

- El modal de perfil cambia de proporción únicamente en escritorio; los demás paneles mantienen sus dimensiones.
- Mis Compras y Mis pedidos reciben fondos claros y contraste alto.
- Los productos base p1..p27 usan sus assets reales en Inventario/Catálogo.
- El Centro VIP fuerza el render del panel nuevo y elimina el bloque de código personal del Centro VIP; el código permanece en Panel de Referidos.
- Panel de ventas importa ventas remotas con metadatos de cliente cuando no existen todavía en el almacenamiento local.
- Los mensajes de entrega y vencimiento usan escapes Unicode para conservar emojis y un texto más formal.
- Se añade botón de comunidad al panel de ventas. Configure COMMUNITY_URL en js/nexoplay-v8.js antes de producción.

No se elimina legacy-runtime.js ni se desactiva ninguna funcionalidad existente de base.
