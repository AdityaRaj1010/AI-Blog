'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | null>(null)

type AuthContextType = {
  session: unknown;
  user: { id: string; email?: string } | null;
  loading: boolean;
  supabase: typeof supabase;
};

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<unknown>(null)
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        if (session) router.refresh()
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <AuthContext.Provider value={{ session, user, loading, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a SupabaseProvider')
  }
  return context
}