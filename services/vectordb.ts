import { Pinecone } from "@pinecone-database/pinecone";

// Initialize the Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Define what a chunk payload looks like
interface VectorChunkPayload {
  id: string;
  documentId: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    page: number;
  };
}

export async function storeInVectorDB(payload: VectorChunkPayload) {
  // Target your specific index configured in your Vector DB dashboard
  const index = pc.index(process.env.PINECONE_INDEX_NAME || "rag-index");

  // Upsert the vector vector into the DB
  await index.upsert({
    records: [
      {
        id: payload.id,
        values: payload.embedding,
        metadata: {
          documentId: payload.documentId,
          text: payload.text,
          source: payload.metadata.source,
          page: payload.metadata.page,
        },
      },
    ],
  });
}
