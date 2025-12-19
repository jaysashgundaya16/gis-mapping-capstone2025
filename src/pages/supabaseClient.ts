import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://czbrkcopyoyerhpwcswn.supabase.co'; // replace
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YnJrY29weW95ZXJocHdjc3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzc0ODgsImV4cCI6MjA3OTIxMzQ4OH0.JxZHi_h8juAan-idb3Mckoj9wO93csF8dJWoT1Z_QKY'; // replace

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
