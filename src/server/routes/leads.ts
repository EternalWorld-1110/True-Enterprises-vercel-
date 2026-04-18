import express from 'express';
import { supabase } from '../lib/supabase.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware to verify admin token
const verifyAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Create a new lead (Public)
router.post('/', async (req, res) => {
  const { name, service, description, address } = req.body;
  
  if (!name || !service || !address) {
    return res.status(400).json({ error: 'Missing required lead fields' });
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name,
        service,
        description,
        address,
        status: 'new',
        createdAt: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Failed to save lead:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all leads (Admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update lead status (Admin only)
router.patch('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
