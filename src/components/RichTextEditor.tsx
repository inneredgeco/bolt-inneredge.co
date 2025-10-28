import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Node } from '@tiptap/core';
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
        .ProseMirror h1 { font-size: 2.5rem; font-weight: 700; margin: 1.5rem 0 1rem; line-height: 1.2; color: #292524; }
        .ProseMirror h2 { font-size: 2rem; font-weight: 700; margin: 1.25rem 0 0.875rem; line-height: 1.3; color: #292524; }
        .ProseMirror h3 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0 0.75rem; line-height: 1.35; color: #292524; }
        .ProseMirror h4 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.75rem; line-height: 1.4; color: #292524; }
        .ProseMirror h5 { font-size: 1.25rem; font-weight: 600; margin: 0.875rem 0 0.625rem; line-height: 1.45; color: #292524; }
        .ProseMirror h6 { font-size: 1.125rem; font-weight: 600; margin: 0.75rem 0 0.5rem; line-height: 1.5; color: #292524; }
        .ProseMirror p { margin: 0.75rem 0; line-height: 1.75; color: #292524; }
        .ProseMirror strong { font-weight: 700; color: #292524; }
        .ProseMirror em { font-style: italic; color: #292524; }
        .ProseMirror a { color: #0d9488; text-decoration: underline; cursor: pointer; }
        .ProseMirror a:hover { color: #0f766e; }
        .ProseMirror ul, .ProseMirror ol { margin: 1rem 0; padding-left: 1.5rem; color: #292524; }
        .ProseMirror ul li, .ProseMirror ol li { margin: 0.5rem 0; color: #292524; }
        .ProseMirror ul li::marker, .ProseMirror ol li::marker { color: #292524; }
        .ProseMirror blockquote { border-left: 4px solid #d6d3d1; padding-left: 1rem; margin: 1rem 0; color: #57534e; font-style: italic; }
        .ProseMirror code { background: #f5f5f4; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em; color: #292524; }
        .ProseMirror pre { background: #1c1917; color: #f5f5f4; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
        .ProseMirror pre code { background: transparent; padding: 0; color: #f5f5f4; }
        .ProseMirror iframe { max-width: 100%; margin: 1rem 0; border: 0; aspect-ratio: 16/9; }
        .ProseMirror div[data-type="iframe"] { position: relative; padding-top: 56.25%; margin: 1rem 0; }
      `;
      editorElement.parentElement?.appendChild(style);
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-stone-300 rounded-lg bg-white overflow-hidden">
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
