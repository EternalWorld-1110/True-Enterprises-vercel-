import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://wynvzaajjulpowwffkio.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  console.log('--- Database Secret & Connection Check ---');
  
  if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is NOT set in the environment.');
    console.log('Please make sure you clicked "Apply changes" after adding it.');
    return;
  }
  
  if (supabaseKey.startsWith('sb_publishable')) {
    console.error('⚠️ Warning: The key provided looks like a public key, not the secret service role key.');
  } else {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY is detected in the environment.');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Testing administrative access...');
  const tables = ['users', 'laptops', 'offers'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    
    if (error) {
       console.error(`❌ Table "${table}" error:`, error.message);
    } else {
      console.log(`✅ Table "${table}" is accessible (Authorized).`);
    }
  }
}

check();
