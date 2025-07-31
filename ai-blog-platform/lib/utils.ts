// Improved slug generator with better handling
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize('NFD') // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single
    .trim() // Trim leading/trailing -
    .slice(0, 60);
}

// New: Generate URL-safe ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// lib/utils.ts
export const markdownToHtml = (markdown: string): string => {
  // Convert headers
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert lists
  html = html
    .replace(/^\s*-\s*(.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/gims, ''); // Merge adjacent lists
  
  // Convert bold/italic
  html = html
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Convert paragraphs
  html = html
    .replace(/^(?!<[hlu]|<\/?[hlu])(.*)$/gim, '<p>$1</p>')
    .replace(/<\/p>\s*<p>/gims, '<br>'); // Line breaks within paragraphs
  
  return html;
};