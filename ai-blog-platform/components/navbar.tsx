'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/provider'
import Search from './search'
export default function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-primary">
            AI Blog
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`hover:text-primary ${pathname === '/' ? 'text-primary font-medium' : ''}`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`hover:text-primary ${pathname.startsWith('/blog') ? 'text-primary font-medium' : ''}`}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={`hover:text-primary ${pathname === '/about' ? 'text-primary font-medium' : ''}`}
            >
              About
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <Search />
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-primary rounded-md hover:bg-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-red-600 hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-primary rounded-md hover:bg-blue-500"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-primary text-red-500 rounded-md hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}