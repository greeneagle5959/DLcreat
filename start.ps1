#!/usr/bin/env powershell
<#
.SYNOPSIS
  Lance le serveur DLCreat et ouvre le navigateur

.DESCRIPTION
  Script pour démarrer le serveur de développement et ouvrir automatiquement dans le navigateur
#>

Write-Host "`n"
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         🚀 DLCreat - Lancement du Serveur de Dev 🚀           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

$port = 5173
$url = "http://localhost:$port"

Write-Host "⏳ Démarrage du serveur de développement..." -ForegroundColor Yellow
Write-Host ""

# Installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Blue
    npm install
    Write-Host ""
}

# Démarrer le serveur
Write-Host "🔥 Démarrage de Vite..." -ForegroundColor Blue
Write-Host ""

# Ouvrir le navigateur après 3 secondes
$null = Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process $using:url
}

# Lancer le serveur
npm run dev

Write-Host ""
Write-Host "✋ Serveur arrêté" -ForegroundColor Gray
