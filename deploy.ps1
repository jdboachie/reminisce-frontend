# Vercel Deployment Script
Write-Host "🚀 Starting Vercel deployment..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Yellow
    Write-Host "Please answer the prompts:" -ForegroundColor Cyan
    Write-Host "- Set up and deploy: YES" -ForegroundColor Cyan
    Write-Host "- Scope: Your account" -ForegroundColor Cyan
    Write-Host "- Link to existing project: NO" -ForegroundColor Cyan
    Write-Host "- Project name: reminisce-frontend" -ForegroundColor Cyan
    Write-Host "- Directory: ./ (current directory)" -ForegroundColor Cyan
    Write-Host "- Override settings: NO" -ForegroundColor Cyan
    
    vercel --prod
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
} 