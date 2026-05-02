import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from '../src/server/routes/auth.js';
import laptopRoutes from '../src/server/routes/laptops.js';
import offerRoutes from '../src/server/routes/offers.js';
import leadRoutes from '../src/server/routes/leads.js';
import newsRoutes from '../src/server/routes/news.js';
import { supabase } from '../src/server/lib/supabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
const mountRouter = (path: string, router: any) => {
  app.use(path, router);
  app.use(path.replace('/api', ''), router); // Also mount without /api prefix for Vercel
};

mountRouter('/api/auth', authRoutes);
mountRouter('/api/laptops', laptopRoutes);
mountRouter('/api/offers', offerRoutes);
mountRouter('/api/leads', leadRoutes);
mountRouter('/api/news', newsRoutes);

// Ping check for basic server health (no DB)
app.get('/api/ping', (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

// Health check with DB verification
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('laptops').select('id').limit(1);
    if (error) throw error;
    res.json({ 
      status: 'ok', 
      db: 'connected',
      tables: !!data,
      env: process.env.NODE_ENV
    });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'error', 
      db: 'failed', 
      error: err.message,
      hint: 'Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    });
  }
});

// Async setup (Database seeding)
const initPromise = (async () => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('[Seed] Skipping seeding: Missing Supabase environment variables');
      return;
    }
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      console.error('[Seed] Error checking users table:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('[Seed] No users found. Initializing admin account...');
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('password123', 10);
      const { error: insertError } = await supabase.from('users').insert([{
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        email: 'admin@trueenterprises.com'
      }]);
      
      if (insertError) {
        console.error('[Seed] Failed to create admin user:', insertError.message);
      } else {
        console.log('[Seed] Admin account created successfully (admin / password123)');
      }

      await supabase.from('laptops').insert([{
        name: 'Dell Latitude 7490',
        price: 35000,
        specifications: 'Core i7 8th Gen, 16GB RAM, 512GB SSD',
        condition: 'Excellent',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
        created_at: new Date().toISOString()
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

// Development Vite Server (Lazy load to avoid production dependency issues)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
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
