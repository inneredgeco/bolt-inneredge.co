import { useState } from 'react';
import { X } from 'lucide-react';

interface AudioModalProps {
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export function AudioModal({ onClose, onSubmit }: AudioModalProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h3 className="text-lg font-semibold text-stone-900">Add Audio</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-100 rounded transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="audio-url" className="block text-sm font-medium text-stone-700 mb-2">
              Audio URL
            </label>
            <input
              id="audio-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
              autoFocus
            />
            <p className="mt-2 text-xs text-stone-500">
              Enter the URL of an audio file (MP3, WAV, OGG, etc.)
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              Add Audio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
