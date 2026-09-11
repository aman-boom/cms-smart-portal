const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

function generateOTP() {
  return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit, matches frontend's maxlength=4
}

/* ── REGISTER ──
   body: { loginId, name, phone, role: 'student'|'teacher', department, designation? } */
router.post('/register', (req, res) => {
  const { loginId, name, phone, role, department, designation } = req.body || {};
  if (!loginId || !name || !phone || !role) {
    return res.status(400).json({ error: 'loginId, name, phone and role are required' });
  }
  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ error: "role must be 'student' or 'teacher'" });
  }
  const existing = db.prepare('SELECT id FROM users WHERE login_id = ?').get(loginId);
  if (existing) return res.status(409).json({ error: 'An account with this ID already exists' });

  const info = db.prepare(
    `INSERT INTO users (login_id, name, phone, role, department, designation) VALUES (?,?,?,?,?,?)`
  ).run(loginId, name, phone, role, department || null, designation || null);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ user });
});

/* ── SEND OTP ──
   body: { loginId, phone }
   In production this would call an SMS gateway. For dev, the OTP is returned
   directly in the response so the frontend can display/autofill it. */
router.post('/otp/send', (req, res) => {
  const { loginId, phone } = req.body || {};
  if (!loginId || !phone) return res.status(400).json({ error: 'loginId and phone are required' });

  const user = db.prepare('SELECT * FROM users WHERE login_id = ?').get(loginId);
  if (!user) return res.status(404).json({ error: 'No account found for this ID. Please register first.' });
  if (user.phone !== phone) return res.status(400).json({ error: 'Phone number does not match our records' });

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  db.prepare('INSERT INTO otp_requests (login_id, otp, expires_at) VALUES (?,?,?)').run(loginId, otp, expiresAt);

  // TODO: integrate a real SMS provider here instead of returning the OTP.
  res.json({ message: 'OTP sent', devOtp: otp, expiresInSeconds: 300 });
});

/* ── VERIFY OTP ──
   body: { loginId, otp } -> returns a JWT + user profile */
router.post('/otp/verify', (req, res) => {
  const { loginId, otp } = req.body || {};
  if (!loginId || !otp) return res.status(400).json({ error: 'loginId and otp are required' });

  const record = db.prepare(
    `SELECT * FROM otp_requests WHERE login_id = ? AND otp = ? AND consumed = 0 ORDER BY id DESC LIMIT 1`
  ).get(loginId, otp);

  if (!record) return res.status(400).json({ error: 'Invalid OTP' });
  if (record.expires_at < Date.now()) return res.status(400).json({ error: 'OTP has expired' });

  db.prepare('UPDATE otp_requests SET consumed = 1 WHERE id = ?').run(record.id);

  const user = db.prepare('SELECT * FROM users WHERE login_id = ?').get(loginId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = jwt.sign(
    { sub: user.id, loginId: user.login_id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({ token, user });
});

/* ── CURRENT USER ── */
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router;
