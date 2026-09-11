const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* GET /api/faculty */
router.get('/', (req, res) => {
  res.json({ faculty: db.prepare('SELECT * FROM faculty_directory ORDER BY created_at DESC').all() });
});

/* POST /api/faculty  body: { name, department, slot } */
router.post('/', requireAuth, (req, res) => {
  const { name, department, slot } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const info = db.prepare(
    'INSERT INTO faculty_directory (name, department, slot, added_by) VALUES (?,?,?,?)'
  ).run(name, department || null, slot || null, req.user.sub);
  res.status(201).json({ faculty: db.prepare('SELECT * FROM faculty_directory WHERE id = ?').get(info.lastInsertRowid) });
});

router.delete('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM faculty_directory WHERE id = ? AND added_by = ?')
    .get(req.params.id, req.user.sub);
  if (!row) return res.status(404).json({ error: 'Entry not found' });
  db.prepare('DELETE FROM faculty_directory WHERE id = ?').run(row.id);
  res.json({ message: 'Removed' });
});

module.exports = router;
