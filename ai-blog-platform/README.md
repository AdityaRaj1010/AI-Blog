# AI-Blog Platform

Welcome to the **AI-Blog Platform**! This is a full-stack web application built with modern technologies to help users create, manage, and explore blog posts. The platform integrates AI-powered content generation, SEO optimization, and a user-friendly dashboard for easy management.

## Features

- **User Authentication**: Secure login/signup functionality to manage personal accounts.
- **AI-Powered Blog Generation**: Easily generate blog content with AI through the editor.
- **SEO Optimization**: Analyze and optimize blogs for better search engine ranking.
- **Personal Dashboard**: Manage saved drafts, view published blogs, and customize settings.
- **Search Functionality**: Find blog posts across the platform.

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js API Routes, Supabase (for authentication and data storage)
- **AI Integration**: Custom AI algorithms for content generation
- **CSS Framework**: Tailwind CSS (or your custom styling setup)

---

## Project Structure

### Pages

- **`app/(auth)/login/page.tsx`**: User login page.
- **`app/(auth)/signup/page.tsx`**: User signup page.
- **`app/about/page.tsx`**: About page to describe the platform.
- **`app/api/generate/route.ts`**: API route to handle AI-powered blog content generation.
- **`app/api/seo/route.ts`**: API route for SEO analysis and optimization.
- **`app/blog/page.tsx`**: Blog listing page.
- **`app/blog/[slug]/page.tsx`**: Dynamic blog detail page based on the blog slug.
- **`app/dashboard/[id]/page.tsx`**: User-specific blog management dashboard.
- **`app/dashboard/new/page.tsx`**: Page to create a new blog post.
- **`app/dashboard/saved/page.tsx`**: Saved drafts page.
- **`app/dashboard/settings/page.tsx`**: User settings page.
- **`app/dashboard/layout.tsx`**: Layout for the dashboard.
- **`app/dashboard/page.tsx`**: Dashboard landing page.
- **`app/search/page.tsx`**: Search page for blog posts.
- **`app/page.tsx`**: Homepage of the platform.
- **`app/layout.tsx`**: Main layout for the app.

### Components

- **`components/auth/AuthForm.tsx`**: Authentication form for login and signup.
- **`components/editor/AIEditor.tsx`**: Editor component for generating and editing blog content with AI.
- **`components/editor/TipTapMenu.tsx`**: Editor toolbar/menu for content formatting.
- **`components/ui/button.tsx`**: Reusable button component.
- **`components/ui/loading-spinner.tsx`**: Loading spinner component.
- **`components/blog-card.tsx`**: Card displaying blog preview for listings.
- **`components/blog-content.tsx`**: Component to display the full content of a blog post.
- **`components/dashboard-nav.tsx`**: Navigation menu for the user dashboard.
- **`components/empty-state.tsx`**: Placeholder component when no data is available.
- **`components/navbar.tsx`**: Main site navigation bar.
- **`components/post-interactions.tsx`**: Handles interactions like comments and likes on posts.
- **`components/search.tsx`**: Search bar component for finding blog posts.
- **`components/seo-analyzer.tsx`**: SEO analysis component for optimizing content.

### Libraries and Utilities

- **`lib/ai/generate.ts`**: AI logic for content generation.
- **`lib/supabase/client.ts`**: Client-side Supabase API interactions.
- **`lib/supabase/server.ts`**: Server-side Supabase API interactions.
- **`lib/supabase/provider.tsx`**: Supabase provider for context management.
- **`lib/utils.ts`**: Utility functions used across the application.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-blog-platform.git
   cd ai-blog-platform
