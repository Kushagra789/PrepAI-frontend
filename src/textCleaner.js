export function cleanExtractedText(text) {

  return text

    .replace(/[«»©]/g, "")

    .replace(/[^\x20-\x7E\n]/g, " ")

    .replace(/\s+/g, " ")

    .trim();

}

