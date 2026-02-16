'use client'

import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { logout } from './login/actions'
import { Database } from '@/lib/database.types'

type AdminUser = Database['public']['Tables']['admin_users']['Row']

interface AdminHeaderProps {
  user: AdminUser
}

export function AdminHeader({ user }: AdminHeaderProps) {
  async function handleLogout() {
    await logout()
  }

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1" />
        
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user.full_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Logout button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

