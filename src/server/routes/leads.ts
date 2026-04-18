import express from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

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
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
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
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
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
