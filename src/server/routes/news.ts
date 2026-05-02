import express from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, adminMiddleware } from '../lib/middleware/auth';

const router = express.Router();

// Get news (Public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('publishedAt', { ascending: false });

    if (error) {
      return res.json([]);
    }
    
    if (data.length === 0) {
      const samples = [
        {
          title: "Top Laptop Motherboard Repair Trends in 2024",
          category: "Hardware",
          summary: "Micro-soldering and integrated component replacement are becoming essential as laptop manufacturers move towards monolithic designs.",
          imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          publishedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
      return res.json(samples);
    }

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST news (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, category, summary, imageUrl, videoUrl } = req.body;
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([{ title, category, summary, imageUrl, videoUrl, publishedAt: new Date().toISOString() }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/news/:id (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('news')
      .update(req.body)
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Article updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/news/:id (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Article removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
