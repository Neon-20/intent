import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If on login page, render without layout
  if (!user) {
    return <>{children}</>
  }

  // Get admin user details
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!adminUser) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={adminUser} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

