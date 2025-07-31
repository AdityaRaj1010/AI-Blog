'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (type === 'signup') {
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) throw signUpError

        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              username,
            })

          if (profileError) throw profileError
        }

        alert('Check your email for confirmation!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-green-500 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-400 text-red-800 rounded text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {type === 'signup' && (
          <div className="mb-4">
            <label htmlFor="username" className="block text-green-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              minLength={3}
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-green-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-green-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        {type === 'login' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
