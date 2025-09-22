import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type PageSize = 'a4' | 'letter';

interface PdfOptions {
  filename?: string;
  pageSize?: PageSize;
  singlePage?: boolean; // fit to one page
}

const getPageSize = (pageSize: PageSize): [number, number] => {
  // Return [width, height] in points
  switch (pageSize) {
    case 'letter':
      return [612, 792]; // 8.5 x 11 inches
    case 'a4':
    default:
      return [595.28, 841.89]; // A4
  }
};

interface TextPdfOptions {
  filename?: string;
  pageSize?: PageSize;
}

export const exportHtmlToPdfText = async (html: string, opts?: TextPdfOptions) => {
  const filename = opts?.filename || 'document.pdf';
  const pageSize = opts?.pageSize || 'a4';
  const [pageWidth, pageHeight] = getPageSize(pageSize);

  // Render in a hidden container for jsPDF.html
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = pageSize === 'letter' ? '816px' : '794px';
  container.innerHTML = html;
  document.body.appendChild(container);

  const pdf = new jsPDF('p', 'pt', [pageWidth, pageHeight]);
  await (pdf as any).html(container, {
    margin: [36, 36, 36, 36],
    autoPaging: 'text',
    html2canvas: { scale: 1.2, useCORS: true, backgroundColor: '#ffffff' },
    x: 0,
    y: 0,
    callback: () => {
      pdf.save(filename);
      document.body.removeChild(container);
    }
  });
};

export const exportHtmlToPdf = async (html: string, filenameOrOptions?: string | PdfOptions) => {
  const options: PdfOptions = typeof filenameOrOptions === 'string'
    ? { filename: filenameOrOptions }
    : (filenameOrOptions || {});

  const filename = options.filename || 'document.pdf';
  const pageSize = options.pageSize || 'a4';
  const singlePage = options.singlePage !== false; // default: true

  // Create a temporary element to render HTML for capture
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  // Wider width to improve quality; will be scaled
  container.style.width = pageSize === 'letter' ? '816px' : '794px';
  // Tighter line-height for PDF
  container.style.lineHeight = '1.35';
  container.style.background = '#ffffff';
  container.innerHTML = html;
  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 1.5,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: container.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/png');
  const [pageWidth, pageHeight] = getPageSize(pageSize);
  const pdf = new jsPDF('p', 'pt', [pageWidth, pageHeight]);

  // Compute dimensions preserving aspect ratio
  const imgW = pageWidth;
  const imgH = (canvas.height * imgW) / canvas.width;

  if (singlePage) {
    // Scale to fit into one page (either by width or height)
    const scale = Math.min(pageWidth / imgW, pageHeight / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (pageWidth - drawW) / 2;
    const offsetY = (pageHeight - drawH) / 2;
    pdf.addImage(imgData, 'PNG', offsetX, offsetY, drawW, drawH);
  } else {
    // Multi-page flow: shift the image up on each page to simulate slicing
    let heightLeft = imgH;
    let position = 0;
    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH, undefined, 'FAST');
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      pdf.addPage([pageWidth, pageHeight]);
      position = position - pageHeight; // shift image upwards
      pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH, undefined, 'FAST');
      heightLeft -= pageHeight;
    }
  }

  pdf.save(filename);
  document.body.removeChild(container);
};

export const openPrintWindow = (html: string, title: string = 'Document') => {
  const printWin = window.open('', '_blank');
  if (!printWin) return;
  printWin.document.open();
  printWin.document.write(`<!doctype html><html><head><meta charset="utf-8" /><title>${title}</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body { font-family: Inter, system-ui, sans-serif; line-height: 1.35; }
    .prose { max-width: 100%; }
  </style>
  </head><body>${html}</body></html>`);
  printWin.document.close();
  printWin.focus();
  printWin.print();
};
