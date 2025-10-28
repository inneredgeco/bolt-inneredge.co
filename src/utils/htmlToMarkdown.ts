import TurndownService from 'turndown';
import { gfm as turndownGfm } from 'turndown-plugin-gfm';
import { marked } from 'marked';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

turndownService.use(turndownGfm);

turndownService.addRule('iframe', {
  filter: 'iframe',
  replacement: function (content, node) {
    const element = node as HTMLElement;
    const src = element.getAttribute('src') || '';

    if (src.includes('youtube.com') || src.includes('vimeo.com')) {
      return `\n\n${element.outerHTML}\n\n`;
    }

    return '';
  }
});

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown) as string;
  console.log('=== markdownToHtml DEBUG ===');
  console.log('Input markdown:', markdown.substring(0, 200));
  console.log('Output HTML:', html.substring(0, 200));
  console.log('============================');
  return html;
}
