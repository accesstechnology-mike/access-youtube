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
    const hasBadWords = await new Promise((resolve, reject) => {
      db.all("SELECT word FROM bad_words", [], (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
          return;
        }
        const badWords = new Set(rows.map((row) => row.word));
        const hasBadWord = words.some((word) => badWords.has(word));
        resolve(hasBadWord);
      });
    });

    return NextResponse.json({ hasBadWords });
  } catch (error) {
    console.error("Bad words check error:", error);
    return NextResponse.json({ hasBadWords: false });
  }
} 