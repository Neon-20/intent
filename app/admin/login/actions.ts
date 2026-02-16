'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  // Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return { error: 'Invalid email or password' }
  }

  // Check if user exists in admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', authData.user.id)
    .single()

  if (adminError || !adminUser) {
    // Sign out if not an admin
    await supabase.auth.signOut()
    return { error: 'You do not have admin access' }
  }

  // Redirect to admin dashboard
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

