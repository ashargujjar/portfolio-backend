import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const generateChunks = async (rawText: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 150,
    chunkSize: 800,
    separators: ["\n\n", "\n", " ", ""],
  });

  const chunks = await splitter.splitText(rawText);
  return chunks;
};
