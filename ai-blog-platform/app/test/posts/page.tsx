// app/test/posts/page.tsx
import { supabase } from '@/lib/supabase/client'

export default async function TestPage() {
  const { data: posts } = await supabase.from('posts').select('*')
  return <pre>{JSON.stringify(posts, null, 2)}</pre>
}