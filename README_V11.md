# NexoPlay V11 — reparación del Service Worker

Esta versión parte de V10 y corrige únicamente el problema de caché que podía hacer que un recurso CSS/JS fallido recibiera `index.html` como respuesta. Eso provoca el error del navegador "Refused to apply style ... MIME type text/html" y puede dejar toda la página sin estilos.

También incluye en la caché los archivos V7/V8 que ya existen en el proyecto.

Importante: si la carpeta `images/` personalizada no contiene un archivo que el catálogo referencia (por ejemplo `adobe.jpg`), ese recurso seguirá dando 404 hasta que exista el archivo correspondiente. Eso es un problema del asset, no del Service Worker.

Los 404 de RPC de Supabase siguen dependiendo de que las funciones RPC correspondientes existan en el proyecto remoto.
