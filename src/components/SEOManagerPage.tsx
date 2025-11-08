import { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEOHead } from './SEOHead';

interface SEOMeta {
  id: string;
  page_path: string;
  page_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  og_url: string | null;
  twitter_card: string | null;
  twitter_image_url: string | null;
  locality: string | null;
  region: string | null;
  additional_meta: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

interface SEOFormData {
  page_path: string;
  page_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  og_url: string;
  twitter_card: string;
  twitter_image_url: string;
  locality: string;
  region: string;
}

export function SEOManagerPage() {
  const [seoMeta, setSeoMeta] = useState<SEOMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMeta, setEditingMeta] = useState<SEOMeta | null>(null);
  const [formData, setFormData] = useState<SEOFormData>({
    page_path: '',
    page_title: '',
    meta_description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    og_url: '',
    twitter_card: 'summary_large_image',
    twitter_image_url: '',
    locality: '',
    region: ''
  });
  const [usePageTitle, setUsePageTitle] = useState(true);
  const [useMetaDescription, setUseMetaDescription] = useState(true);
  const [useOgImageForTwitter, setUseOgImageForTwitter] = useState(true);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSeoMeta();
  }, []);

  const fetchSeoMeta = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_meta')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSeoMeta(data || []);
    } catch (err) {
      console.error('Error fetching SEO meta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (meta?: SEOMeta) => {
    if (meta) {
      setEditingMeta(meta);
      setFormData({
        page_path: meta.page_path,
        page_title: meta.page_title || '',
        meta_description: meta.meta_description || '',
        keywords: meta.keywords || '',
        og_title: meta.og_title || '',
        og_description: meta.og_description || '',
        og_image_url: meta.og_image_url || '',
        og_url: meta.og_url || '',
        twitter_card: meta.twitter_card || 'summary_large_image',
        twitter_image_url: meta.twitter_image_url || '',
        locality: meta.locality || '',
        region: meta.region || ''
      });
      setUsePageTitle(!meta.og_title || meta.og_title === meta.page_title);
      setUseMetaDescription(!meta.og_description || meta.og_description === meta.meta_description);
      setUseOgImageForTwitter(!meta.twitter_image_url || meta.twitter_image_url === meta.og_image_url);
      setOgImagePreview(meta.og_image_url || '');
    } else {
      setEditingMeta(null);
      setFormData({
        page_path: '',
        page_title: '',
        meta_description: '',
        keywords: '',
        og_title: '',
        og_description: '',
        og_image_url: '',
        og_url: '',
        twitter_card: 'summary_large_image',
        twitter_image_url: '',
        locality: '',
        region: ''
      });
      setUsePageTitle(true);
      setUseMetaDescription(true);
      setUseOgImageForTwitter(true);
      setOgImagePreview('');
    }
    setOgImageFile(null);
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMeta(null);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image file.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image file must be less than 5MB.');
      return;
    }

    setOgImageFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setOgImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setOgImageFile(null);
    setOgImagePreview(formData.og_image_url || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadOgImage = async (pagePath: string, file: File): Promise<string> => {
    const pageName = pagePath === '/'
      ? 'home'
      : pagePath.replace(/^\//, '').replace(/\//g, '-');

    const sanitizedOriginalName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase();

    const fileExtension = file.name.split('.').pop();
    const filename = `${pageName}-${sanitizedOriginalName}.${fileExtension}`;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('filename', filename);

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-og-image`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to upload image');
    }

    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!formData.page_path.startsWith('/')) {
      setError('Page path must start with /');
      setSaving(false);
      return;
    }

    try {
      let ogImageUrl = formData.og_image_url;

      if (ogImageFile) {
        setUploadingImage(true);
        try {
          ogImageUrl = await uploadOgImage(formData.page_path, ogImageFile);
        } catch (uploadErr: any) {
          setError(uploadErr.message || 'Failed to upload image');
          setSaving(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const dataToSave = {
        ...formData,
        og_image_url: ogImageUrl,
        og_title: usePageTitle ? formData.page_title : formData.og_title,
        og_description: useMetaDescription ? formData.meta_description : formData.og_description,
        twitter_image_url: useOgImageForTwitter ? ogImageUrl : formData.twitter_image_url,
        updated_at: new Date().toISOString()
      };

      if (editingMeta) {
        const { error } = await supabase
          .from('seo_meta')
          .update(dataToSave)
          .eq('id', editingMeta.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('seo_meta')
          .insert([dataToSave]);

        if (error) throw error;
      }

      await fetchSeoMeta();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving SEO meta:', err);
      setError(err.message || 'Failed to save SEO meta');
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const getPageDisplayName = (pagePath: string): string => {
    const pathMap: Record<string, string> = {
      '/': 'Home',
      '/about': 'About',
      '/blog': 'Blog',
      '/podcast': 'Podcast',
      '/contact': 'Contact',
      '/booking': 'Booking',
      '/vision-builder': 'Vision Builder',
      '/guests': 'Podcast Guests',
      '/podcast-guest': 'Become a Guest',
      '/podcast-guest-form': 'Guest Application',
      '/podcast-guest-onboarding': 'Guest Onboarding',
      '/privacy-policy': 'Privacy Policy',
      '/emotional-release-techniques': 'Emotional Release',
      '/rise-course-resources': 'RISE Resources',
      '/link': 'Link in Bio'
    };

    return pathMap[pagePath] ||
      pagePath
        .replace(/^\//, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredMeta = seoMeta.filter(meta =>
    meta.page_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meta.page_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPageDisplayName(meta.page_path).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const titleCharCount = formData.page_title.length;
  const descCharCount = formData.meta_description.length;

  return (
    <div className="min-h-screen bg-stone-50">
      <SEOHead
        title="SEO Manager - Admin"
        description="Manage SEO meta tags and Open Graph images"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">SEO Meta Manager</h1>
            <p className="mt-2 text-stone-600">Manage meta tags and Open Graph images for all pages</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Page
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by page path or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredMeta.length === 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <Search className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              {searchTerm ? 'No results found' : 'No pages configured yet'}
            </h3>
            <p className="text-stone-600 mb-6">
              {searchTerm ? 'Try a different search term' : "Click 'Add New Page' to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Page
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-200">
                  {filteredMeta.map((meta) => (
                    <tr key={meta.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-stone-900">{getPageDisplayName(meta.page_path)}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{meta.page_path}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-stone-900">
                          {meta.page_title || <span className="text-stone-400 italic">No title set</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(meta)}
                          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-900">
                {editingMeta ? 'Edit SEO Meta' : 'Add New Page'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Page Identification</h3>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Page Path <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="page_path"
                    value={formData.page_path}
                    onChange={handleInputChange}
                    disabled={!!editingMeta}
                    placeholder="/about"
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-stone-100 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    Must start with / (e.g., /, /about, /blog/post-slug)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Basic SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      name="page_title"
                      value={formData.page_title}
                      onChange={handleInputChange}
                      placeholder="Men's Life Coaching | Inner Edge"
                      maxLength={100}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <div className="mt-1 flex justify-between items-center">
                      <p className="text-xs text-stone-500">{titleCharCount}/60 characters (recommended)</p>
                      {titleCharCount > 60 && (
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          Title too long - may be cut off
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      placeholder="Transform your life from the inside out..."
                      maxLength={300}
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                    <div className="mt-1 flex justify-between items-center">
                      <p className="text-xs text-stone-500">{descCharCount}/160 characters (recommended)</p>
                      {descCharCount > 160 && (
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          Description too long - may be truncated
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Keywords
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      placeholder="life coaching, mens wellness, san diego"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-stone-500">Comma-separated list of keywords</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Open Graph / Social Media</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        id="usePageTitle"
                        checked={usePageTitle}
                        onChange={(e) => setUsePageTitle(e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-stone-300 rounded focus:ring-teal-500"
                      />
                      <label htmlFor="usePageTitle" className="text-sm font-medium text-stone-700">
                        Use Page Title
                      </label>
                    </div>
                    {!usePageTitle && (
                      <>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          OG Title
                        </label>
                        <input
                          type="text"
                          name="og_title"
                          value={formData.og_title}
                          onChange={handleInputChange}
                          placeholder="Custom Open Graph title"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        id="useMetaDescription"
                        checked={useMetaDescription}
                        onChange={(e) => setUseMetaDescription(e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-stone-300 rounded focus:ring-teal-500"
                      />
                      <label htmlFor="useMetaDescription" className="text-sm font-medium text-stone-700">
                        Use Meta Description
                      </label>
                    </div>
                    {!useMetaDescription && (
                      <>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          OG Description
                        </label>
                        <textarea
                          name="og_description"
                          value={formData.og_description}
                          onChange={handleInputChange}
                          placeholder="Custom Open Graph description"
                          rows={2}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      OG Image
                    </label>

                    {ogImagePreview ? (
                      <div className="mb-3">
                        <div className="relative inline-block">
                          <img
                            src={ogImagePreview}
                            alt="OG Preview"
                            className="max-w-full h-auto rounded-lg border border-stone-300 max-h-48"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {ogImagePreview ? 'Change Image' : 'Upload Image'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    <input
                      type="url"
                      name="og_image_url"
                      value={formData.og_image_url}
                      onChange={handleInputChange}
                      placeholder="Or enter image URL: https://cdn.inneredge.co/og-image.jpg"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mt-2"
                    />
                    <p className="mt-1 text-xs text-stone-500">
                      Upload an image or enter a URL. Recommended: 1200x630px (1.91:1 ratio)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      name="og_url"
                      value={formData.og_url}
                      onChange={handleInputChange}
                      placeholder="https://www.inneredge.co/about"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Twitter Card</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Card Type
                    </label>
                    <select
                      name="twitter_card"
                      value={formData.twitter_card}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        id="useOgImageForTwitter"
                        checked={useOgImageForTwitter}
                        onChange={(e) => setUseOgImageForTwitter(e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-stone-300 rounded focus:ring-teal-500"
                      />
                      <label htmlFor="useOgImageForTwitter" className="text-sm font-medium text-stone-700">
                        Use OG Image
                      </label>
                    </div>
                    {!useOgImageForTwitter && (
                      <>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Twitter Image URL
                        </label>
                        <input
                          type="url"
                          name="twitter_image_url"
                          value={formData.twitter_image_url}
                          onChange={handleInputChange}
                          placeholder="https://cdn.inneredge.co/twitter-card.jpg"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Local Business (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Locality
                    </label>
                    <input
                      type="text"
                      name="locality"
                      value={formData.locality}
                      onChange={handleInputChange}
                      placeholder="San Diego"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Region
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="CA"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading Image...' : saving ? 'Saving...' : editingMeta ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
