import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
export const returnEmbeddings = async (chunks: string[]) => {
  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks,
  });
  return result.data.map((item) => item.embedding);
};
