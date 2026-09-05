$ErrorActionPreference = 'Stop'
Write-Host 'Generando claves VAPID...' -ForegroundColor Cyan
npx web-push generate-vapid-keys
