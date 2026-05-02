import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`[Auth] Attempting login for username: ${username}`);
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error) {
      console.error('[Auth] Supabase Query Failed:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message
      });
    }

    if (!users || users.length === 0) {
      console.log(`[Auth] User not found: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userData = users[0];
    
    if (!userData.password) {
      return res.status(500).json({ error: 'User record corrupted: Missing password hash' });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: userData.id, username: userData.username, role: userData.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { username: userData.username, role: userData.role } });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: `Login failed: ${error.message || 'Unknown error'}` });
  }
});

// Admin Registration (Admin only)
router.post('/register-admin', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Only admins can add other admins' });

    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(400).json({ error: 'Missing fields' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword, email, role: 'admin' }])
      .select('username, email, role');

    if (error) throw error;
    res.status(201).json({ message: 'Admin added', user: data[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Admins List (Admin only)
router.get('/admins', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, createdAt')
      .eq('role', 'admin');

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
