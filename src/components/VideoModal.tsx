import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface VideoModalProps {
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export function VideoModal({ onClose, onSubmit }: VideoModalProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-900">Embed Video</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-stone-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Video URL or Embed Code *
              </label>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste URL or full iframe embed code..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
              />
              <p className="text-xs text-stone-500 mt-2">
                Supports:
              </p>
              <ul className="text-xs text-stone-500 mt-1 ml-4 list-disc space-y-0.5">
                <li>YouTube URLs (youtube.com or youtu.be)</li>
                <li>Vimeo URLs</li>
                <li>Bunny.net URLs (iframe.mediadelivery.net)</li>
                <li>Full iframe embed codes</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
            >
              Embed Video
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-stone-200 text-stone-900 rounded-lg hover:bg-stone-300 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
