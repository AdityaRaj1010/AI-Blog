# AI Blog Platform

AI Blog Platform is a Next.js-powered web application that leverages AI technology to assist in content generation and SEO optimization. It allows users to create, edit, and publish AI-generated blog posts, and provides real-time SEO analysis to enhance blog visibility and ranking.

## Features

- **AI Content Generation**: Automatically generate SEO-friendly blog posts using OpenRouter API and integrated AI content generation model.
- **SEO Analyzer**: Analyze blog content for SEO optimization, including keyword density, readability score, meta description, and more.
- **Real-time Content Editing**: Use a rich text editor powered by TipTap to create and edit posts, with real-time AI content suggestions.
- **Dashboard**: Manage saved posts, user settings, and other personalized features in a secure user dashboard.
- **User Authentication**: Sign up, login, and manage user sessions via Supabase authentication.
- **Responsive Design**: The platform is mobile-responsive and optimized for all screen sizes.

## Tech Stack

- **Frontend**: Next.js (React-based), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Supabase (for authentication and data storage)
- **AI**: OpenRouter API for generating blog content
- **SEO**: Custom SEO analysis logic using `text-readability` for content optimization

## Pages and Components

### Pages

- `app/(auth)/login/page.tsx`: Login page for users.
- `app/(auth)/signup/page.tsx`: Sign-up page for new users.
- `app/about/page.tsx`: About page explaining the platform.
- `app/api/generate/route.ts`: API route for generating AI content.
- `app/api/seo/route.ts`: API route for SEO analysis of the content.
- `app/blog/[slug]/page.tsx`: Dynamic blog post page to display content based on the slug.
- `app/dashboard/[id]/page.tsx`: User-specific dashboard page.
- `app/dashboard/new/page.tsx`: Page to create new blog posts.
- `app/dashboard/saved/page.tsx`: Page to view and manage saved posts.
- `app/dashboard/settings/page.tsx`: User settings page.
- `app/search/page.tsx`: Search page for finding blog posts.

### Components

- **Editor Components**:
  - `components/editor/AIEditor.tsx`: Rich text editor component integrated with AI for content generation.
  - `components/editor/TipTapMenu.tsx`: Menu bar for the rich text editor with tools for formatting.
  
- **UI Components**:
  - `components/ui/button.tsx`: Reusable button component.
  - `components/ui/loading-spinner.tsx`: Spinner for loading states.

- **SEO Components**:
  - `components/seo-analyzer.tsx`: SEO analyzer component to provide SEO feedback (keywords, readability, meta description).

- **Blog Components**:
  - `components/blog-card.tsx`: Card component to display blog previews.
  - `components/blog-content.tsx`: Component to display the full blog content.
  - `components/post-interactions.tsx`: Handles post interactions like likes, shares, etc.

- **Navigation Components**:
  - `components/navbar.tsx`: Navigation bar to access various pages.
  - `components/dashboard-nav.tsx`: Sidebar for user dashboard navigation.

## Setup and Installation

### Prerequisites

1. **Node.js**: Install the latest version of [Node.js](https://nodejs.org/).
2. **Supabase Account**: Create a [Supabase account](https://supabase.com) for user authentication and storage.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AdityaRaj1010/AI-Blog
   cd ai-blog-platform
