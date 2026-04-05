import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const extractTextFromPdf = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const pdf = await getDocument({ data: uint8Array }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText.trim();
};

export default extractTextFromPdf;