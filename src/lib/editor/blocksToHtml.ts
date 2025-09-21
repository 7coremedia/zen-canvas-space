import type { BlocksData } from '@/components/editor/BlocksEditor';

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatInline = (text: string): string => {
  if (!text) return '';
  // basic replacements for markdown-like inline styling
  // bold **text** or __text__
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // italic *text* or _text_
  text = text.replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, '$1<em>$2</em>');
  text = text.replace(/(^|\W)_([^_]+)_(?=\W|$)/g, '$1<em>$2</em>');
  // inline code `code`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
};

const renderParagraph = (data: any) => `<p>${formatInline(data.text || '')}</p>`;
const renderHeader = (data: any) => {
  const level = Math.min(Math.max(Number(data.level || 2), 1), 6);
  return `<h${level}>${formatInline(data.text || '')}</h${level}>`;
};
const normalizeItem = (i: any): string => {
  if (i == null) return '';
  if (typeof i === 'string') return i;
  if (typeof i === 'object') {
    // common shapes from tools
    return i.text || i.content || i.title || String(i);
  }
  return String(i);
};

const renderList = (data: any) => {
  const tag = data.style === 'ordered' ? 'ol' : 'ul';
  const items = (data.items || []).map((i: any) => `<li>${formatInline(normalizeItem(i))}</li>`).join('');
  return `<${tag}>${items}</${tag}>`;
};
const renderQuote = (data: any) => {
  const text = formatInline(data.text || '');
  const caption = data.caption ? `<cite>${escapeHtml(data.caption)}</cite>` : '';
  return `<blockquote><p>${text}</p>${caption}</blockquote>`;
};
const renderChecklist = (data: any) => {
  const items = (data.items || []).map((i: any) => `<li>${i.checked ? '☑' : '☐'} ${formatInline(i.text || '')}</li>`).join('');
  return `<ul>${items}</ul>`;
};
const renderTable = (data: any) => {
  const rows: string[][] = data.content || [];
  if (!rows.length) return '<table></table>';
  const [header, ...rest] = rows;
  const thead = `<thead><tr>${header
    .map((cell, idx) => `<th style="text-align:${idx === header.length - 1 ? 'right' : 'left'};padding:8px;border:1px solid #000;font-weight:700;">${cell || ''}</th>`) 
    .join('')}</tr></thead>`;
  const tbody = `<tbody>${rest
    .map((row: string[]) => {
      const isTotalRow = (row[0] || '').toLowerCase().includes('total');
      return `<tr>${row
        .map((cell, idx) => `<td style="text-align:${idx === row.length - 1 ? 'right' : 'left'};padding:8px;border:1px solid #000;${isTotalRow ? 'font-weight:700;' : ''}">${cell || ''}</td>`)
        .join('')}</tr>`;
    })
    .join('')}</tbody>`;
  return `<table style="border-collapse:collapse;width:100%;font-size:12.5px;">${thead}${tbody}</table>`;
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
  // Add prose class for better default typography during PDF capture
  return `<article class="prose prose-neutral max-w-none" style="padding:18mm;">${html}</article>`;
};
