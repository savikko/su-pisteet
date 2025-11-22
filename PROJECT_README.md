# Skating Competition Results - Complete Solution

A complete end-to-end solution for extracting skating competition results from SQL Server and displaying them in a modern web interface.

## 🎯 Overview

This project consists of two main components:

1. **PowerShell Script** - Extracts data from SQL Server and posts to API
2. **Next.js Web App** - Receives data and displays results in a beautiful UI

## 📦 What's Included

```
psh/
├── post.cmd                     # 🖱️ DOUBLE-CLICK THIS! (Create desktop shortcut)
├── Query-And-Post-Results.ps1   # PowerShell script for SQL Server
├── run-query.ps1                # Simple wrapper
├── run-query.bat                # Windows batch file
├── example-usage.ps1             # Example configurations
├── post-test-data.ps1           # Test script (PowerShell)
├── post-test-data.sh            # Test script (Bash/macOS)
├── results.json                 # Example test data (25 results)
├── README.md                     # PowerShell script documentation
├── NEXTJS_README.md             # Next.js app documentation
├── PROJECT_README.md            # This file
├── DESKTOP_SHORTCUT_INSTRUCTIONS.md  # How to create desktop shortcut
│
├── app/                         # Next.js application
│   ├── api/results/route.ts     # API endpoint
│   ├── components/              # React components
│   ├── page.tsx                 # Main page
│   └── layout.tsx               # Layout
│
├── lib/
│   └── db.ts                    # SQLite database utilities
│
└── [Configuration files]
```

## 🚀 Quick Start Guide

### Step 1: Setup Next.js App

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will run at `http://localhost:3000`

### Step 2: Run PowerShell Script

**Super Easy - Double-Click:**

Just double-click: **`post.cmd`** 🖱️

*Tip: Create a desktop shortcut for even easier access! See [Desktop Shortcut Instructions](DESKTOP_SHORTCUT_INSTRUCTIONS.md)*

**Or run from command line:**
```powershell
.\Query-And-Post-Results.ps1
```

**For local development:**
```powershell
.\Query-And-Post-Results.ps1 -PostUrl "http://localhost:3000/api/results"
```

### Step 3: Post Test Data (Optional)

To test with the included example data:

**PowerShell:**
```powershell
.\post-test-data.ps1
```

**Bash/macOS:**
```bash
./post-test-data.sh
```

### Step 4: View Results

Open your browser to `http://localhost:3000` to see the results!

## 📊 Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌──────────┐
│  SQL Server │ --> │ PowerShell Script│ --> │ Next.js API  │ --> │  SQLite  │
│  (MS SQL)   │     │  (Query & Post)  │     │   Endpoint   │     │ Database │
└─────────────┘     └──────────────────┘     └──────────────┘     └──────────┘
                                                      │
                                                      ↓
                                              ┌──────────────┐
                                              │  Web UI      │
                                              │  (React)     │
                                              └──────────────┘
```

## 🎨 Features

### PowerShell Script
- ✅ Windows & SQL Server authentication support
- ✅ Configurable connection strings
- ✅ JSON output to file and HTTP POST
- ✅ Comprehensive error handling
- ✅ UTF-8 encoding for Finnish characters

### Next.js Web App
- ✅ RESTful API endpoint
- ✅ SQLite database for persistence
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Category filtering
- ✅ Automatic ranking
- ✅ Real-time data updates
- ✅ Mobile-friendly design

## 📝 Usage Examples

### 🖱️ Easiest Way - Double-Click!

Just double-click: **`post.cmd`**

**Pro Tip:** Create a desktop shortcut! See → [Desktop Shortcut Instructions](DESKTOP_SHORTCUT_INSTRUCTIONS.md)

This uses built-in defaults:
- Server: `localhost`
- Database: `SkatingApp`
- User: `sa` / Pass: `skatingapp`
- Posts to: `https://su-pisteet.kikka.re/api/results`

### Command Line

```powershell
.\Query-And-Post-Results.ps1
```

### Local Development Testing

```powershell
.\Query-And-Post-Results.ps1 -PostUrl "http://localhost:3000/api/results"
```

### Different Server

```powershell
.\Query-And-Post-Results.ps1 -ServerName "myserver\SQLEXPRESS"
```

### Custom Credentials

```powershell
.\Query-And-Post-Results.ps1 -Username "myuser" -Password "mypass"
```

## 🔧 Configuration

