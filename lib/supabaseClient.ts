import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lovmcszcyktqbvixulxw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1jc3pjeWt0cWJ2aXh1bHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNzk0NDEsImV4cCI6MjA1OTY1NTQ0MX0.FA-il1dWafAI_6P3bLcf1_XylVKRu16SsxCjy4YFPkE"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env vars are missing')
}

console.log('Using Supabase env:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)