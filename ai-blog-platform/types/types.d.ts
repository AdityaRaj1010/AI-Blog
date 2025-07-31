declare type Post = {
  id: string
  title: string
  slug: string
  content: string
  user_id: string
  keywords: string[]
  created_at: string
  updated_at: string
  profiles: {
    username: string
  } | null
}

declare type BlogCardPost = {
  id: string
  title: string
  slug: string
  created_at: string
  keywords?: string[]
  profiles: {
    username: string
  } | null
}

declare type SearchParams = {
  q?: string
}