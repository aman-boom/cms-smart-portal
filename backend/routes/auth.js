const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Set these on Render → Environment tab
const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY;

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

/* ── VERIFY OTP-WIDGET TOKEN ──
   body: { loginId, "access-token": "<jwt from the OTP widget's success callback>" }

   Flow now:
   1. Frontend opens the MSG91 OTP widget (Send OTP + Verify OTP both happen
      inside the widget itself — no /otp/send or /otp/verify needed anymore).
   2. Widget's `success(data)` callback fires with a short-lived access-token.
   3. Frontend POSTs { loginId, "access-token": data.token } here.
   4. This route re-verifies that token directly with MSG91's server
      (never trusts the client-side callback alone), confirms it matches
      the phone number on file for loginId, then issues your app's own JWT. */
router.post('/otp/verify', async (req, res) => {
  const { loginId, 'access-token': widgetToken } = req.body || {};
  if (!loginId || !widgetToken) {
    return res.status(400).json({ error: 'loginId and access-token are required' });
  }
  if (!MSG91_AUTHKEY) {
    return res.status(500).json({ error: 'MSG91_AUTHKEY is not configured on the server' });
  }

  const user = db.prepare('SELECT * FROM users WHERE login_id = ?').get(loginId);
  if (!user) return res.status(404).json({ error: 'No account found for this ID. Please register first.' });

  try {
    const msgRes = await fetch('https://control.msg91.com/api/v5/widget/verifyAccessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        authkey: MSG91_AUTHKEY,
        'access-token': widgetToken,
      }),
    });
    const data = await msgRes.json();

    if (data.type !== 'success') {
      return res.status(400).json({ error: data.message || 'Invalid or expired OTP token' });
    }

    // data.message holds the verified identifier (mobile number, usually with
    // country code, e.g. "91XXXXXXXXXX"). Compare against the stored phone,
    // stripping non-digits and allowing the country-code prefix either way.
    const verifiedDigits = String(data.message).replace(/\D/g, '');
    const storedDigits = String(user.phone).replace(/\D/g, '');
    const matches =
      verifiedDigits === storedDigits ||
      verifiedDigits.endsWith(storedDigits) ||
      storedDigits.endsWith(verifiedDigits);

    if (!matches) {
      return res.status(400).json({ error: 'Verified number does not match the phone on this account' });
    }

    const token = jwt.sign(
      { sub: user.id, loginId: user.login_id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('MSG91 verifyAccessToken error:', err);
    res.status(502).json({ error: 'Could not verify OTP with MSG91 right now' });
  }
});

/* ── CURRENT USER ── */
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router;
