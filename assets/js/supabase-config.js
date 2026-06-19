// Supabase Configuration
// IMPORTANT: Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://rkeomjgvnedolkdppant.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_05FDWbducZ1MlKZLDsvxpw_QQQUUsvS';

// Initialize Supabase Client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
