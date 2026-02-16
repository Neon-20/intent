// Authentication utilities for admin access
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Check if the current user is an admin
 * Returns the admin user data if authenticated, otherwise redirects to login
 */
export async function requireAdmin() {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/admin/login')
  }

  // Check if user is in admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (adminError || !adminUser) {
    redirect('/admin/login')
  }

  return { user, adminUser }
}

/**
 * Check if the current user is an admin (without redirect)
 * Returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()
  
  return !!adminUser
}

