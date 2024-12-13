import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any;

export async function initializeDB() {
  if (!db) {
    db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        linkedin_id TEXT UNIQUE,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return db;
}

export async function getDB() {
  if (!db) {
    await initializeDB();
  }
  return db;
}