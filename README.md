# SQL Server Query and HTTP POST Script

PowerShell script to query skating competition results from SQL Server and post them to an HTTP endpoint.

## Prerequisites

- PowerShell 5.0 or higher
- Access to SQL Server instance
- Network access to the HTTP endpoint

## Usage

### 🖱️ Easiest Way - Double-Click

Just double-click: **`post.cmd`**

**Create a Desktop Shortcut:** See [DESKTOP_SHORTCUT_INSTRUCTIONS.md](DESKTOP_SHORTCUT_INSTRUCTIONS.md)

### Command Line

```powershell
.\Query-And-Post-Results.ps1
```

**Default values:**
- Server: `localhost`
- Database: `SkatingApp`
- Username: `sa`
- Password: `skatingapp`
- URL: `https://su-pisteet.kikka.re/api/results`

### Custom Server or Credentials

```powershell
# Different server
.\Query-And-Post-Results.ps1 -ServerName "myserver\SQLEXPRESS"

# Different credentials
.\Query-And-Post-Results.ps1 -Username "myuser" -Password "mypass"
```

### Custom Database and Output File

```powershell
.\Query-And-Post-Results.ps1 `
    -ServerName "localhost" `
    -DatabaseName "SkatingApp" `
    -OutputFile "skating_results.json" `
    -PostUrl "https://api.example.com/results"
```

### Skip File Output (Only POST to HTTP)

```powershell
.\Query-And-Post-Results.ps1 `
    -ServerName "localhost" `
    -PostUrl "https://api.example.com/results" `
    -SkipFileOutput
```

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `ServerName` | No | `localhost` | SQL Server instance name |
| `DatabaseName` | No | `SkatingApp` | Database name |
| `Username` | No | `sa` | SQL Server username |
| `Password` | No | `skatingapp` | SQL Server password |
| `OutputFile` | No | `results.json` | Path to save JSON output |
| `PostUrl` | No | `https://su-pisteet.kikka.re/api/results` | HTTP endpoint URL |
| `SkipFileOutput` | No | `false` | Skip saving to file, only POST to HTTP |

## Output Format

The script converts the SQL query results to JSON format with all columns preserved. Example:

```json
[
  {
    "FirstName": "John",
    "LastName": "Doe",
    "Club": "Speed Club",
    "AgeCategoryCode": "U15",
    "M300m_1_aika": 26.5,
    "M300m_1_pisteet": 44.17,
    "M500m_1_aika": 45.2,
    "M500m_1_pisteet": 45.2,
    "M300m_2_aika": 26.3,
    "M300m_2_pisteet": 43.83,
    "M500m_2_aika": 44.8,
    "M500m_2_pisteet": 44.8,
    "TotalNormalizedTime": 178.0
  }
]
```

## Features

- ✅ Supports both Windows and SQL Server authentication
- ✅ Configurable connection timeout (120 seconds)
- ✅ Handles NULL values from database
- ✅ UTF-8 encoding for international characters
- ✅ Saves results to JSON file
- ✅ Posts results to HTTP endpoint
- ✅ Detailed error messages and colored console output
- ✅ Proper connection cleanup

## Error Handling

The script includes comprehensive error handling:
- Connection errors will display detailed messages
- Query timeout errors are caught
- HTTP POST failures are reported
- Database connections are properly closed even on error

## Notes

- The script uses `TrustServerCertificate=True` to handle self-signed certificates. Remove this if your SQL Server has a valid certificate.
- Default query timeout is 120 seconds
- NULL values in database are converted to `null` in JSON

