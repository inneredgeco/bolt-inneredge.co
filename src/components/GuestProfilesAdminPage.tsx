import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Edit, Trash2, X, Search } from 'lucide-react';

interface Guest {
  id: string;
  slug: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  website_url: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  guest_youtube_url: string;
  profession: string;
  short_bio: string;
  long_bio: string;
  photo_url: string;
  status: string;
  episode_title: string | null;
  episode_date: string | null;
  spotify_url: string | null;
  apple_podcast_url: string | null;
  podcast_youtube_url: string | null;
  created_at: string;
}

type FilterStatus = 'all' | 'Published' | 'Draft';

export function GuestProfilesAdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [guests, filterStatus, searchTerm]);

  async function fetchGuests() {
    try {
      const { data, error } = await supabase
        .from('podcast_guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError('Failed to load guests');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...guests];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(guest => guest.status === filterStatus);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(guest =>
        guest.full_name.toLowerCase().includes(search) ||
        guest.email.toLowerCase().includes(search)
      );
    }

    setFilteredGuests(filtered);
  }

  async function toggleStatus(guestId: string, currentStatus: string) {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';

    try {
      const { error } = await supabase
        .from('podcast_guests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', guestId);

      if (error) throw error;

      setGuests(guests.map(g =>
        g.id === guestId ? { ...g, status: newStatus } : g
      ));

      setSuccess(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleSaveGuest(updatedGuest: Guest) {
    try {
      const { error } = await supabase
        .from('podcast_guests')
        .update({
          first_name: updatedGuest.first_name,
          last_name: updatedGuest.last_name,
          full_name: `${updatedGuest.first_name} ${updatedGuest.last_name}`,
          email: updatedGuest.email,
          phone: updatedGuest.phone,
          website_url: updatedGuest.website_url,
          facebook_url: updatedGuest.facebook_url,
          instagram_url: updatedGuest.instagram_url,
          linkedin_url: updatedGuest.linkedin_url,
          guest_youtube_url: updatedGuest.guest_youtube_url,
          profession: updatedGuest.profession,
          short_bio: updatedGuest.short_bio,
          long_bio: updatedGuest.long_bio,
          photo_url: updatedGuest.photo_url,
          status: updatedGuest.status,
          episode_title: updatedGuest.episode_title || null,
          episode_date: updatedGuest.episode_date || null,
          spotify_url: updatedGuest.spotify_url || null,
          apple_podcast_url: updatedGuest.apple_podcast_url || null,
          podcast_youtube_url: updatedGuest.podcast_youtube_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedGuest.id);

      if (error) throw error;

      setGuests(guests.map(g =>
        g.id === updatedGuest.id ? updatedGuest : g
      ));

      setEditingGuest(null);
      setSuccess('Guest profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating guest:', err);
      setError('Failed to update guest profile');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleDeleteGuest(guestId: string) {
    try {
      const { error } = await supabase
        .from('podcast_guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      setGuests(guests.filter(g => g.id !== guestId));
      setShowDeleteConfirm(null);
      setSuccess('Guest deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError('Failed to delete guest');
      setTimeout(() => setError(''), 3000);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-stone-600">Loading guests...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Admin
          </Link>
          <h1 className="text-4xl font-bold text-stone-900">Guest Profiles</h1>
          <p className="text-lg text-stone-600 mt-2">
            Manage podcast guest profiles and episode information
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All ({guests.length})
              </button>
              <button
                onClick={() => setFilterStatus('Published')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterStatus === 'Published'
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Published ({guests.filter(g => g.status === 'Published').length})
              </button>
              <button
                onClick={() => setFilterStatus('Draft')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterStatus === 'Draft'
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Draft ({guests.filter(g => g.status === 'Draft').length})
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-100 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Photo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Episode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                      No guests found
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={guest.photo_url}
                          alt={guest.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/48x48/e7e5e4/78716c?text=' + guest.first_name.charAt(0);
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-stone-900">{guest.full_name}</div>
                        <div className="text-sm text-stone-600">{guest.profession}</div>
                      </td>
                      <td className="px-6 py-4 text-stone-700">{guest.email}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(guest.id, guest.status)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            guest.status === 'Published' ? 'bg-teal-600' : 'bg-stone-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              guest.status === 'Published' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <div className="text-xs text-stone-600 mt-1">{guest.status}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            guest.episode_title
                              ? 'bg-green-100 text-green-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {guest.episode_title ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {formatDate(guest.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingGuest(guest)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit guest"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(guest.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete guest"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          onSave={handleSaveGuest}
          onClose={() => setEditingGuest(null)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          guestName={guests.find(g => g.id === showDeleteConfirm)?.full_name || ''}
          onConfirm={() => handleDeleteGuest(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

interface EditGuestModalProps {
  guest: Guest;
  onSave: (guest: Guest) => void;
  onClose: () => void;
}

function EditGuestModal({ guest, onSave, onClose }: EditGuestModalProps) {
  const [formData, setFormData] = useState<Guest>(guest);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Edit Guest Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Profession *
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Website URL
            </label>
            <input
              type="url"
              name="website_url"
              value={formData.website_url || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                Guest YouTube Channel
              </label>
              <input
                type="url"
                name="guest_youtube_url"
                value={formData.guest_youtube_url || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
              <p className="mt-1 text-xs text-stone-600">Guest's personal YouTube channel</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Short Bio *
            </label>
            <textarea
              name="short_bio"
              value={formData.short_bio}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600 resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Long Bio
            </label>
            <textarea
              name="long_bio"
              value={formData.long_bio || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600 resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Photo URL *
            </label>
            <input
              type="url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
            <img
              src={formData.photo_url}
              alt="Preview"
              className="mt-2 w-24 h-24 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/96x96/e7e5e4/78716c?text=' + formData.first_name.charAt(0);
              }}
            />
          </div>

          <div className="border-t border-stone-200 pt-6 mb-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Episode Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Episode Title
                </label>
                <input
                  type="text"
                  name="episode_title"
                  value={formData.episode_title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Episode Date
                </label>
                <input
                  type="date"
                  name="episode_date"
                  value={formData.episode_date || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Spotify URL
                </label>
                <input
                  type="url"
                  name="spotify_url"
                  value={formData.spotify_url || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Apple Podcast URL
                </label>
                <input
                  type="url"
                  name="apple_podcast_url"
                  value={formData.apple_podcast_url || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Podcast YouTube URL
                </label>
                <input
                  type="url"
                  name="podcast_youtube_url"
                  value={formData.podcast_youtube_url || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
                <p className="mt-1 text-xs text-stone-600">Episode on your YouTube channel</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  guestName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ guestName, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-stone-900 mb-4">Delete Guest Profile</h2>
        <p className="text-stone-700 mb-6">
          Are you sure you want to delete <span className="font-semibold">{guestName}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
