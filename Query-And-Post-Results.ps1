#requires -Version 5.0

<#
.SYNOPSIS
    Connects to SQL Server, executes a query, saves results to JSON, and posts to HTTP endpoint.

.DESCRIPTION
    This script queries SQL Server for skating competition results and posts them to a specified HTTP endpoint.

.PARAMETER ServerName
    SQL Server instance name (default: "localhost")

.PARAMETER DatabaseName
    Database name (default: "SkatingApp")

.PARAMETER Username
    SQL Server username (default: "sa")

.PARAMETER Password
    SQL Server password (default: "skatingapp")

.PARAMETER OutputFile
    Path to save JSON output (default: "results.json")

.PARAMETER PostUrl
    HTTP endpoint URL to POST the JSON data (default: "https://su-pisteet.kikka.re/api/results")

.PARAMETER SkipFileOutput
    If specified, skips saving to file and only posts to HTTP

.EXAMPLE
    .\Query-And-Post-Results.ps1
    Runs with all default values

.EXAMPLE
    .\Query-And-Post-Results.ps1 -ServerName "server\instance" -Username "user" -Password "pass"
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$ServerName = "localhost",
    
    [Parameter(Mandatory=$false)]
    [string]$DatabaseName = "SkatingApp",
    
    [Parameter(Mandatory=$false)]
    [string]$Username = "sa",
    
    [Parameter(Mandatory=$false)]
    [string]$Password = "skatingapp",
    
    [Parameter(Mandatory=$false)]
    [string]$OutputFile = "results.json",
    
    [Parameter(Mandatory=$false)]
    [string]$PostUrl = "https://su-pisteet.kikka.re/api/results",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipFileOutput
)

# SQL Query
$query = @"
SELECT
    FirstName,
    LastName,
    Club,
    AgeCategoryCode,
	MAX(CASE WHEN Distance='ID_300' AND CAST(ScheduleTime AS DATE)='2025-11-22' Then Time END) as M300m_1_aika,
	MAX(CASE WHEN Distance='ID_300' AND CAST(ScheduleTime AS DATE)='2025-11-22' Then Time/3*5 END) as M300m_1_pisteet,
	MAX(CASE WHEN Distance='ID_500' AND CAST(ScheduleTime AS DATE)='2025-11-22' Then Time END) as M500m_1_aika,
    MAX(CASE WHEN Distance='ID_500' AND CAST(ScheduleTime AS DATE)='2025-11-22' Then Time END) as M500m_1_pisteet,
	MAX(CASE WHEN Distance='ID_300' AND CAST(ScheduleTime AS DATE)='2025-11-23' Then Time END) as M300m_2_aika,
    MAX(CASE WHEN Distance='ID_300' AND CAST(ScheduleTime AS DATE)='2025-11-23' Then Time/3*5 END) as M300m_2_pisteet,
	MAX(CASE WHEN Distance='ID_500' AND CAST(ScheduleTime AS DATE)='2025-11-23' Then Time END) as M500m_2_aika,
	MAX(CASE WHEN Distance='ID_500' AND CAST(ScheduleTime AS DATE)='2025-11-23' Then Time END) as M500m_2_pisteet,
    SUM(CASE
        WHEN Distance='ID_300' THEN Time/3*5
        ELSE Time
    END) AS TotalNormalizedTime
FROM [SkatingApp].[dbo].[Result] as R
LEFT OUTER JOIN [SkatingApp].[dbo].[Competition] as C on R.CompetitionId=C.CompetitionId
LEFT OUTER JOIN [SkatingApp].[dbo].[Competitor] as Ct on R.CompetitorId=Ct.CompetitorId
LEFT OUTER JOIN [SkatingApp].[dbo].[Person] as P on Ct.SkaterId=P.PersonId
LEFT OUTER JOIN [SkatingApp].[dbo].[Skater] as S on Ct.SkaterId=S.PersonId
WHERE R.CompetitionId BETWEEN 4874 AND 4881
GROUP BY 
    SkaterId,
    FirstName,
    LastName,
    Club,
    AgeCategoryCode,
    Ct.Category,
	C.Category
ORDER BY AgeCategoryCode, C.Category, TotalNormalizedTime
"@

try {
    Write-Host "Connecting to SQL Server: $ServerName" -ForegroundColor Cyan
    
    # Build connection string
    if ($Username -and $Password) {
        # SQL Server authentication
        $connectionString = "Server=$ServerName;Database=$DatabaseName;User Id=$Username;Password=$Password;TrustServerCertificate=True;"
    }
    else {
        # Windows authentication
        $connectionString = "Server=$ServerName;Database=$DatabaseName;Integrated Security=True;TrustServerCertificate=True;"
    }
    
    # Create SQL connection
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    Write-Host "Connected successfully. Executing query..." -ForegroundColor Green
    
    # Execute query
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    $command.CommandTimeout = 120  # 2 minutes timeout
    
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter $command
    $dataset = New-Object System.Data.DataSet
    $adapter.Fill($dataset) | Out-Null
    
    $connection.Close()
    
    Write-Host "Query executed successfully. Retrieved $($dataset.Tables[0].Rows.Count) rows." -ForegroundColor Green
    
    # Convert to array of objects
    $results = @()
    foreach ($row in $dataset.Tables[0].Rows) {
        $obj = New-Object PSObject
        foreach ($column in $dataset.Tables[0].Columns) {
            $value = $row[$column.ColumnName]
            # Handle DBNull
            if ($value -is [System.DBNull]) {
                $value = $null
            }
            $obj | Add-Member -MemberType NoteProperty -Name $column.ColumnName -Value $value
        }
        $results += $obj
    }
    
    # Convert to JSON
    $jsonData = $results | ConvertTo-Json -Depth 10
    
    # Save to file if not skipped
    if (-not $SkipFileOutput) {
        Write-Host "Saving results to: $OutputFile" -ForegroundColor Cyan
        $jsonData | Out-File -FilePath $OutputFile -Encoding UTF8
        Write-Host "Results saved successfully." -ForegroundColor Green
    }
    
    # POST to HTTP endpoint
    Write-Host "Posting data to: $PostUrl" -ForegroundColor Cyan
    
    $headers = @{
        "Content-Type" = "application/json; charset=utf-8"
    }
    
    $response = Invoke-RestMethod -Uri $PostUrl -Method Post -Body $jsonData -Headers $headers -ContentType "application/json; charset=utf-8"
    
    Write-Host "Data posted successfully!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 5 | Write-Host
    
}
catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack trace: $($_.Exception.StackTrace)" -ForegroundColor Red
    exit 1
}
finally {
    # Ensure connection is closed
    if ($connection -and $connection.State -eq 'Open') {
        $connection.Close()
        Write-Host "Connection closed." -ForegroundColor Gray
    }
}

Write-Host "`nScript completed successfully!" -ForegroundColor Green

