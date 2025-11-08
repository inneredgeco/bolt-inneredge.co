import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { Trash2, CreditCard as Edit, Eye, EyeOff, BookOpen, Plus, LogOut, ExternalLink, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
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

export function BlogPostsAdminPage() {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const { error } = await supabase
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
          .eq('id', editingId);

        if (error) {
          console.error('Update error:', error);
          alert(`Error updating post: ${error.message}`);
          throw error;
        }

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
      setImagePreview('');
      setUploadSuccess(false);
      setUploadError('');

      await fetchAllPosts();
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
      await fetchAllPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirmId) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deleteConfirmId);

      if (error) throw error;
      await fetchAllPosts();
      setDeleteConfirmId(null);
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
    setImagePreview(post.image_url || '');
    setUploadSuccess(false);
    setUploadError('');
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
    setImagePreview('');
    setUploadingImage(false);
    setUploadSuccess(false);
    setUploadError('');
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess(false);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a JPG, PNG, or WebP image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Image must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-blog-image`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: uploadFormData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }

      setFormData(prev => ({ ...prev, image_url: result.url }));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
    setUploadError('');
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-stone-900">Blog Posts Management</h1>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900">
              {editingId ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="flex gap-3">
              <button
                type="submit"
                form="post-form"
                className="px-6 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold transition-colors"
              >
                {editingId ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 bg-stone-300 text-stone-900 rounded-lg hover:bg-stone-400 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <form id="post-form" onSubmit={handleSubmit}>
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

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Featured Image *
                </label>

                {!imagePreview ? (
                  <div className="mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="featuredImageFile"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingImage ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </button>
                      <span className="text-sm text-stone-500">
                        Or paste URL below
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-stone-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="featuredImageFileChange"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center px-3 py-1.5 bg-stone-600 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50"
                    >
                      Change Image
                    </button>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-3 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Image uploaded successfully!
                  </div>
                )}

                {uploadError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {uploadError}
                  </div>
                )}

                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://cdn.inneredge.co/blog/featured-images/image.jpg"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <p className="mt-1 text-xs text-stone-500">
                  Upload an image to R2 or paste an external URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Image Alt Text
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
                      <a
                        href={`https://www.inneredge.co/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        title="View Post"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
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
                        onClick={() => setDeleteConfirmId(post.id)}
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

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-stone-900 mb-4">Confirm Delete</h3>
            <p className="text-stone-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
