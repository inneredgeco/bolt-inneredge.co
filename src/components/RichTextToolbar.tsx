import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Video,
  Code,
  Table,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { LinkModal } from './LinkModal';
import { ImageModal } from './ImageModal';
import { VideoModal } from './VideoModal';

interface RichTextToolbarProps {
  editor: Editor;
}

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const headingDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headingDropdownRef.current && !headingDropdownRef.current.contains(event.target as Node)) {
        setShowHeadingDropdown(false);
      }
    };

    if (showHeadingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showHeadingDropdown]);

  const addLink = () => {
    setShowLinkModal(true);
  };

  const handleLinkSubmit = (url: string, text?: string) => {
    if (text) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowLinkModal(false);
  };

  const addImage = () => {
    setShowImageModal(true);
  };

  const handleImageSubmit = (url: string, alt?: string) => {
    editor.chain().focus().setImage({ src: url, alt: alt || '' }).run();
    setShowImageModal(false);
  };

  const addVideo = () => {
    setShowVideoModal(true);
  };

  const handleVideoSubmit = (input: string) => {
    let iframeHTML = '';

    if (input.trim().startsWith('<')) {
      iframeHTML = input.trim();
    } else {
      let embedUrl = input;

      if (input.includes('youtube.com/watch?v=')) {
        const videoId = input.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (input.includes('youtu.be/')) {
        const videoId = input.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (input.includes('vimeo.com/')) {
        const videoId = input.split('vimeo.com/')[1]?.split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      } else if (input.includes('iframe.mediadelivery.net') || input.includes('bunny.net')) {
        embedUrl = input;
      }

      iframeHTML = `<iframe src="${embedUrl}" width="640" height="360" frameborder="0" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowfullscreen style="max-width: 100%; aspect-ratio: 16/9; margin: 1rem 0;"></iframe>`;
    }

    editor.chain().focus().insertContent(iframeHTML).run();
    setShowVideoModal(false);
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setHeading = (level: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level }).run();
    }
    setShowHeadingDropdown(false);
  };

  const getActiveHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor.isActive('heading', { level: 4 })) return 'Heading 4';
    if (editor.isActive('heading', { level: 5 })) return 'Heading 5';
    if (editor.isActive('heading', { level: 6 })) return 'Heading 6';
    return 'Paragraph';
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-100 border-b border-stone-300">
      <div className="relative" ref={headingDropdownRef}>
        <button
          type="button"
          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors text-sm font-medium text-stone-700 min-w-[140px] justify-between"
        >
          <span>{getActiveHeading()}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {showHeadingDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-stone-300 rounded shadow-lg z-10 min-w-[140px]">
            <button
              type="button"
              onClick={() => setHeading(0)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 transition-colors text-stone-700"
            >
              Paragraph
            </button>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setHeading(level as 1 | 2 | 3 | 4 | 5 | 6)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 transition-colors text-stone-700"
                style={{ fontSize: `${20 - level}px`, fontWeight: 600 }}
              >
                Heading {level}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-stone-300" />

      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded hover:bg-stone-200 transition-colors ${
          editor.isActive('link') ? 'bg-stone-200' : 'bg-white'
        }`}
        title="Link"
      >
        <LinkIcon className="w-4 h-4 text-stone-700" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-2 rounded hover:bg-stone-200 transition-colors ${
          editor.isActive('bold') ? 'bg-stone-200' : 'bg-white'
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4 text-stone-700" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-2 rounded hover:bg-stone-200 transition-colors ${
          editor.isActive('italic') ? 'bg-stone-200' : 'bg-white'
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4 text-stone-700" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`p-2 rounded hover:bg-stone-200 transition-colors ${
          editor.isActive('blockquote') ? 'bg-stone-200' : 'bg-white'
        }`}
        title="Quote"
      >
        <Quote className="w-4 h-4 text-stone-700" />
      </button>

      <div className="w-px h-6 bg-stone-300" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`p-2 rounded hover:bg-stone-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-stone-200' : 'bg-white'
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4 text-stone-700" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`p-2 rounded hover:bg-stone-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-stone-200' : 'bg-white'
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4 text-stone-700" />
      </button>

      <div className="w-px h-6 bg-stone-300" />

      <button
        type="button"
        onClick={addImage}
        className="p-2 bg-white rounded hover:bg-stone-200 transition-colors"
        title="Add Image"
      >
        <ImageIcon className="w-4 h-4 text-stone-700" />
      </button>

      <button
        type="button"
        onClick={addVideo}
        className="p-2 bg-white rounded hover:bg-stone-200 transition-colors"
        title="Embed Video"
      >
        <Video className="w-4 h-4 text-stone-700" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={`p-2 rounded hover:bg-stone-200 transition-colors ${
          editor.isActive('codeBlock') ? 'bg-stone-200' : 'bg-white'
        }`}
        title="Code Block"
      >
        <Code className="w-4 h-4 text-stone-700" />
      </button>

      <button
        type="button"
        onClick={addTable}
        className="p-2 bg-white rounded hover:bg-stone-200 transition-colors"
        title="Insert Table"
      >
        <Table className="w-4 h-4 text-stone-700" />
      </button>

      {showLinkModal && (
        <LinkModal
          onClose={() => setShowLinkModal(false)}
          onSubmit={handleLinkSubmit}
        />
      )}

      {showImageModal && (
        <ImageModal
          onClose={() => setShowImageModal(false)}
          onSubmit={handleImageSubmit}
        />
      )}

      {showVideoModal && (
        <VideoModal
          onClose={() => setShowVideoModal(false)}
          onSubmit={handleVideoSubmit}
        />
      )}
    </div>
  );
}
