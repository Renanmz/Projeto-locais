import { createClient } from 'https://esm.sh/@supabase/supabase-js';

  // Conexão com Supabase
  const SUPABASE_URL = "https://betoutpugdmwpzomkhld.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldG91dHB1Z2Rtd3B6b21raGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2Mjc5MzksImV4cCI6MjA3MzIwMzkzOX0.i4vOCPer1tfDVKoAXpTbAAMR7xkhH96TIRG97bTRjo8";
  export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);