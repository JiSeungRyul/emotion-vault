#!/bin/bash

# Emotion Vault - Quick Setup Script
# This script helps you set up the project quickly

echo "🎭 Emotion Vault - Quick Setup"
echo "================================"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and set your database credentials!"
    echo ""
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"
echo ""

# Ask user how they want to run the project
echo "How would you like to run the project?"
echo "1) Docker Compose (recommended - includes DB + App)"
echo "2) Local development (requires local PostgreSQL)"
echo ""
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🐳 Starting Docker Compose..."
    docker-compose up --build -d
    
    echo ""
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    echo ""
    echo "✅ Emotion Vault is running!"
    echo ""
    echo "🌐 Application: http://localhost:3000"
    echo "🗄️  Database: localhost:5432"
    echo ""
    echo "📊 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    
    echo ""
    echo "🔧 Generating Prisma Client..."
    npm run prisma:generate
    
    echo ""
    echo "📊 Running database migrations..."
    npm run prisma:migrate
    
    echo ""
    echo "🚀 Starting development server..."
    npm run dev
    
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi
