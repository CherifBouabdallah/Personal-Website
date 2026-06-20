#!/bin/bash

# ==========================================
# 🛑 FAIL-SAFE CONFIGURATION
# ==========================================
# Exit immediately if any command fails
set -e
# Treat unset variables as an error
set -u
# Ensure pipelines fail if any command within them fails
set -o pipefail

# ==========================================
# 📂 VARIABLES (Customize these if needed)
# ==========================================
PROJECT_DIR="$HOME/Personal-Website"
WEB_ROOT="/var/www/html"
BRANCH="main"

echo "🚀 Starting bulletproof deployment pipeline..."

# Ensure we are in the right directory before doing anything
cd "$PROJECT_DIR"

echo "📥 Syncing state with GitHub (Forcing a strictly clean state)..."
# Fetch the latest history without merging it yet
git fetch origin
# Hard reset to exactly match the remote branch, destroying local changes (fixes lockfile errors)
git reset --hard "origin/$BRANCH"
# Remove any untracked files or directories that might cause conflicts
git clean -fd

echo "📦 Installing project dependencies cleanly..."
npm ci

echo "🛠️ Compiling Vite into production-ready static HTML/CSS..."
npm run build

echo "⚙️ Configuring Nginx SPA routing fallback..."
sudo cp nginx-default.conf /etc/nginx/sites-available/default

echo "🔄 Deploying files with zero-downtime synchronization..."
# Using rsync instead of rm + cp prevents the website from going completely offline for a split second.
# It only copies what changed and cleanly deletes old files.
sudo rsync -a --delete dist/ "$WEB_ROOT/"

echo "✅ Verifying Nginx configuration and reloading..."
sudo nginx -t
sudo systemctl reload nginx

echo "✨ Deployment complete! Your optimized site is live."
