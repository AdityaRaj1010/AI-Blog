import './globals.css'
import { Inter } from 'next/font/google'
import {SupabaseProvider} from '@/lib/supabase/provider'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Blog Platform',
  description: 'AI-powered blog platform with automated content creation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <SupabaseProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t py-6 text-center text-gray-500">
            AI Blog Platform © {new Date().getFullYear()}
          </footer>
        </SupabaseProvider>
      </body>
    </html>
  )
}