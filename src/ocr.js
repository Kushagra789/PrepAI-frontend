import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

// PDF worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  // Create ONE worker (important optimization)
  const worker = await createWorker("eng");

  try {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      // 1. Extract embedded text first
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");

      // If good text exists, use it
      if (pageText.trim().length > 30) {
        text += pageText + "\n";
        continue;
      }

      // 2. OCR fallback (scanned PDF)
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
  } catch (error) {
    console.error("PDF OCR Error:", error);
  } finally {
    await worker.terminate();
  }

  return text;
}