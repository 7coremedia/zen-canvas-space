import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportHtmlToPdf = async (html: string, filename: string = 'document.pdf') => {
  // Create a temporary element to render HTML for capture
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = '800px';
  container.innerHTML = html;
  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let position = 0;
  let remainingHeight = imgHeight;

  // Add multiple pages if needed
  while (remainingHeight > 0) {
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
    if (remainingHeight > 0) {
      pdf.addPage();
      position = 0;
    }
  }

  pdf.save(filename);
  document.body.removeChild(container);
};
