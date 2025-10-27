import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { Trash2, Edit, Eye, EyeOff, Lock, BookOpen } from 'lucide-react';
import { MarkdownToolbar } from './MarkdownToolbar';
import { SlashCommandMenu } from './SlashCommandMenu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  image_alt_text: string | null;
  author: string;
  published: boolean;
  created_at: string;
}

const ADMIN_PASSWORD = 'innerwork2024';

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Soleiman Bolour',
    image_url: '',
    image_alt_text: ''
  });

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (authenticated) {
      fetchAllPosts();
    }
  }, [authenticated]);

  async function fetchAllPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.excerpt) {
      alert('Please fill in all required fields');
      return;
    }

    const slug = generateSlug(formData.title);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            slug,
            content: formData.content,
            excerpt: formData.excerpt,
            author: formData.author,
            image_url: formData.image_url || null,
            image_alt_text: formData.image_alt_text || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('Post updated successfully!');
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('posts')
          .insert({
            title: formData.title,
            slug,
            content: formData.content,
            excerpt: formData.excerpt,
            author: formData.author,
            image_url: formData.image_url || null,
            image_alt_text: formData.image_alt_text || null,
            published: false
          });

        if (error) throw error;
      }

      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: 'Soleiman Bolour',
        image_url: '',
        image_alt_text: ''
      });

      fetchAllPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  }

  async function handleTogglePublish(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchAllPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAllPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  function handleEdit(post: Post) {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      image_url: post.image_url || '',
      image_alt_text: post.image_alt_text || ''
    });
    setEditingId(post.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: 'Soleiman Bolour',
      image_url: '',
      image_alt_text: ''
    });
    setEditingId(null);
  }

  function insertMarkdown(before: string, after: string, placeholder?: string) {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const textToInsert = selectedText || placeholder || '';

    const newContent =
      formData.content.substring(0, start) +
      before +
      textToInsert +
      after +
      formData.content.substring(end);

    setFormData({ ...formData, content: newContent });

    setTimeout(() => {
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      }
      textarea.focus();
    }, 0);
  }

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    setFormData({ ...formData, content: value });

    const textBeforeCursor = value.substring(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      const charBefore = lastSlashIndex > 0 ? value[lastSlashIndex - 1] : '\n';

      if (charBefore === '\n' || charBefore === ' ' || lastSlashIndex === 0) {
        const filter = textBeforeCursor.substring(lastSlashIndex);

        if (filter.length > 0 && filter.length <= 15 && !filter.includes(' ') && !filter.includes('\n')) {
          const textarea = e.target;
          const textareaRect = textarea.getBoundingClientRect();

          const lines = textBeforeCursor.split('\n');
          const currentLineIndex = lines.length - 1;
          const computedStyle = window.getComputedStyle(textarea);
          const lineHeight = parseInt(computedStyle.lineHeight) || 20;
          const paddingTop = parseInt(computedStyle.paddingTop) || 0;

          setSlashFilter(filter);
          setSlashMenuPosition({
            top: textareaRect.top + paddingTop + (currentLineIndex * lineHeight) + lineHeight + 5,
            left: textareaRect.left + 20
          });
          setShowSlashMenu(true);
          return;
        }
      }
    }

    setShowSlashMenu(false);
  }

  function handleSlashCommand(command: { before: string; after: string; placeholder?: string }) {
    const textarea = contentRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = formData.content.substring(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    const newContent =
      formData.content.substring(0, lastSlashIndex) +
      command.before +
      (command.placeholder || '') +
      command.after +
      formData.content.substring(cursorPos);

    setFormData({ ...formData, content: newContent });
    setShowSlashMenu(false);

    setTimeout(() => {
      const newCursorPos = lastSlashIndex + command.before.length + (command.placeholder?.length || 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <Lock className="w-12 h-12 text-stone-700" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-3 rounded-lg hover:bg-stone-800 font-semibold transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-stone-900 mb-8">Blog Admin</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            {editingId ? 'Edit Post' : 'Create New Post'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Excerpt * (3-4 sentences)
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-stone-700 mb-3">
                  Content * (Markdown supported)
                </label>

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                      activeTab === 'edit'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                {activeTab === 'edit' ? (
                  <>
                    <MarkdownToolbar onInsert={insertMarkdown} />
                    <textarea
                      ref={contentRef}
                      value={formData.content}
                      onChange={handleContentChange}
                      rows={16}
                      className="w-full px-4 py-2 border border-stone-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                      required
                    />
                    {showSlashMenu && (
                      <SlashCommandMenu
                        position={slashMenuPosition}
                        filter={slashFilter}
                        onSelect={handleSlashCommand}
                        onClose={() => setShowSlashMenu(false)}
                      />
                    )}
                    <div className="mt-2 text-xs text-stone-600">
                      <p><strong>Tip:</strong> Type <code className="bg-stone-100 px-1 rounded">/</code> for quick commands</p>
                    </div>
                  </>
                ) : (
                  <div className="border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="aspect-[21/9] bg-stone-200 overflow-hidden">
                        {formData.image_url ? (
                          <img
                            src={formData.image_url}
                            alt={formData.title || 'Preview'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-900">
                            <BookOpen className="w-24 h-24 text-amber-500" />
                          </div>
                        )}
                      </div>

                      <div className="p-8 md:p-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight">
                          {formData.title || 'Untitled Post'}
                        </h1>

                        {formData.content ? (
                          <div className="prose prose-lg prose-stone max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({node, ...props}) => <h2 className="text-3xl font-bold text-stone-900 mt-8 mb-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-stone-900 mt-8 mb-4" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-stone-900 mt-6 mb-3" {...props} />,
                                p: ({node, ...props}) => <p className="text-stone-700 leading-relaxed mb-6" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-6 space-y-2 text-stone-700" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-6 space-y-2 text-stone-700" {...props} />,
                                a: ({node, ...props}) => <a className="text-teal-600 hover:text-teal-700 underline" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                em: ({node, ...props}) => <em className="italic" {...props} />,
                              }}
                            >
                              {formData.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-stone-500 italic">No content to preview yet...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Image Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={formData.image_alt_text}
                  onChange={(e) => setFormData({ ...formData, image_alt_text: e.target.value })}
                  placeholder="Leave empty to auto-generate from title"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-stone-500 mt-1">
                  If empty, will default to: "Featured image for [Post Title]"
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold transition-colors"
                >
                  {editingId ? 'Update Post' : 'Create Post'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-stone-300 text-stone-900 rounded-lg hover:bg-stone-400 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">All Posts</h2>

          {posts.length === 0 ? (
            <p className="text-stone-600">No posts yet. Create your first post above!</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-stone-200 rounded-lg p-6 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-900 mb-2">{post.title}</h3>
                      <p className="text-stone-600 text-sm mb-2">{post.excerpt}</p>
                      <p className="text-xs text-stone-500">
                        By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title={post.published ? 'Published' : 'Unpublished'}
                      >
                        {post.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
