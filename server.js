const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));

const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      groupList TEXT,
      finalReport TEXT,
      peerEval TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Endpoint to fetch the latest reports
app.get('/api/reports', (req, res) => {
  db.get('SELECT * FROM reports ORDER BY id DESC LIMIT 1', (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(row || {});
  });
});

app.post('/api/reports', (req, res) => {
  const { groupList, finalReport, peerEval } = req.body;
  let normalizedFinalReport = [];
  try {
    if (typeof finalReport === 'object') {
      normalizedFinalReport = finalReport;
    } else if (typeof finalReport === 'string') {
      normalizedFinalReport = JSON.parse(finalReport);
    }
  } catch (e) {
    console.error('Failed to parse finalReport, defaulting to empty array.');
    normalizedFinalReport = [];
  }
  normalizedFinalReport = JSON.stringify(normalizedFinalReport);
  const stmt = db.prepare(`INSERT INTO reports (groupList, finalReport, peerEval) VALUES (?, ?, ?)`);
  stmt.run([groupList, normalizedFinalReport, peerEval], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID });
  });
});

// Endpoint to delete a report record by id
app.delete('/api/reports', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing report id' });
  }
  db.run('DELETE FROM reports WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, deletedId: id });
  });
});

/* The download-report endpoint has been removed as per requirements */

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
