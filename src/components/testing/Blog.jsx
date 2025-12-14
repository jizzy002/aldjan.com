import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getAllPosts, getAllTags, getPostsByTag } from '../blog';

export default function Blog({ colors, isDark }) {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [postContents, setPostContents] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const allTags = getAllTags();

  useEffect(() => {
    const filteredPosts = selectedTag ? getPostsByTag(selectedTag) : getAllPosts();
    setPosts(filteredPosts);
  }, [selectedTag]);

  const fetchPostContent = async (post) => {
    if (postContents[post.id]) {
      setExpandedPost(expandedPost === post.id ? null : post.id);
      return;
    }

    try {
      const response = await fetch(post.contentPath);
      const content = await response.text();
      setPostContents(prev => ({ ...prev, [post.id]: content }));
      setExpandedPost(expandedPost === post.id ? null : post.id);
    } catch (error) {
      console.error('Error loading post:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section
      style={{
        padding: '24px 20px',
        maxWidth: '900px',
        margin: '0 8px auto',
        backgroundColor: colors.bg
      }}
    >
      <h2
        style={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '40px',
          color: colors.textLight
        }}
      >
        Posts
      </h2>

      {/* Tag Filter */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}
      >
        <button
          onClick={() => setSelectedTag(null)}
          style={{
            padding: '8px 16px',
            backgroundColor: !selectedTag ? colors.primary : isDark ? '#2a2a2a' : '#f0f0f0',
            color: !selectedTag ? '#000' : colors.textLight,
            border: `1px solid ${colors.primary}`,
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.3s ease'
          }}
        >
          All Posts
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedTag === tag ? colors.primary : isDark ? '#2a2a2a' : '#f0f0f0',
              color: selectedTag === tag ? '#000' : colors.textLight,
              border: `1px solid ${colors.primary}`,
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Blog Posts */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}
      >
        {posts.map(post => (
          <article
            key={post.id}
            style={{
              padding: '24px',
              backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
              borderRadius: '12px',
              borderLeft: `4px solid ${colors.primary}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: expandedPost === post.id ? 'translateY(-4px)' : 'none',
              boxShadow: expandedPost === post.id ? '0 8px 24px rgba(0,0,0,0.2)' : 'none'
            }}
            onClick={() => fetchPostContent(post)}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px'
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: colors.textLight,
                    marginBottom: '8px'
                  }}
                >
                  {post.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '14px',
                    color: colors.textMuted,
                    marginBottom: '8px'
                  }}
                >
                  <span>{formatDate(post.date)}</span>
                  <span>by {post.author}</span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end'
                }}
              >
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: colors.primary,
                      color: '#000',
                      borderRadius: '4px',
                      fontWeight: 500
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p
              style={{
                color: colors.textMuted,
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: expandedPost === post.id ? '16px' : '0'
              }}
            >
              {post.excerpt}
            </p>

            {/* Expanded Content */}
            {expandedPost === post.id && postContents[post.id] && (
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                  color: colors.textLight,
                  lineHeight: '1.8'
                }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', marginTop: '24px' }} {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '20px' }} {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p style={{ marginBottom: '16px' }} {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul style={{ marginLeft: '20px', marginBottom: '16px' }} {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li style={{ marginBottom: '8px' }} {...props} />
                    ),
                    code: ({ node, inline, ...props }) => (
                      <code
                        style={{
                          backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                          padding: inline ? '2px 6px' : '16px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: inline ? '14px' : '13px',
                          display: inline ? 'inline-block' : 'block',
                          overflowX: 'auto'
                        }}
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a style={{ color: colors.primary, textDecoration: 'none' }} {...props} />
                    )
                  }}
                >
                  {postContents[post.id]}
                </ReactMarkdown>
              </div>
            )}
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.textMuted }}>
          <p>No posts found with this tag.</p>
        </div>
      )}
    </section>
  );
}