### PowerShell Script - Pre-Configured!

The script has sensible defaults built-in:
- `ServerName` = `localhost`
- `DatabaseName` = `SkatingApp`
- `Username` = `sa`
- `Password` = `skatingapp`
- `PostUrl` = `https://su-pisteet.kikka.re/api/results`

**No configuration needed!** Just run `.\Query-And-Post-Results.ps1`

Override any value by passing parameters:
```powershell
.\Query-And-Post-Results.ps1 -ServerName "otherserver"
```

### Next.js App

No configuration needed! The app will:
- Auto-create SQLite database on first run
- Listen on port 3000 by default
- Accept data at `/api/results` endpoint

## 📱 Web Interface

The web interface displays:

- **Results Table** with all competition data
- **Category Filter** dropdown
- **Rankings** with top 3 highlighted
- **Color-coded columns** for easy reading:
  - 🔵 300m distances (indigo)
  - 🟣 500m distances (purple)
  - 🟢 Total time (green)

## 🗄️ Database

Results are stored in SQLite with this structure:

| Column | Type | Description |
|--------|------|-------------|
| FirstName | TEXT | Skater's first name |
| LastName | TEXT | Skater's last name |
| Club | TEXT | Club name |
| AgeCategoryCode | TEXT | Age category |
| M300m_1_aika | REAL | 300m Day 1 time |
| M300m_1_pisteet | REAL | 300m Day 1 points |
| M500m_1_aika | REAL | 500m Day 1 time |
| M500m_1_pisteet | REAL | 500m Day 1 points |
| M300m_2_aika | REAL | 300m Day 2 time |
| M300m_2_pisteet | REAL | 300m Day 2 points |
| M500m_2_aika | REAL | 500m Day 2 time |
| M500m_2_pisteet | REAL | 500m Day 2 points |
| TotalNormalizedTime | REAL | Total normalized time |

## 🧪 Testing with Example Data

The project includes `results.json` with 25 real skating results for testing.

### Quick Test

1. Start Next.js app: `npm run dev`
2. Run test script:
   - **PowerShell**: `.\post-test-data.ps1`
   - **Bash/macOS**: `./post-test-data.sh`
3. View at: `http://localhost:3000`

### Manual Test with curl

```bash
curl -X POST http://localhost:3000/api/results \
  -H "Content-Type: application/json" \
  -d @results.json
```

### What's in the Test Data?

- **25 competitors** across categories:
  - BD (Boys D) - 2 results
  - BE (Boys E) - 7 results  
  - BF (Boys F) - 3 results
  - BG (Boys G) - 4 results
  - GD (Girls D) - 2 results
  - GE (Girls E) - 1 result
  - GF (Girls F) - 4 results
- Multiple clubs: SU, HLK, Kensu, PoPy
- 300m and 500m results over 2 days
- Some null values (missed races) for realistic testing

## 🔍 Troubleshooting

### PowerShell Script Issues

**Connection failed:**
- Verify SQL Server is running
- Check server name and credentials
- Ensure SQL Server allows remote connections

**Query timeout:**
- Increase timeout in script (default: 120 seconds)
- Check SQL Server performance

### Next.js App Issues

**Port 3000 in use:**
```bash
PORT=3001 npm run dev
```

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database locked:**
- Ensure only one app instance is running
- Check file permissions

## 📚 Documentation

- **[README.md](README.md)** - PowerShell script documentation
- **[NEXTJS_README.md](NEXTJS_README.md)** - Next.js app documentation
- **[example-usage.ps1](example-usage.ps1)** - Usage examples

## 🛠️ Technologies

### Backend
- PowerShell 5.0
- .NET SqlClient
- MS SQL Server

### Web Application
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- better-sqlite3

## 🎯 Development Workflow

1. **Make changes to SQL query** → Edit `Query-And-Post-Results.ps1`
2. **Run script** → `.\Query-And-Post-Results.ps1 -ServerName "..." -PostUrl "..."`
3. **View results** → Open browser to `http://localhost:3000`
4. **Iterate** → Data persists in SQLite, re-run script to update

## 🚢 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Production with PM2
```bash
npm install -g pm2
npm run build
pm2 start "npm start" --name skating-results
```

## 📄 License

MIT

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the detailed README files
3. Verify your SQL Server connection
4. Check Next.js app logs

---

**Happy Skating! 🏃‍♂️⛸️**

