import { Job, JobData, tryCatch, Worker } from "bullmq";
import { PDFParse } from "pdf-parse";
import { connection } from "../utils/RedisConnection";
type RagJobData = {
  cloudinaryUrl: string;
  documentId: string;
  uploadedAt: string; // or Date if you convert it
};
import { generateChunks } from "../utils/chunks";
import { returnEmbeddings } from "../utils/embedings";
import { storeInVectorDB } from "./vectordb";

const worker = new Worker(
  "rag-processing",
  async (job: Job<RagJobData>) => {
    const { cloudinaryUrl, documentId, uploadedAt } = job.data;
    await job.updateProgress(10);
    // Step 1: Extract text from PDF
    const parser = new PDFParse({ url: cloudinaryUrl });
    try {
      const pdfData = await parser.getText();
      job.updateProgress(50);
      const chunks = await generateChunks(pdfData.text);
      await job.updateProgress(70);
      // Step 4: Generate embeddings and store in vector DB
      const embeddings = await returnEmbeddings(chunks);
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
      await job.updateProgress(100);
    } catch (error) {
      throw new Error("internal server pdf processing worker error");
    } finally {
      parser.destroy();
    }
  },
  { connection: connection as any },
);
