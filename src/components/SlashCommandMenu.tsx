import { useEffect, useRef } from 'react';

interface Command {
  label: string;
  description: string;
  before: string;
  after: string;
  placeholder?: string;
}

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  onSelect: (command: Command) => void;
  onClose: () => void;
  filter: string;
}

const commands: Command[] = [
  { label: '/h2', description: 'Heading 2', before: '## ', after: '', placeholder: 'Heading 2' },
  { label: '/h3', description: 'Heading 3', before: '### ', after: '', placeholder: 'Heading 3' },
  { label: '/bold', description: 'Bold text', before: '**', after: '**', placeholder: 'bold text' },
  { label: '/italic', description: 'Italic text', before: '*', after: '*', placeholder: 'italic text' },
  { label: '/list', description: 'Bullet list', before: '- ', after: '', placeholder: 'list item' },
  { label: '/numbered', description: 'Numbered list', before: '1. ', after: '', placeholder: 'list item' },
  { label: '/link', description: 'Insert link', before: '[', after: '](url)', placeholder: 'link text' },
];

export function SlashCommandMenu({ position, onSelect, onClose, filter }: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedIndexRef = useRef(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(filter.toLowerCase()) ||
    cmd.description.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    selectedIndexRef.current = 0;
  }, [filter]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, filteredCommands.length - 1);
        menuRef.current?.children[selectedIndexRef.current]?.scrollIntoView({ block: 'nearest' });
        menuRef.current?.querySelectorAll('[data-command]').forEach((el, i) => {
          el.classList.toggle('bg-amber-50', i === selectedIndexRef.current);
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
        menuRef.current?.children[selectedIndexRef.current]?.scrollIntoView({ block: 'nearest' });
        menuRef.current?.querySelectorAll('[data-command]').forEach((el, i) => {
          el.classList.toggle('bg-amber-50', i === selectedIndexRef.current);
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndexRef.current];
        if (selected) {
          onSelect(selected);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, onSelect, onClose]);

  if (filteredCommands.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-stone-300 rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-64"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {filteredCommands.map((command, index) => (
        <button
          key={command.label}
          data-command
          type="button"
          onClick={() => onSelect(command)}
          className={`w-full px-4 py-2 text-left hover:bg-amber-50 transition-colors border-b border-stone-100 last:border-b-0 ${
            index === 0 ? 'bg-amber-50' : ''
          }`}
        >
          <div className="font-medium text-stone-900 text-sm">{command.label}</div>
          <div className="text-xs text-stone-600">{command.description}</div>
        </button>
      ))}
    </div>
  );
}
