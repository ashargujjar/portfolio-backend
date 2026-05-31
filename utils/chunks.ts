import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const generateChunks = async (rawText: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 200,
    chunkSize: 1000,
  });
  const chunks = await splitter.splitText(rawText);
  return chunks;
};
