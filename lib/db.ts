import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'skating-results.db');

export interface SkatingResult {
  id?: number;
  FirstName: string | null;
  LastName: string | null;
  Club: string | null;
  AgeCategoryCode: string | null;
  M300m_1_aika: number | null;
  M300m_1_pisteet: number | null;
  M500m_1_aika: number | null;
  M500m_1_pisteet: number | null;
  M300m_2_aika: number | null;
  M300m_2_pisteet: number | null;
  M500m_2_aika: number | null;
  M500m_2_pisteet: number | null;
  TotalNormalizedTime: number | null;
  imported_at?: string;
}

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initDatabase();
  }
  return db;
}

function initDatabase() {
  if (!db) return;
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS results (
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
  `);
}

export function saveResults(results: SkatingResult[]) {
  const database = getDatabase();
  
  // Clear existing data
  database.exec('DELETE FROM results');
  
  // Insert new data
  const insert = database.prepare(`
    INSERT INTO results (
      FirstName, LastName, Club, AgeCategoryCode,
      M300m_1_aika, M300m_1_pisteet, M500m_1_aika, M500m_1_pisteet,
      M300m_2_aika, M300m_2_pisteet, M500m_2_aika, M500m_2_pisteet,
      TotalNormalizedTime
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertMany = database.transaction((results: SkatingResult[]) => {
    for (const result of results) {
      insert.run(
        result.FirstName,
        result.LastName,
        result.Club,
        result.AgeCategoryCode,
        result.M300m_1_aika,
        result.M300m_1_pisteet,
        result.M500m_1_aika,
        result.M500m_1_pisteet,
        result.M300m_2_aika,
        result.M300m_2_pisteet,
        result.M500m_2_aika,
        result.M500m_2_pisteet,
        result.TotalNormalizedTime
      );
    }
  });
  
  insertMany(results);
  return results.length;
}

export function getAllResults(): SkatingResult[] {
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM results ORDER BY AgeCategoryCode, TotalNormalizedTime');
  return stmt.all() as SkatingResult[];
}

export function getResultsByCategory(category: string): SkatingResult[] {
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM results WHERE AgeCategoryCode = ? ORDER BY TotalNormalizedTime');
  return stmt.all(category) as SkatingResult[];
}

export function getCategories(): string[] {
  const database = getDatabase();
  const stmt = database.prepare('SELECT DISTINCT AgeCategoryCode FROM results WHERE AgeCategoryCode IS NOT NULL ORDER BY AgeCategoryCode');
  const rows = stmt.all() as { AgeCategoryCode: string }[];
  return rows.map(row => row.AgeCategoryCode);
}

