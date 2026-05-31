import { PDFParse } from "pdf-parse";

import crypto from "crypto";

import { generateChunks } from "../utils/chunks";
import { returnEmbeddings } from "../utils/embedings";
import { storeInVectorDB } from "./vectordb";

export const uploadToVectorDB = async (cloudinaryUrl: string) => {
  const documentId = crypto.randomUUID();

  // Step 1: Extract text from PDF
  const parser = new PDFParse({ url: cloudinaryUrl });
  try {
    const pdfData = await parser.getText();
    console.log(pdfData);
    const chunks = await generateChunks(pdfData.text);
    console.log(chunks);
    // Step 4: Generate embeddings and store in vector DB
    const embeddings = await returnEmbeddings(chunks);
    console.log(embeddings);
    for (let i = 0; i < chunks.length; i++) {
      await storeInVectorDB({
        id: `${documentId}-${i}`,
        documentId,
        text: chunks[i],
        embedding: embeddings[i],
        metadata: {
          source: cloudinaryUrl,
          page: 1,
        },
      });
    }
  } catch (error) {
    throw new Error(`internal server pdf processing worker error ${error}`);
  } finally {
    parser.destroy();
  }
};
