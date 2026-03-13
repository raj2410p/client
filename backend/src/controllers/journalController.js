import db from "../db/database.js";
import { analyzeJournalText } from "../services/geminiServices.js";

export function createEntry(req, res) {
  try {
    const { userId, ambience, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({
        error: "userId and text are required"
      });
    }

    const stmt = db.prepare(`
      INSERT INTO journal_entries (userId, ambience, text)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(userId, ambience || null, text);

    return res.status(201).json({
      id: Number(result.lastInsertRowid),
      userId,
      ambience: ambience || null,
      text
    });
  } catch (error) {
    console.error("Create entry error:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}

export function getEntries(req, res) {
  try {
    const { userId } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM journal_entries
      WHERE userId = ?
      ORDER BY createdAt DESC
    `);

    const rows = stmt.all(userId);

    return res.json(rows);
  } catch (error) {
    console.error("Get entries error:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}

export async function analyzeJournal(req, res) {
  try {
    const { journalId } = req.body;

    if (!journalId) {
      return res.status(400).json({
        error: "journalId is required"
      });
    }

    const journal = db.prepare(`
      SELECT * FROM journal_entries
      WHERE id = ?
    `).get(journalId);

    if (!journal) {
      return res.status(404).json({
        error: "Journal entry not found"
      });
    }

    const existingAnalysis = db.prepare(`
      SELECT * FROM journal_analysis
      WHERE journalId = ?
    `).get(journalId);

    if (existingAnalysis) {
      return res.json({
        journalId,
        emotion: existingAnalysis.emotion,
        keywords: existingAnalysis.keywords
          ? existingAnalysis.keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
        summary: existingAnalysis.summary,
        cached: true
      });
    }

    const analysis = await analyzeJournalText(journal.text);

    const keywordString = Array.isArray(analysis.keywords)
      ? analysis.keywords.join(", ")
      : "";

    db.prepare(`
      INSERT INTO journal_analysis (journalId, emotion, keywords, summary)
      VALUES (?, ?, ?, ?)
    `).run(
      journalId,
      analysis.emotion,
      keywordString,
      analysis.summary
    );

    return res.status(201).json({
      journalId,
      emotion: analysis.emotion,
      keywords: analysis.keywords,
      summary: analysis.summary,
      cached: false
    });
  } catch (error) {
    console.error("Analyze journal error:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}

export function getInsights(req, res) {
  try {
    const { userId } = req.params;

    const totalEntriesRow = db.prepare(`
      SELECT COUNT(*) AS totalEntries
      FROM journal_entries
      WHERE userId = ?
    `).get(userId);

    const topEmotionRow = db.prepare(`
      SELECT ja.emotion, COUNT(*) AS count
      FROM journal_analysis ja
      JOIN journal_entries je ON je.id = ja.journalId
      WHERE je.userId = ? AND ja.emotion IS NOT NULL
      GROUP BY ja.emotion
      ORDER BY count DESC
      LIMIT 1
    `).get(userId);

    const mostUsedAmbienceRow = db.prepare(`
      SELECT ambience, COUNT(*) AS count
      FROM journal_entries
      WHERE userId = ? AND ambience IS NOT NULL AND ambience != ''
      GROUP BY ambience
      ORDER BY count DESC
      LIMIT 1
    `).get(userId);

    const keywordRows = db.prepare(`
      SELECT ja.keywords
      FROM journal_analysis ja
      JOIN journal_entries je ON je.id = ja.journalId
      WHERE je.userId = ? AND ja.keywords IS NOT NULL
      ORDER BY ja.createdAt DESC
      LIMIT 5
    `).all(userId);

    const keywordList = [];

    keywordRows.forEach((row) => {
      if (!row.keywords) return;

      row.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
        .forEach((k) => keywordList.push(k));
    });

    return res.json({
      totalEntries: totalEntriesRow?.totalEntries || 0,
      topEmotion: topEmotionRow?.emotion || null,
      mostUsedAmbience: mostUsedAmbienceRow?.ambience || null,
      recentKeywords: [...new Set(keywordList)].slice(0, 10)
    });
  } catch (error) {
    console.error("Get insights error:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}