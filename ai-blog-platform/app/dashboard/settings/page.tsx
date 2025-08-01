'use client'

import { useAuth } from '@/lib/supabase/provider'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import { useState } from 'react'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (err: unknown) {
      let message = "An unknown Error occured";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="max-w-lg space-y-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded">
            {success}
          </div>
        )}

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Account Created:</strong>{' '} {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <Button variant="outline" className="mb-3">
            Change Password
          </Button>
          <Button variant="outline">
            Two-Factor Authentication
          </Button>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Danger Zone</h2>
          <Button
            onClick={handleLogout}
            variant="destructive"
            loading={loading}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}