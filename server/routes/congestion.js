import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// POST /api/congestion/predict
router.post('/predict', async (req, res) => {
  const { startDate, days } = req.body;
  // Use __dirname to ensure correct path resolution
  const scriptPath = path.resolve(__dirname, '../ai/analyse_congestion.py');
  // Pass arguments to the Python script
  let args = '';
  if (startDate) args += ` --start-date \"${startDate}\"`;
  if (days) args += ` --days ${days}`;
  exec(`python "${scriptPath}"${args}`, (error, stdout, stderr) => {
    if (error) {
      console.log('PYTHON ERROR:', stderr);
      return res.status(500).json({ error: stderr || error.message, raw: stdout });
    }
    // Debug: log output
    console.log('PYTHON STDOUT:', stdout);
    // Try to fix encoding issues (force latin1/ISO-8859-1 to utf8)
    const fixedStdout = Buffer.from(stdout, 'binary').toString('latin1');
    // Replace known bad encodings for French
    const normalized = fixedStdout
      .replace(/journali[ý�]re/g, 'journalière')
      .replace(/Pr[ý�]vision/g, 'Prévision');
    const marker = 'Prévision de la congestion pour les prochains jours:';
    const idx = normalized.indexOf(marker);
    if (idx === -1) {
      return res.status(500).json({ error: 'Prediction output not found.', raw: normalized });
    }
    const output = normalized.substring(idx + marker.length);
    // Remove any leading/trailing whitespace and split by newlines
    const lines = output.trim().split(/\r?\n/).filter(l => l && !l.startsWith('date') && !/^[ \t]*$/.test(l));
    // Log lines for debugging
    console.log('PARSED LINES:', lines);
    const predictions = lines.map(line => {
      // Try to match the date and value
      const match = line.match(/(\d{4}-\d{2}-\d{2})\s+([\d\.eE+-]+)/);
      if (!match) return null;
      const [, date, congestion_predite] = match;
      return { date, congestion_predite: parseFloat(congestion_predite) };
    }).filter(Boolean);
    if (!predictions.length) {
      return res.status(500).json({ error: 'No predictions parsed.', raw: output, lines });
    }
    res.json({ predictions });
  });
});

export default router;
