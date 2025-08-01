# Copy Navigation Components Script
# Run this after cloning the flowdigm repository

# Assuming you've cloned flowdigm to the same directory level as Flow
# Adjust paths as needed

# Create the target directory if it doesn't exist
New-Item -ItemType Directory -Path "flowdigm\src\components" -Force

# Copy all navigation components
Copy-Item "Flow\NavigationComponents\NavigationPage.tsx" -Destination "flowdigm\src\components\"
Copy-Item "Flow\NavigationComponents\MainNavbar.tsx" -Destination "flowdigm\src\components\"
Copy-Item "Flow\NavigationComponents\SecondaryPanel.tsx" -Destination "flowdigm\src\components\"
Copy-Item "Flow\NavigationComponents\AIChatbox.tsx" -Destination "flowdigm\src\components\"
Copy-Item "Flow\NavigationComponents\DiagramEditor.tsx" -Destination "flowdigm\src\components\"
Copy-Item "Flow\NavigationComponents\README.md" -Destination "flowdigm\src\components\"

Write-Host "Navigation components copied successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd flowdigm" -ForegroundColor White
Write-Host "2. git add ." -ForegroundColor White
Write-Host "3. git commit -m 'Add navigation sidebar components'" -ForegroundColor White
Write-Host "4. git push origin main" -ForegroundColor White
Write-Host "5. Create a Pull Request on GitHub" -ForegroundColor White
