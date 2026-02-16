// Admin Supabase client with service role key for privileged operations
// WARNING: Only use this in secure server-side contexts (Server Actions, Route Handlers)
// NEVER expose the service role key to the client
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

