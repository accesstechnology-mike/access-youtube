import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

// Initialize the database connection
const dbPath = path.join(process.cwd(), "lib", "db", "db.sqlite");
const db = new sqlite3.Database(dbPath);

async function checkBadWords(text) {
  const words = text
    .toLowerCase()
    .split(/[+\s]+/)
    .map(part => part.trim())
    .filter(word => word.length > 0);

  return new Promise((resolve, reject) => {
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
}

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const hasBadWords = await checkBadWords(text);

    return NextResponse.json({ hasBadWords });
  } catch (error) {
    console.error("Bad word check error:", error);
    return NextResponse.json(
      { error: "Failed to check text" },
      { status: 500 }
    );
  }
} 