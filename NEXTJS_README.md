# Skating Results Viewer - Next.js App

A modern web application to receive, store, and display skating competition results.

## Features

- 📥 **API Endpoint** - Receives JSON data via HTTP POST
- 💾 **SQLite Database** - Stores results persistently
- 📊 **Beautiful UI** - Modern, responsive interface with Tailwind CSS
- 🔍 **Category Filtering** - Filter results by age category
- 🏆 **Rankings** - Automatic sorting by performance
- 🎨 **Color-coded Data** - Easy-to-read visual hierarchy

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Test with Example Data

Post the included test data:

**PowerShell:**
```powershell
.\post-test-data.ps1
```

**Bash/macOS:**
```bash
./post-test-data.sh
```

### 4. Use with Real Data

Update your PowerShell script to post to:
```
http://localhost:3000/api/results
```

Example:
```powershell
.\Query-And-Post-Results.ps1 `
    -ServerName "localhost" `
    -PostUrl "http://localhost:3000/api/results"
```

## Project Structure

```
psh/
├── app/
│   ├── api/
│   │   └── results/
│   │       └── route.ts          # API endpoint for receiving data
│   ├── components/
│   │   └── ResultsTable.tsx      # Main results table component
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/
│   └── db.ts                     # SQLite database utilities
├── skating-results.db            # SQLite database (auto-created)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## API Endpoints

### POST /api/results

Receives and stores skating results data.

**Request:**
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

**Response:**
```json
{
  "success": true,
  "message": "Successfully saved 25 results to database",
  "count": 25,
  "timestamp": "2024-11-23T10:30:00.000Z"
}
```

### GET /api/results

Returns information about the API endpoint.

## Database Schema

The SQLite database has a single `results` table:

```sql
CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  FirstName TEXT,
  LastName TEXT,
  Club TEXT,
  AgeCategoryCode TEXT,
  M300m_1_aika REAL,
  M300m_1_pisteet REAL,
  M500m_1_aika REAL,
  M500m_1_pisteet REAL,
  M300m_2_aika REAL,
  M300m_2_pisteet REAL,
  M500m_2_aika REAL,
  M500m_2_pisteet REAL,
  TotalNormalizedTime REAL,
  imported_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## Features Explained

### Category Filtering
The results table includes a dropdown to filter by age category, making it easy to view specific groups.

### Ranking Display
- Top 3 positions are highlighted with gold background
- Rank numbers shown as badges for top performers
- Results sorted by `TotalNormalizedTime`

### Responsive Design
- Mobile-friendly layout
- Horizontal scrolling for large tables
- Sticky headers for easy navigation

### Data Visualization
- Color-coded columns (300m in indigo, 500m in purple)
- Total column highlighted in green
- Hover effects for better UX

## Testing the API

### Using curl:

```bash
curl -X POST http://localhost:3000/api/results \
  -H "Content-Type: application/json" \
  -d '[{"FirstName":"Test","LastName":"User","Club":"Test Club","AgeCategoryCode":"U15","TotalNormalizedTime":100.0}]'
```

### Using PowerShell:

```powershell
$data = @'
[{"FirstName":"Test","LastName":"User","Club":"Test Club","AgeCategoryCode":"U15","TotalNormalizedTime":100.0}]
'@

Invoke-RestMethod -Uri "http://localhost:3000/api/results" -Method Post -Body $data -ContentType "application/json"
```

## Troubleshooting

### Port Already in Use
If port 3000 is in use, specify a different port:
```bash
PORT=3001 npm run dev
```

### Database Locked
If you get database locked errors, ensure only one instance of the app is running.

### Build Errors
Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **better-sqlite3** - Synchronous SQLite3 bindings
- **React 18** - UI library

## License

MIT

