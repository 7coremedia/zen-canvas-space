import type { BlocksData } from '@/components/editor/BlocksEditor';

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderParagraph = (data: any) => `<p>${data.text || ''}</p>`;
const renderHeader = (data: any) => {
  const level = Math.min(Math.max(Number(data.level || 2), 1), 6);
  return `<h${level}>${data.text || ''}</h${level}>`;
};
const renderList = (data: any) => {
  const tag = data.style === 'ordered' ? 'ol' : 'ul';
  const items = (data.items || []).map((i: string) => `<li>${i}</li>`).join('');
  return `<${tag}>${items}</${tag}>`;
};
const renderQuote = (data: any) => {
  const text = data.text || '';
  const caption = data.caption ? `<cite>${escapeHtml(data.caption)}</cite>` : '';
  return `<blockquote><p>${text}</p>${caption}</blockquote>`;
};
const renderChecklist = (data: any) => {
  const items = (data.items || []).map((i: any) => `<li>${i.text || ''} ${i.checked ? '☑' : '☐'}</li>`).join('');
  return `<ul>${items}</ul>`;
};
const renderTable = (data: any) => {
  const rows: string[][] = data.content || [];
  const body = rows
    .map((row: string[]) => `<tr>${row.map((cell) => `<td>${cell || ''}</td>`).join('')}</tr>`) 
    .join('');
  return `<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%"><tbody>${body}</tbody></table>`;
};

export const blocksToHtml = (data: BlocksData): string => {
  const html = (data.blocks || [])
    .map((block: any) => {
      switch (block.type) {
        case 'paragraph':
          return renderParagraph(block.data);
        case 'header':
          return renderHeader(block.data);
        case 'list':
          return renderList(block.data);
        case 'quote':
          return renderQuote(block.data);
        case 'checklist':
          return renderChecklist(block.data);
        case 'table':
          return renderTable(block.data);
        default:
          return '';
      }
    })
    .join('\n');

  // wrap with a simple article container
  return `<article>${html}</article>`;
};
