/**
 * PDF parsing utilities for extracting and processing PDF content.
 *
 * This module provides functions to:
 * - Extract text and metadata from PDF files
 * - Validate PDF file constraints (type, size)
 * - Chunk extracted text for embedding and storage
 */

import PDFParser from "pdf2json";

// Maximum allowed PDF file size in bytes (5MB)
const MAX_PDF_SIZE = 5 * 1024 * 1024;

// Minimum chunk size for text splitting
const MIN_CHUNK_SIZE = 800;

// Maximum chunk size for text splitting
const MAX_CHUNK_SIZE = 1000;

/**
 * Result from PDF text extraction operation.
 * Contains the extracted text along with optional metadata.
 */
export type PDFExtractionResult = {
  /** The extracted text content from the PDF */
  text: string;
  /** Number of pages in the PDF */
  pageCount: number;
  /** Optional title metadata from the PDF */
  title?: string;
  /** Optional author metadata from the PDF */
  author?: string;
};

/**
 * Extracts text and metadata from a PDF file buffer.
 *
 * @param buffer - The PDF file content as a Buffer
 * @returns Promise resolving to extracted text and metadata
 * @throws Error if PDF parsing fails
 *
 * @example
 * ```ts
 * const fileBuffer = fs.readFileSync('document.pdf');
 * const result = await extractTextFromPDF(fileBuffer);
 * console.log(`Extracted ${result.text.length} chars from ${result.pageCount} pages`);
 * ```
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("PDF parse error:", errData);
      reject(new Error(`Failed to parse PDF: ${errData.parserError || errData}`));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        console.log("PDF data keys:", Object.keys(pdfData));
        
        // Extract text from all pages
        let fullText = "";
        let pageCount = 0;

        // Try different paths to find pages
        let pages = pdfData.formImage?.Pages || pdfData.Pages || pdfData.pages;
        
        if (pages && Array.isArray(pages)) {
          pageCount = pages.length;
          console.log(`Found ${pageCount} pages`);

          for (const page of pages) {
            if (page.Texts) {
              for (const textItem of page.Texts) {
                if (textItem.R) {
                  for (const r of textItem.R) {
                    if (r.T) {
                      try {
                        fullText += decodeURIComponent(r.T) + " ";
                      } catch {
                        // If decode fails, use the raw text
                        fullText += r.T + " ";
                      }
                    }
                  }
                } else if (textItem.T) {
                  try {
                    fullText += decodeURIComponent(textItem.T) + " ";
                  } catch {
                    // If decode fails, use the raw text
                    fullText += textItem.T + " ";
                  }
                }
              }
            }
            fullText += "\n\n";
          }
        } else {
          console.log("No pages found in PDF data");
        }

        // Clean up text - remove excessive whitespace
        fullText = fullText.replace(/\s+/g, " ").trim();
        console.log(`Extracted text length: ${fullText.length} chars`);

        // Try to get metadata
        const metadata = pdfData.Meta || {};
        const title = metadata.Title || metadata["dc:title"];
        const author = metadata.Author || metadata["dc:creator"];

        resolve({
          text: fullText,
          pageCount,
          ...(title && { title: String(title) }),
          ...(author && { author: String(author) }),
        });
      } catch (error) {
        console.error("Error extracting text:", error);
        reject(new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`));
      }
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error("Error parsing buffer:", error);
      reject(new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

/**
 * Validates a PDF file meets application requirements.
 *
 * Checks:
 * - File type is application/pdf or has .pdf extension
 * - File size does not exceed 5MB limit
 *
 * @param file - File metadata object
 * @returns Validation result with optional error message
 *
 * @example
 * ```ts
 * const validation = validatePDFFile({
 *   name: 'document.pdf',
 *   type: 'application/pdf',
 *   size: 1024 * 1024 // 1MB
 * });
 * if (!validation.valid) {
 *   console.error(validation.error);
 * }
 * ```
 */
export function validatePDFFile(file: { name: string; type: string; size: number }): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  const isPDFMimeType = file.type === "application/pdf";
  const hasPDFExtension = file.name.toLowerCase().endsWith(".pdf");

  if (!isPDFMimeType && !hasPDFExtension) {
    return {
      valid: false,
      error: "Invalid file type. Only PDF files are allowed.",
    };
  }

  // Check file size
  if (file.size > MAX_PDF_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxMB = (MAX_PDF_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxMB}MB, got ${sizeMB}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Splits extracted PDF text into chunks for embedding and storage.
 *
 * Splits text on double newlines (paragraph boundaries), then combines
 * small paragraphs to ensure chunks are between 800-1000 characters.
 *
 * @param text - The text content to chunk
 * @returns Array of text chunks, each 800-1000 characters
 *
 * @example
 * ```ts
 * const chunks = chunkPDFText(extractedText);
 * console.log(`Split into ${chunks.length} chunks`);
 * ```
 */
export function chunkPDFText(text: string): string[] {
  // Clean up text - normalize whitespace and remove excessive empty lines
  const cleanedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split on double newlines (paragraph boundaries)
  const paragraphs = cleanedText.split(/\n\n+/).filter((p) => p.trim().length > 0);

  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();

    // If adding this paragraph would exceed max chunk size,
    // save current chunk and start a new one
    if (
      currentChunk.length > 0 &&
      currentChunk.length + trimmedParagraph.length + 2 > MAX_CHUNK_SIZE
    ) {
      // Only save if current chunk meets minimum size
      if (currentChunk.length >= MIN_CHUNK_SIZE) {
        chunks.push(currentChunk);
      } else {
        // Current chunk is too small, combine with next iteration
        currentChunk += "\n\n" + trimmedParagraph;
        continue;
      }
      currentChunk = "";
    }

    // Add paragraph to current chunk
    if (currentChunk.length > 0) {
      currentChunk += "\n\n" + trimmedParagraph;
    } else {
      currentChunk = trimmedParagraph;
    }
  }

  // Add the final chunk if it has content
  if (currentChunk.length > 0) {
    // If the last chunk is too small and we have previous chunks,
    // append it to the last chunk
    const lastChunk = chunks[chunks.length - 1];
    if (
      currentChunk.length < MIN_CHUNK_SIZE &&
      lastChunk !== undefined &&
      lastChunk.length + currentChunk.length + 2 <= MAX_CHUNK_SIZE
    ) {
      chunks[chunks.length - 1] = lastChunk + "\n\n" + currentChunk;
    } else {
      chunks.push(currentChunk);
    }
  }

  return chunks;
}