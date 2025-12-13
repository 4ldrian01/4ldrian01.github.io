# Deployment Helper Script
# This script helps you switch between development and production modes

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'prod', 'build')]
    [string]$Mode
)

$indexPath = "index.html"
$backupPath = "index.backup.html"

function Show-Banner {
    Write-Host "`n==========================================" -ForegroundColor Cyan
    Write-Host "   Portfolio Deployment Helper" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Update-IndexHTML {
    param([string]$From, [string]$To, [string]$ModeName)
    
    Write-Host "📝 Switching to $ModeName mode..." -ForegroundColor Yellow
    
    # Read the file
    $content = Get-Content $indexPath -Raw
    
    # Replace paths
    $newContent = $content -replace [regex]::Escape($From), $To
    
    # Save
    Set-Content -Path $indexPath -Value $newContent -NoNewline
    
    Write-Host "✅ index.html updated!" -ForegroundColor Green
    Write-Host "   JS Path: $To" -ForegroundColor Gray
}

Show-Banner

switch ($Mode) {
    'build' {
        Write-Host "🔨 Building obfuscated code..." -ForegroundColor Yellow
        node build-obfuscated.js
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Build completed successfully!" -ForegroundColor Green
            Write-Host "`nNext step: Run './deploy.ps1 prod' to switch to production mode" -ForegroundColor Cyan
        }
        else {
            Write-Host "`n❌ Build failed!" -ForegroundColor Red
        }
    }
    'dev' {
        Update-IndexHTML -From "./dist/js/" -To "./ASSETS/js/" -ModeName "DEVELOPMENT"
        Write-Host "`n💻 Development mode active" -ForegroundColor Green
        Write-Host "   Using readable source code from ASSETS/js/" -ForegroundColor Gray
    }
    'prod' {
        if (-not (Test-Path "dist/js")) {
            Write-Host "❌ Error: dist/js/ folder not found!" -ForegroundColor Red
            Write-Host "   Run './deploy.ps1 build' first to create obfuscated code" -ForegroundColor Yellow
            exit 1
        }
        
        Update-IndexHTML -From "./ASSETS/js/" -To "./dist/js/" -ModeName "PRODUCTION"
        Write-Host "`n🚀 Production mode active" -ForegroundColor Green
        Write-Host "   Using obfuscated code from dist/js/" -ForegroundColor Gray
        Write-Host "`n⚠️  Remember: Test locally before deploying!" -ForegroundColor Yellow
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host ""
