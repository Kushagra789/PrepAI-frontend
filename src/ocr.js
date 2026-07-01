import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";
import { cleanExtractedText } from "./textCleaner";

// PDF worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  // Create ONE worker
  const worker = await createWorker("eng");

  try {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      // Try extracting embedded text
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");

      // If enough embedded text exists, use it
      if (pageText.trim().length > 30) {
        text += cleanExtractedText(pageText) + "\n";
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

      text += cleanExtractedText(ocrText) + "\n";
    }
  } catch (error) {
    console.error("PDF OCR Error:", error);
  } finally {
    await worker.terminate();
  }

  return cleanExtractedText(text);
}