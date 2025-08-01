'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Button from './ui/button'
import { useAuth } from '@/lib/supabase/provider'

type InteractionsProps = {
  postId: string
}

export default function PostInteractions({ postId }: InteractionsProps) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [showComments, setShowComments] = useState(false)

  type Profile = {
    username?: string;
  };

  type Comment = {
    id: string;
    content: string;
    created_at: string;
    profiles?: Profile;
  };

  useEffect(() => {
    const fetchInteractions = async () => {
      // Fetch likes count
      const { count: likeCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('post_id', postId)
      setLikes(likeCount || 0)

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('id, content, created_at, profiles:profiles!user_id (username)')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      if (commentsData) {
        const typedComments: Comment[] = commentsData.map((comment): Comment => ({
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          profiles: Array.isArray(comment.profiles)
            ? comment.profiles[0]
            : comment.profiles,
        }));

        setComments(typedComments);
      }


      // Check if user has liked/saved
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single()
        setLiked(!!likeData)

        const { data: savedData } = await supabase
          .from('saved_posts')
          .select()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single()
        setSaved(!!savedData)
      }
    }

    fetchInteractions()
  }, [postId, user])

  const handleLike = async () => {
    if (!user) return

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
      setLikes(likes - 1)
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id })
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleSave = async () => {
    if (!user) return

    if (saved) {
      await supabase
        .from('saved_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('saved_posts')
        .insert({ post_id: postId, user_id: user.id })
    }
    setSaved(!saved)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    const { data } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: comment
      })
      .select('id, content, created_at, profiles:profiles!user_id (username)')
      .single()

    if (data) {
      const newComment: Comment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        profiles: Array.isArray(data.profiles)
          ? data.profiles[0]
          : data.profiles,
      };

      setComments([newComment, ...comments]);
      setComment('');
    }

  }

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex gap-4 mb-8">
        <Button
          onClick={handleLike}
          variant={liked ? 'primary' : 'outline'}
        >
          {liked ? 'Liked' : 'Like'} ({likes})
        </Button>
        <Button
          onClick={() => setShowComments(!showComments)}
          variant="outline"
        >
          Comment ({comments.length})
        </Button>
        <Button
          onClick={handleSave}
          variant={saved ? 'primary' : 'outline'}
        >
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>

      {showComments && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>

          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border rounded-md mb-2"
              rows={3}
            />
            <Button type="submit" disabled={!comment.trim()}>
              Post Comment
            </Button>
          </form>

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{comment.profiles?.username || 'User'}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}