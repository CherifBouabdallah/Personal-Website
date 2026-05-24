#!/bin/bash

echo "📥 Pulling latest source code from GitHub..."
git pull origin main

echo "📦 Installing project dependencies..."
# npm ci is faster and cleaner for automated deployment scripts than npm install
npm ci

echo "🛠️ Compiling Vite into production-ready static HTML/CSS..."
npm run build

echo "⚙️ Configuring Nginx SPA routing fallback..."
# Copy the custom Nginx config to sites-available
sudo cp nginx-default.conf /etc/nginx/sites-available/default

echo "🧹 Clearing old production files..."
sudo rm -rf /var/www/html/*

echo "🚀 Copying compiled 'dist' folder to Nginx web root..."
# We copy the CONTENTS of the dist folder (note the trailing slash)
sudo cp -a dist/. /var/www/html/

echo "🔄 Reloading Nginx server..."
# Test config and reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✨ Deployment complete! Your optimized site is live."
