# NexoPlay V2 — versión corregida

Esta entrega parte de la versión V2 funcional y corrige la interfaz clara, el carrito, la validación de comprobantes y la experiencia de Nexo.

## Cambios principales
- Tema claro blanco/azul/violeta en la experiencia pública.
- Tutorial en tema oscuro con contraste alto.
- Panel administrativo conservado en tema oscuro.
- Menú de usuario, rangos públicos, reseñas y modales con contraste reforzado.
- Carrito: confirmación visible al agregar, subtotal/total fiable y datos extra sin valores `undefined`.
- Datos extra: Nombre de perfil, ID / USUARIO y Datos extra.
- Yape/Plin: el checkout exige comprobante antes de abrir WhatsApp. Wallet no exige comprobante.
- Cupones de prueba desactivados; no hay caja de cupón en el checkout.
- Nexo Inteligente: comparación de planes del catálogo por plataforma y modalidad.
- Mascota Nexo flotante con gestos suaves y respeto a `prefers-reduced-motion`.
- Páginas de Películas, Deportes y Ofertas con contenido diferenciado.
- Service Worker con cache versionada para evitar servir recursos visuales antiguos.

## Imágenes
Coloca tu carpeta `images/` original junto a este `index.html`, conservando los nombres de archivo usados por el catálogo.

## Supabase
Las credenciales públicas actuales permanecen en el runtime existente. Para Nexo con información actualizada, configura `NEXO_AI_ENDPOINT` mediante una ruta segura/backend/Edge Function; nunca pongas una clave secreta del proveedor en el frontend.
