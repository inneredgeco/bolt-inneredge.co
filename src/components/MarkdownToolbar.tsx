import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon } from 'lucide-react';

interface MarkdownToolbarProps {
  onInsert: (before: string, after: string, placeholder?: string) => void;
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  const buttons = [
    {
      icon: Heading2,
      label: 'H2',
      action: () => onInsert('## ', '', 'Heading 2'),
    },
    {
      icon: Heading3,
      label: 'H3',
      action: () => onInsert('### ', '', 'Heading 3'),
    },
    {
      icon: Bold,
      label: 'Bold',
      action: () => onInsert('**', '**', 'bold text'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => onInsert('*', '*', 'italic text'),
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => onInsert('- ', '', 'list item'),
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => onInsert('1. ', '', 'list item'),
    },
    {
      icon: LinkIcon,
      label: 'Link',
      action: () => onInsert('[', '](url)', 'link text'),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-2 p-2 bg-stone-100 rounded-t-lg border border-b-0 border-stone-300">
      {buttons.map((button) => (
        <button
          key={button.label}
          type="button"
          onClick={button.action}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors text-sm font-medium text-stone-700"
          title={button.label}
        >
          <button.icon className="w-4 h-4" />
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  );
}
