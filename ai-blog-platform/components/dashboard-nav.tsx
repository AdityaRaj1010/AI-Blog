'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/provider'

export default function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    // { href: '/dashboard/posts', label: 'My Posts' },
    { href: '/dashboard/saved', label: 'Saved Posts' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <nav className="w-64 border-r min-h-screen p-4">
      <div className="mb-8 p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        {user && (
          <p className="text-sm text-gray-600 mt-1">
            {user.email}
          </p>
        )}
      </div>

      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-4 py-2 rounded-md ${
                pathname === item.href
                  ? 'bg-blue-700 text-primary font-medium'
                  : 'hover:bg-green-600'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        className="mt-8 w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-md"
      >
        Logout
      </button>
    </nav>
  )
}