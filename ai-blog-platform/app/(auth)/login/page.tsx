import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold text-blue-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-center text-sm text-yellow-600">
            Start creating AI-powered content
          </p>
        </div>
        <AuthForm type="login" />
      </div>
    </div>
  )
}