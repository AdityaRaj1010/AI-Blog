'use client'

import { useAuth } from '@/lib/supabase/provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardNav from '@/components/dashboard-nav'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, loading } = useAuth()
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login')
    } else if (!loading && session) {
      setInitialized(true)
    }
  }, [session, loading, router])

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}