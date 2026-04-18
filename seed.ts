import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://wynvzaajjulpowwffkio.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase Seed] Missing environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Supabase data...');

  // Create Admin User
  const adminUsername = 'admin';
  const adminPassword = 'password123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const { error: userError } = await supabase
    .from('users')
    .upsert({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
      email: 'admin@trueenterprises.com'
    }, { onConflict: 'username' });

  if (userError) console.error('Error seeding admin user:', userError);
  else console.log('Admin user created/updated: admin / password123');

  // Create Sample Laptops
  const laptops = [
    {
      name: 'Dell Latitude 7490',
      price: 350,
      specifications: 'Core i7 8th Gen, 16GB RAM, 512GB SSD, 14" FHD',
      condition: 'Excellent',
      imageUrl: 'https://picsum.photos/seed/laptop1/400/300',
      createdAt: new Date().toISOString()
    },
    {
      name: 'HP EliteBook 840 G5',
      price: 320,
      specifications: 'Core i5 8th Gen, 8GB RAM, 256GB SSD, 14" FHD',
      condition: 'Good',
      imageUrl: 'https://picsum.photos/seed/laptop2/400/300',
      createdAt: new Date().toISOString()
    },
    {
      name: 'ThinkPad X1 Carbon Gen 6',
      price: 450,
      specifications: 'Core i7 8th Gen, 16GB RAM, 512GB SSD, 14" WQHD',
      condition: 'Near Mint',
      imageUrl: 'https://picsum.photos/seed/laptop3/400/300',
      createdAt: new Date().toISOString()
    }
  ];

  const { error: laptopError } = await supabase
    .from('laptops')
    .insert(laptops);

  if (laptopError) console.error('Error seeding laptops:', laptopError);
  else console.log('Sample laptops seeded.');

  // Create Sample Offers
  const offers = [
    {
      title: 'Summer Sale!',
      description: 'Get 20% off on all CCTV installations this month.',
      active: true
    },
    {
      title: 'Free RAM Upgrade',
      description: 'Buy any second-hand laptop above $400 and get a free 8GB RAM upgrade.',
      active: true
    }
  ];

  const { error: offerError } = await supabase
    .from('offers')
    .insert(offers);

  if (offerError) console.error('Error seeding offers:', offerError);
  else console.log('Sample offers seeded.');

  console.log('Seeding complete.');
  process.exit();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
