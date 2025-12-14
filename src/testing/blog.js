export const BLOG_POSTS = [
  {
    id: 1,
    slug: 'getting-started-with-photography',
    title: 'Getting Started with Photography',
    author: 'Aldin Jandric',
    date: '2024-12-10',
    tags: ['photography', 'tutorial', 'beginner'],
    excerpt: 'Learn the fundamentals of photography and start your creative journey.',
    contentPath: '/blog/getting-started-with-photography.md'
  },
  {
    id: 2,
    slug: 'mastering-composition',
    title: 'Mastering Composition in Photography',
    author: 'Aldin Jandric',
    date: '2024-12-05',
    tags: ['photography', 'composition', 'technique'],
    excerpt: 'Discover the key principles of composition that will elevate your photographs.',
    contentPath: '/blog/mastering-composition.md'
  },
  {
    id: 3,
    slug: 'travel-photography-tips',
    title: 'Travel Photography Tips',
    author: 'Aldin Jandric',
    date: '2024-11-28',
    tags: ['photography', 'travel', 'tips'],
    excerpt: 'Essential tips for capturing stunning photos while traveling around the world.',
    contentPath: '/blog/travel-photography-tips.md'
  }
];

export const getAllTags = () => {
  const tags = new Set();
  BLOG_POSTS.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const getPostsByTag = (tag) => {
  return BLOG_POSTS.filter(post => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getAllPosts = () => {
  return BLOG_POSTS.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getPostBySlug = (slug) => {
  return BLOG_POSTS.find(post => post.slug === slug);
};
