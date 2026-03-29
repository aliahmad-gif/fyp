# Copy this project to a short path so npm install works (avoids Windows path length + locked Firebase files)
$Dest = "D:\fyp-dashboard"
$Here = $PSScriptRoot

if (-not (Test-Path $Dest)) { New-Item -ItemType Directory -Path $Dest -Force | Out-Null }

# Use robocopy to handle long paths; exclude node_modules and other heavy/unneeded folders
robocopy $Here $Dest /E /XD node_modules .git /XF package-lock.json copy-to-short-path.ps1 /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
# robocopy exit: 0-7 = success (some copied), 8+ = errors
if ($LASTEXITCODE -ge 8) {
    Write-Host "Copy had errors (code $LASTEXITCODE). Copying important files manually..." -ForegroundColor Yellow
    @("package.json", "index.html", "vite.config.js") | ForEach-Object {
        Copy-Item (Join-Path $Here $_) -Destination $Dest -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path (Join-Path $Here "src")) {
        robocopy (Join-Path $Here "src") (Join-Path $Dest "src") /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
    }
    if (Test-Path (Join-Path $Here "public")) {
        robocopy (Join-Path $Here "public") (Join-Path $Dest "public") /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
    }
}

Write-Host ""
Write-Host "Project copied to: $Dest" -ForegroundColor Green
Write-Host ""
Write-Host "Run these commands in a NEW terminal:" -ForegroundColor Yellow
Write-Host "  cd D:\fyp-dashboard"
Write-Host "  npm install"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Then open: http://localhost:5176" -ForegroundColor Cyan
