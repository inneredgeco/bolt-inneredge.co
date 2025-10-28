import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { Trash2, CreditCard as Edit, Eye, EyeOff, BookOpen, Plus, LogOut } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { htmlToMarkdown, markdownToHtml } from '../utils/htmlToMarkdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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

export function AdminPage() {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: 'Soleiman Bolour',
    image_url: '',
    image_alt_text: ''
  });

  const [editorHtml, setEditorHtml] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    fetchAllPosts();
  }, []);

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

  async function handleLogout() {
    await signOut();
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const markdownContent = htmlToMarkdown(editorHtml);

    if (!formData.title || !markdownContent || !formData.excerpt) {
      alert('Please fill in all required fields');
      return;
    }

    const slug = formData.slug || generateSlug(formData.title);

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            slug,
            content: markdownContent,
            excerpt: formData.excerpt,
            author: formData.author,
            image_url: formData.image_url || null,
            image_alt_text: formData.image_alt_text || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .select();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        console.log('Post updated:', data);
        setEditingId(null);
        setShowForm(false);
      } else {
        const { error } = await supabase
          .from('posts')
          .insert({
            title: formData.title,
            slug,
            content: markdownContent,
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
        slug: '',
        content: '',
        excerpt: '',
        author: 'Soleiman Bolour',
        image_url: '',
        image_alt_text: ''
      });
      setEditorHtml('');
      setShowForm(false);

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
    console.log('=== EDIT POST DEBUG ===');
    console.log('1. Raw content from database (markdown):', post.content);

    const htmlContent = markdownToHtml(post.content);
    console.log('2. After markdown-to-HTML conversion:', htmlContent);

    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      image_url: post.image_url || '',
      image_alt_text: post.image_alt_text || ''
    });

    console.log('3. Setting editor HTML to:', htmlContent);
    setEditorHtml(htmlContent);
    setEditingId(post.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('======================');
  }

  function handleCancel() {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author: 'Soleiman Bolour',
      image_url: '',
      image_alt_text: ''
    });
    setEditorHtml('');
    setEditingId(null);
    setShowForm(false);
  }


  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-stone-900">Blog Admin</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-stone-200 text-stone-900 rounded-lg hover:bg-stone-300 font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-all hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New Post
              </button>
            )}
          </div>
        </div>

        {showForm && (
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
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    console.log('Title changed:', newTitle);
                    const generatedSlug = generateSlug(newTitle);
                    console.log('Generated slug:', generatedSlug);
                    setFormData({
                      ...formData,
                      title: newTitle,
                      slug: editingId ? formData.slug : generatedSlug
                    });
                  }}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                  placeholder="auto-generated-from-title"
                  required
                />
                <p className="text-xs text-stone-500 mt-1">
                  Auto-generated from title. Edit if needed.
                </p>
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
                  Content *
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
                  <RichTextEditor
                    content={editorHtml}
                    onChange={setEditorHtml}
                  />
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

                        {editorHtml ? (
                          <div
                            className="prose prose-lg prose-stone max-w-none"
                            dangerouslySetInnerHTML={{ __html: editorHtml }}
                          />
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
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-stone-300 text-stone-900 rounded-lg hover:bg-stone-400 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
        )}

        {!showForm && (
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
        )}
      </div>
    </div>
  );
}
