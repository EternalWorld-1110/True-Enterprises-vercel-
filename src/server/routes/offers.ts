import express from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, adminMiddleware } from '../lib/middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let query = supabase.from('offers').select('*');
    
    // If not requesting all (public view), only show active
    if (req.query.all !== 'true') {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error('Fetch offers error:', error);
    res.status(500).json({ error: 'Failed to fetch offers', details: error.message });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error: any) {
    console.error('Create offer error:', error);
    res.status(500).json({ error: 'Failed to create offer', details: error.message });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('offers')
      .update(req.body)
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Offer updated successfully' });
  } catch (error: any) {
    console.error('Update offer error:', error);
    res.status(500).json({ error: 'Failed to update offer', details: error.message });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Offer deleted successfully' });
  } catch (error: any) {
    console.error('Delete offer error:', error);
    res.status(500).json({ error: 'Failed to delete offer', details: error.message });
  }
});

export default router;
