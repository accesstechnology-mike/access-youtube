import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

// Initialize the database connection
const dbPath = path.join(process.cwd(), "lib", "db", "db.sqlite");
const db = new sqlite3.Database(dbPath);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json({ hasBadWords: false });
  }

  const words = term
    .split(/[+\s]+/)
    .map((part) => decodeURIComponent(part.trim()))
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());

  try {
    const result = await new Promise((resolve, reject) => {
      db.all("SELECT word FROM bad_words", [], (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
          return;
        }
        const badWords = new Set(rows.map((row) => row.word));
        const foundBadWords = words.filter((word) => badWords.has(word));
        resolve({
          hasBadWords: foundBadWords.length > 0,
          foundWords: foundBadWords
        });
      });
    });

    // Log when bad words are detected
    if (result.hasBadWords) {
      console.log(`[Bad Words] Detected inappropriate search:`, {
        term: term.substring(0, 100),
        foundBadWords: result.foundWords,
        userAgent: request.headers.get('user-agent')?.substring(0, 100) || 'unknown',
        referer: request.headers.get('referer')?.substring(0, 100) || 'direct'
      });
    }

    return NextResponse.json({ hasBadWords: result.hasBadWords });
  } catch (error) {
    console.error("Bad words check error:", error);
    return NextResponse.json({ hasBadWords: false });
  }
} 