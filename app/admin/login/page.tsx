import { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Admin Login - Stepping Stones',
  description: 'Login to the admin portal',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to manage Stepping Stones
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

