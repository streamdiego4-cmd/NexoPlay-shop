$ErrorActionPreference = 'Stop'
$ProjectRef = 'xwyjmgbiipgifnrdebsu'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host 'NexoPlay - despliegue de Edge Functions' -ForegroundColor Cyan
Write-Host "Proyecto: $ProjectRef" -ForegroundColor DarkGray

npx supabase@latest functions deploy nexo-ai --project-ref $ProjectRef
npx supabase@latest functions deploy nexo-push --project-ref $ProjectRef

Write-Host 'Edge Functions desplegadas correctamente.' -ForegroundColor Green
Write-Host 'Recuerda configurar los secretos de IA/VAPID en Supabase antes de probar las funciones.' -ForegroundColor Yellow
