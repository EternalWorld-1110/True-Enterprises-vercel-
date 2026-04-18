import express from 'express';
import { supabase } from '../lib/supabase.ts';
import { authMiddleware, adminMiddleware } from '../middleware/auth.ts';

const router = express.Router();

// GET /api/laptops
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('laptops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error('Fetch laptops error:', error);
    res.status(500).json({ error: 'Failed to fetch laptops', details: error.message });
  }
});

// POST /api/laptops (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const laptop = {
      ...req.body,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('laptops')
      .insert([laptop])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error: any) {
    console.error('Create laptop error:', error);
    res.status(500).json({ error: 'Failed to create laptop', details: error.message });
  }
});

// PUT /api/laptops/:id (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('laptops')
      .update(req.body)
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Laptop updated successfully' });
  } catch (error: any) {
    console.error('Update laptop error:', error);
    res.status(500).json({ error: 'Failed to update laptop', details: error.message });
  }
});

// DELETE /api/laptops/:id (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('laptops')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Laptop deleted successfully' });
  } catch (error: any) {
    console.error('Delete laptop error:', error);
    res.status(500).json({ error: 'Failed to delete laptop', details: error.message });
  }
});

export default router;
