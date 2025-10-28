import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Node, mergeAttributes } from '@tiptap/core';
import { RichTextToolbar } from './RichTextToolbar';
import { useEffect } from 'react';

const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allow: {
        default: null,
      },
      allowfullscreen: {
        default: true,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      style: {
        default: null,
      },
      loading: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{
      tag: 'iframe',
    }, {
      tag: 'div',
      getAttrs: (node) => {
        if (typeof node === 'string') return false;
        const element = node as HTMLElement;
        const iframe = element.querySelector('iframe');
        return iframe ? null : false;
      },
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', HTMLAttributes];
  },
});

const Audio = Node.create({
  name: 'audio',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      preload: {
        default: 'metadata',
      },
      style: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{
      tag: 'audio',
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes)];
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-teal-600 hover:text-teal-700 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Iframe,
      Audio,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-stone-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-stone-300 bg-stone-100 px-4 py-2 text-left font-semibold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-stone-300 px-4 py-2',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-stone max-w-none focus:outline-none min-h-[400px] px-4 py-3',
        style: 'color: #292524;',
      },
    },
    onCreate: ({ editor }) => {
      const editorElement = editor.view.dom as HTMLElement;
      const style = document.createElement('style');
      style.textContent = `
        .prose .ProseMirror h1,
        .prose-lg .ProseMirror h1,
        .prose-stone .ProseMirror h1,
        .ProseMirror h1 { font-size: 2.5rem; font-weight: 700; margin: 1.5rem 0 1rem; line-height: 1.2; color: #292524 !important; }

        .prose .ProseMirror h2,
        .prose-lg .ProseMirror h2,
        .prose-stone .ProseMirror h2,
        .ProseMirror h2 { font-size: 2rem; font-weight: 700; margin: 1.25rem 0 0.875rem; line-height: 1.3; color: #292524 !important; }

        .prose .ProseMirror h3,
        .prose-lg .ProseMirror h3,
        .prose-stone .ProseMirror h3,
        .ProseMirror h3 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0 0.75rem; line-height: 1.35; color: #292524 !important; }

        .prose .ProseMirror h4,
        .prose-lg .ProseMirror h4,
        .prose-stone .ProseMirror h4,
        .ProseMirror h4 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.75rem; line-height: 1.4; color: #292524 !important; }

        .prose .ProseMirror h5,
        .prose-lg .ProseMirror h5,
        .prose-stone .ProseMirror h5,
        .ProseMirror h5 { font-size: 1.25rem; font-weight: 600; margin: 0.875rem 0 0.625rem; line-height: 1.45; color: #292524 !important; }

        .prose .ProseMirror h6,
        .prose-lg .ProseMirror h6,
        .prose-stone .ProseMirror h6,
        .ProseMirror h6 { font-size: 1.125rem; font-weight: 600; margin: 0.75rem 0 0.5rem; line-height: 1.5; color: #292524 !important; }

        .prose .ProseMirror p,
        .prose-lg .ProseMirror p,
        .prose-stone .ProseMirror p,
        .ProseMirror p { margin: 0.75rem 0; line-height: 1.75; color: #292524 !important; }

        .prose .ProseMirror strong,
        .prose-lg .ProseMirror strong,
        .prose-stone .ProseMirror strong,
        .ProseMirror strong { font-weight: 700; color: #292524 !important; }

        .prose .ProseMirror em,
        .prose-lg .ProseMirror em,
        .prose-stone .ProseMirror em,
        .ProseMirror em { font-style: italic; color: #292524 !important; }

        .prose .ProseMirror a,
        .prose-lg .ProseMirror a,
        .prose-stone .ProseMirror a,
        .ProseMirror a { color: #0d9488 !important; text-decoration: underline; cursor: pointer; }

        .prose .ProseMirror a:hover,
        .prose-lg .ProseMirror a:hover,
        .prose-stone .ProseMirror a:hover,
        .ProseMirror a:hover { color: #0f766e !important; }

        .prose .ProseMirror ul,
        .prose-lg .ProseMirror ul,
        .prose-stone .ProseMirror ul,
        .ProseMirror ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
          color: #292524 !important;
          list-style-type: disc !important;
        }

        .prose .ProseMirror ol,
        .prose-lg .ProseMirror ol,
        .prose-stone .ProseMirror ol,
        .ProseMirror ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
          color: #292524 !important;
          list-style-type: decimal !important;
        }

        .prose .ProseMirror ul li,
        .prose .ProseMirror ol li,
        .prose-lg .ProseMirror ul li,
        .prose-lg .ProseMirror ol li,
        .prose-stone .ProseMirror ul li,
        .prose-stone .ProseMirror ol li,
        .ProseMirror ul li,
        .ProseMirror ol li {
          margin: 0.5rem 0;
          color: #292524 !important;
          display: list-item !important;
        }

        .ProseMirror ul li *,
        .ProseMirror ol li * {
          color: #292524 !important;
        }

        .prose .ProseMirror ul li p,
        .prose .ProseMirror ol li p,
        .prose-lg .ProseMirror ul li p,
        .prose-lg .ProseMirror ol li p,
        .prose-stone .ProseMirror ul li p,
        .prose-stone .ProseMirror ol li p,
        .ProseMirror ul li p,
        .ProseMirror ol li p {
          color: #292524 !important;
        }

        .prose .ProseMirror ul li::marker,
        .prose .ProseMirror ol li::marker,
        .prose-lg .ProseMirror ul li::marker,
        .prose-lg .ProseMirror ol li::marker,
        .prose-stone .ProseMirror ul li::marker,
        .prose-stone .ProseMirror ol li::marker,
        .ProseMirror ul li::marker,
        .ProseMirror ol li::marker {
          color: #292524 !important;
        }

        .prose .ProseMirror blockquote,
        .prose-lg .ProseMirror blockquote,
        .prose-stone .ProseMirror blockquote,
        .ProseMirror blockquote { border-left: 4px solid #d6d3d1; padding-left: 1rem; margin: 1rem 0; color: #57534e !important; font-style: italic; }

        .prose .ProseMirror code,
        .prose-lg .ProseMirror code,
        .prose-stone .ProseMirror code,
        .ProseMirror code { background: #f5f5f4; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em; color: #292524 !important; }

        .prose .ProseMirror pre,
        .prose-lg .ProseMirror pre,
        .prose-stone .ProseMirror pre,
        .ProseMirror pre { background: #1c1917; color: #f5f5f4; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }

        .prose .ProseMirror pre code,
        .prose-lg .ProseMirror pre code,
        .prose-stone .ProseMirror pre code,
        .ProseMirror pre code { background: transparent; padding: 0; color: #f5f5f4 !important; }

        .prose .ProseMirror iframe,
        .prose-lg .ProseMirror iframe,
        .prose-stone .ProseMirror iframe,
        .ProseMirror iframe { max-width: 100%; margin: 1rem 0; border: 0; aspect-ratio: 16/9; }

        .prose .ProseMirror div[data-type="iframe"],
        .prose-lg .ProseMirror div[data-type="iframe"],
        .prose-stone .ProseMirror div[data-type="iframe"],
        .ProseMirror div[data-type="iframe"] { position: relative; padding-top: 56.25%; margin: 1rem 0; }

        .prose .ProseMirror audio,
        .prose-lg .ProseMirror audio,
        .prose-stone .ProseMirror audio,
        .ProseMirror audio { width: 100%; max-width: 480px; margin: 1rem 0; }
      `;
      editorElement.parentElement?.appendChild(style);
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      editor.view.updateState(editor.view.state);
    },
    onTransaction: ({ editor }) => {
      editor.view.updateState(editor.view.state);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      console.log('=== RICH TEXT EDITOR DEBUG ===');
      console.log('Content being set in editor:', content);
      console.log('Content type:', typeof content);
      console.log('First 200 chars:', content.substring(0, 200));
      editor.commands.setContent(content);
      console.log('After setContent, editor HTML:', editor.getHTML().substring(0, 200));
      console.log('=============================');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-stone-300 rounded-lg bg-white">
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
