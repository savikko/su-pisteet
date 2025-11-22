# Post test data from results.json to Next.js API
# Make sure Next.js app is running (npm run dev) before running this script

$jsonFile = "results.json"
$apiUrl = "http://localhost:3000/api/results"

Write-Host "`n🏃‍♂️ Posting test data to Next.js API..." -ForegroundColor Cyan
Write-Host "File: $jsonFile" -ForegroundColor Gray
Write-Host "URL: $apiUrl`n" -ForegroundColor Gray

try {
    # Check if file exists
    if (-not (Test-Path $jsonFile)) {
        Write-Host "❌ Error: $jsonFile not found!" -ForegroundColor Red
        exit 1
    }

    # Read the JSON file
    $jsonContent = Get-Content $jsonFile -Raw -Encoding UTF8
    
    # Parse to validate JSON
    $data = $jsonContent | ConvertFrom-Json
    Write-Host "✅ Loaded $($data.Count) results from file" -ForegroundColor Green

    # Post to API
    $headers = @{
        "Content-Type" = "application/json; charset=utf-8"
    }

    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $jsonContent -Headers $headers -ContentType "application/json; charset=utf-8"
    
    Write-Host "`n✅ Success!" -ForegroundColor Green
    Write-Host "Response: $($response.message)" -ForegroundColor Green
    Write-Host "Count: $($response.count)" -ForegroundColor Green
    Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor Gray
    
    Write-Host "`n🌐 View results at: http://localhost:3000" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Error occurred!" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*Unable to connect*") {
        Write-Host "`n💡 Make sure Next.js is running:" -ForegroundColor Yellow
        Write-Host "   npm run dev" -ForegroundColor Gray
    }
    
    exit 1
}

