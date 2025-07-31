// components/blog-content.tsx
import React from 'react';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
// This works both client-side and server-side
let DOMPurify: ReturnType<typeof createDOMPurify>;

if (typeof window !== 'undefined') {
  // Running in the browser
  DOMPurify = createDOMPurify(window);
} else {
  // Running on the server
  const window = new JSDOM('').window;
  DOMPurify = createDOMPurify(window);
}

type BlogContentProps = {
  content: string;
};

export default function BlogContent({ content }: BlogContentProps) {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
