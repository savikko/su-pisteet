# Example usage of Query-And-Post-Results.ps1

# ============================================
# EASIEST WAY - Run with all defaults:
# ============================================
# Server: localhost
# Database: SkatingApp
# User: sa
# Password: skatingapp
# URL: https://su-pisteet.kikka.re/api/results
# ============================================

# Just run without any parameters:
.\Query-And-Post-Results.ps1

# Or use the wrapper scripts:
# .\run-query.ps1
# or double-click: run-query.bat


# ============================================
# CUSTOM CONFIGURATIONS
# ============================================

# Example 1: Different server but same defaults
# .\Query-And-Post-Results.ps1 -ServerName "myserver\SQLEXPRESS"

# Example 2: Post to local development server
# .\Query-And-Post-Results.ps1 `
#     -PostUrl "http://localhost:3000/api/results"

# Example 3: Different database
# .\Query-And-Post-Results.ps1 `
#     -DatabaseName "MyOtherDB"

# Example 4: Custom credentials
# .\Query-And-Post-Results.ps1 `
#     -ServerName "192.168.1.100\MSSQLSERVER" `
#     -Username "myuser" `
#     -Password "mypassword"

# Example 5: Skip file output (only POST)
# .\Query-And-Post-Results.ps1 -SkipFileOutput

# Example 6: Full custom configuration
# .\Query-And-Post-Results.ps1 `
#     -ServerName "remote-server" `
#     -DatabaseName "CustomDB" `
#     -Username "admin" `
#     -Password "SecurePass123" `
#     -PostUrl "https://custom-domain.com/api/results" `
#     -OutputFile "custom-output.json"

