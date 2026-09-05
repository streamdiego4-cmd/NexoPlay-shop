$ErrorActionPreference = 'Stop'
$ProjectRef = 'xwyjmgbiipgifnrdebsu'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host 'NexoPlay — configuración final' -ForegroundColor Cyan
Write-Host 'Este asistente no escribe secretos dentro del proyecto.' -ForegroundColor DarkGray

node --version | Out-Host
npm --version | Out-Host

Write-Host '1/4 Comprobación local...' -ForegroundColor Cyan
npm run check

Write-Host '2/4 Comprobando sesión y proyecto Supabase...' -ForegroundColor Cyan
npx supabase@latest projects list --output json | Out-Null

Write-Host '3/4 Revisando secretos de Nexo AI...' -ForegroundColor Cyan
$secretJson = npx supabase@latest secrets list --project-ref $ProjectRef --output json | Out-String
$hasAiKey = $secretJson -match 'AI_API_KEY'
if (-not $hasAiKey) {
  Write-Host 'No existe AI_API_KEY todavía. Pégala ahora (se guarda solo como secreto de Supabase).' -ForegroundColor Yellow
  $secure = Read-Host 'OpenAI API key' -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    $aiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    if ([string]::IsNullOrWhiteSpace($aiKey)) { throw 'La clave está vacía.' }
    npx supabase@latest secrets set --project-ref $ProjectRef "AI_API_KEY=$aiKey" "AI_MODEL=gpt-5.6-luna"
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
} else {
  Write-Host 'AI_API_KEY ya existe. Se conserva.' -ForegroundColor Green
  npx supabase@latest secrets set --project-ref $ProjectRef 'AI_MODEL=gpt-5.6-luna' | Out-Null
}

Write-Host '4/4 Desplegando funciones...' -ForegroundColor Cyan
npx supabase@latest functions deploy nexo-ai --project-ref $ProjectRef
npx supabase@latest functions deploy nexo-push --project-ref $ProjectRef

Write-Host ''
Write-Host 'LISTO — Nexo AI y Nexo Push quedaron desplegados.' -ForegroundColor Green
Write-Host 'Para Web Push, completa una sola vez las claves VAPID en Supabase y la clave pública en js/nexo-config.js.' -ForegroundColor Yellow
