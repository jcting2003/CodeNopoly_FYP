# ============================================================
#  CodeNopoly  -  Full Project Startup Script (PowerShell)
#  Starts:  Laravel backend (port 8000)  +  Vite dev server (port 5173)
# ============================================================

$ROOT    = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND = Join-Path $ROOT "backend"
$WEB     = Join-Path $ROOT "web"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CodeNopoly  -  Starting Up...        " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# -- Pre-flight checks --
if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] PHP is not installed or not in PATH." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# -- Backend dependencies --
if (-not (Test-Path (Join-Path $BACKEND "vendor"))) {
    Write-Host "[BACKEND] Installing Composer dependencies..." -ForegroundColor Yellow
    Push-Location $BACKEND
    php composer.phar install
    Pop-Location
} else {
    Write-Host "[BACKEND] vendor/ found - skipping composer install" -ForegroundColor Green
}

# -- Frontend dependencies --
if (-not (Test-Path (Join-Path $WEB "node_modules"))) {
    Write-Host "[WEB] Installing npm dependencies..." -ForegroundColor Yellow
    Push-Location $WEB
    npm install
    Pop-Location
} else {
    Write-Host "[WEB] node_modules/ found - skipping npm install" -ForegroundColor Green
}

# -- Run database migrations --
Write-Host ""
Write-Host "[BACKEND] Running database migrations..." -ForegroundColor Yellow
Push-Location $BACKEND
php artisan migrate --force 2>$null
Pop-Location

# -- Launch Backend (new terminal window) --
Write-Host ""
Write-Host "[BACKEND] Starting Laravel on http://localhost:8000" -ForegroundColor Magenta

$backendCmd = "Set-Location `"$BACKEND`"; Write-Host `"Laravel Backend`" -ForegroundColor Cyan; php artisan serve --host=localhost --port=8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# -- Launch Frontend (new terminal window) --
Write-Host "[WEB]     Starting Vite on http://localhost:5173" -ForegroundColor Magenta

$webCmd = "Set-Location `"$WEB`"; Write-Host `"Vite Dev Server`" -ForegroundColor Cyan; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $webCmd

# -- Done --
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   All services launched!               " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend  ->  http://localhost:8000" -ForegroundColor White
Write-Host "  Frontend ->  http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "  Close the spawned terminal windows to stop each server." -ForegroundColor DarkGray
Write-Host ""
