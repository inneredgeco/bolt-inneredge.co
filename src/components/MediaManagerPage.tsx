import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Search, Copy, Trash2, ExternalLink, Image as ImageIcon, X } from 'lucide-react';
import { Header } from './Header';
import { SEOHead } from './SEOHead';

interface R2Image {
  key: string;
  filename: string;
  url: string;
  size: number;
  lastModified: string;
}

type FolderType = 'all' | 'og-images' | 'blog' | 'headshots' | 'general';

const FOLDER_PATHS: Record<FolderType, string> = {
  'all': '',
  'og-images': 'og-images/',
  'blog': 'blog/featured-images/',
  'headshots': 'guests/headshots/',
  'general': 'general/',
};

const FOLDER_LABELS: Record<FolderType, string> = {
  'all': 'All Images',
  'og-images': 'OG Images',
  'blog': 'Blog Images',
  'headshots': 'Headshots',
  'general': 'General',
};

export function MediaManagerPage() {
  const [images, setImages] = useState<R2Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<FolderType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<FolderType>('og-images');
  const [customPath, setCustomPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, [selectedFolder]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const prefix = FOLDER_PATHS[selectedFolder];
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-r2-images?prefix=${encodeURIComponent(prefix)}`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setImages(data.images || []);
      } else {
        showToast('Failed to load images', 'error');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      showToast('Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('URL copied to clipboard!', 'success');
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('URL copied to clipboard!', 'success');
    }
  };

  const deleteImage = async (image: R2Image) => {
    if (!confirm(`Delete ${image.filename}? This cannot be undone.`)) {
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-r2-image`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: image.key }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Image deleted successfully', 'success');
        fetchImages();
      } else {
        showToast(data.error || 'Failed to delete image', 'error');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      showToast('Failed to delete image', 'error');
    }
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

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase();
      const fileExtension = selectedFile.name.split('.').pop();
      const filename = `${timestamp}-${sanitizedName}.${fileExtension}`;

      const folder = uploadFolder === 'general' && customPath
        ? customPath.replace(/^\/|\/$/g, '')
        : FOLDER_PATHS[uploadFolder].replace(/\/$/, '');

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('filename', filename);
      formData.append('folder', folder);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-og-image`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showToast('Image uploaded successfully', 'success');
        copyToClipboard(data.url);
        setShowUploadModal(false);
        setSelectedFile(null);
        setCustomPath('');
        fetchImages();
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const folderCounts: Record<FolderType, number> = {
    'all': images.length,
    'og-images': images.filter(img => img.key.startsWith('og-images/')).length,
    'blog': images.filter(img => img.key.startsWith('blog/featured-images/')).length,
    'headshots': images.filter(img => img.key.startsWith('guests/headshots/')).length,
    'general': images.filter(img => img.key.startsWith('general/')).length,
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <SEOHead title="Media Manager - Admin" description="Manage images and media files" />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Admin
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Media Manager</h1>
            <p className="mt-2 text-stone-600">Browse, upload, and manage your images</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload New Image
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(FOLDER_PATHS) as FolderType[]).map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFolder === folder
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              {FOLDER_LABELS[folder]} ({folderCounts[folder]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              {searchTerm ? 'No images found' : 'No images yet'}
            </h3>
            <p className="text-stone-600 mb-6">
              {searchTerm ? 'Try a different search term' : 'Upload your first image to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload New Image
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.key}
                className="group relative bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => copyToClipboard(image.url)}
              >
                <div className="aspect-square bg-stone-100">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-stone-900 truncate" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-stone-500">{formatFileSize(image.size)}</p>
                  <p className="text-xs text-stone-400">{formatDate(image.lastModified)}</p>
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      copyToClipboard(image.url);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy URL
                  </button>
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(image.url, '_blank');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-700 text-white rounded text-sm font-medium hover:bg-stone-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteImage(image);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b border-stone-200">
              <h2 className="text-xl font-bold text-stone-900">Upload New Image</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setError('');
                }}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Destination Folder
                </label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value as FolderType)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="og-images">OG Images (og-images/)</option>
                  <option value="blog">Blog Images (blog/featured-images/)</option>
                  <option value="headshots">Headshots (guests/headshots/)</option>
                  <option value="general">Custom Path</option>
                </select>
              </div>

              {uploadFolder === 'general' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Custom Path
                  </label>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="general/"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Select Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition-colors"
                >
                  {selectedFile ? (
                    <div>
                      <ImageIcon className="w-12 h-12 text-teal-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-stone-900">{selectedFile.name}</p>
                      <p className="text-xs text-stone-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                      <p className="text-sm text-stone-600">Click to choose file or drag and drop</p>
                      <p className="text-xs text-stone-500 mt-1">JPG, PNG, WebP (max 5MB)</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-stone-200">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setError('');
                }}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-teal-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
