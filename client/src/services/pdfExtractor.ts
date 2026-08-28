import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker — use the bundled worker from pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB guard

/**
 * Extracts all selectable text from a PDF file in the browser.
 * Returns the concatenated text from all pages.
 * Throws if the PDF has no extractable text, is corrupt, or is invalid.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error(`Expected a PDF file, got "${file.type || file.name}".`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10 MB limit.`
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => {
        if ('str' in item && typeof (item as { str: string }).str === 'string') {
          return (item as { str: string }).str;
        }
        return '';
      })
      .filter((str) => str.length > 0)
      .join(' ');
    pageTexts.push(pageText);
  }

  const fullText = pageTexts.join('\n\n').trim();

  if (fullText.length < 20) {
    throw new Error(
      'This PDF has no extractable text (it may be a scanned/image-only document or corrupt). ' +
      'Please copy & paste the text manually into the input box below.'
    );
  }

  return fullText;
}
