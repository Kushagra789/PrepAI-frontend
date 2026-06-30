import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  // Create worker
  const worker = await createWorker();

  // Load English language
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // Try extracting text directly
    const content = await page.getTextContent();

    const pageText = content.items.map(item => item.str).join(" ");

    if (pageText.trim().length > 30) {
      text += pageText + "\n";
      continue;
    }

    // OCR fallback
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const {
      data: { text: ocrText },
    } = await worker.recognize(canvas);

    text += ocrText + "\n";
  }

  await worker.terminate();

  return text;
}