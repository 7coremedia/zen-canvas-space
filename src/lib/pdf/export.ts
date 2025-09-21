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
    scale: 2,
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
    // Multi-page flow if needed (rare for our use-case)
    let position = 0;
    let remainingHeight = imgH;
    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) {
        pdf.addPage([pageWidth, pageHeight]);
        position = 0;
      }
    }
  }

  pdf.save(filename);
  document.body.removeChild(container);
};
