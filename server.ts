import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './src/server/routes/auth.ts';
import laptopRoutes from './src/server/routes/laptops.ts';
import offerRoutes from './src/server/routes/offers.ts';
import leadRoutes from './src/server/routes/leads.ts';
import newsRoutes from './src/server/routes/news.ts';
import { supabase } from './src/server/lib/supabase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Async setup (Database seeding)
const initPromise = (async () => {
  if (process.env.VERCEL === '1') return; // Skip seeding on Vercel deployment by default or handle differently
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
    const { data } = await supabase.from('users').select('id').limit(1);
    if (!data || data.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('password123', 10);
      await supabase.from('users').insert([{
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        email: 'admin@trueenterprises.com'
      }]);
      await supabase.from('laptops').insert([{
        name: 'Dell Latitude 7490',
        price: 35000,
        specifications: 'Core i7 8th Gen, 16GB RAM, 512GB SSD',
        condition: 'Excellent',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date().toISOString()
      }]);
    }
  } catch (err) {
    console.error('[Seed] Initialization failed:', err);
  }
})();

// Ensure DB is ready for API
app.use('/api', async (req, res, next) => {
  await initPromise;
  next();
});

// Production Static Serving
if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  // Note: Vercel routing handles the fallback to index.html via vercel.json rewrites
  // but we keep this for local production testing
  app.get('*', (req, res) => {
    if (res.headersSent) return;
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Development Vite Server (Lazy load to avoid production dependency issues)
  const setupVite = async () => {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev server could not be initialized (expected in production)');
    }
  };
  setupVite();
}

if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
