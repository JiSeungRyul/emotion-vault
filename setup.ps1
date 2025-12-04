# Emotion Vault - Quick Setup Script (PowerShell)
# This script helps you set up the project quickly on Windows

chcp 65001 > $null
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 Emotion Vault - Quick Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
  Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
  Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
  Copy-Item ".env.example" -Destination ".env"
  Write-Host "⚠️  Please edit .env and set your database credentials!" -ForegroundColor Yellow
  Write-Host ""
}

# Check if Docker is installed
try {
  docker --version | Out-Null
  Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
  Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
  exit 1
}

# Check if Docker Compose is installed
try {
  docker-compose --version | Out-Null
  Write-Host "✅ Docker Compose is installed" -ForegroundColor Green
} catch {
  Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
  exit 1
}

Write-Host ""

# Ask user how they want to run the project
Write-Host "How would you like to run the project?" -ForegroundColor Cyan
Write-Host "1) Docker Compose (recommended - includes DB + App)"
Write-Host "2) Local development (requires local PostgreSQL)"
Write-Host ""

$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
  Write-Host ""
  Write-Host "▶️  Starting Docker Compose..." -ForegroundColor Cyan
  docker-compose up --build -d
  
  Write-Host ""
  Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
  Start-Sleep -Seconds 10
  
  Write-Host ""
  Write-Host "🎉 Emotion Vault is running!" -ForegroundColor Green
  Write-Host ""
  Write-Host "🌐 Application: http://localhost:3000" -ForegroundColor Cyan
  Write-Host "🗄️  Database: localhost:5432" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "📜 To view logs: docker-compose logs -f" -ForegroundColor Yellow
  Write-Host "🛑 To stop: docker-compose down" -ForegroundColor Yellow
  
} elseif ($choice -eq "2") {
  Write-Host ""
  Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
  npm install
  
  Write-Host ""
  Write-Host "🧬 Generating Prisma Client..." -ForegroundColor Cyan
  npm run prisma:generate
  
  Write-Host ""
  Write-Host "🛠️  Running database migrations..." -ForegroundColor Cyan
  npm run prisma:migrate
  
  Write-Host ""
  Write-Host "▶️  Starting development server..." -ForegroundColor Cyan
  npm run dev
  
} else {
  Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
  exit 1
}

