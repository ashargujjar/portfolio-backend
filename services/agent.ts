import { createAgent, HumanMessage, tool } from "langchain";
import { OpenAIEmbeddings } from "@langchain/openai";
import z from "zod";
import llm from "../utils/agentModel";
import { portfolioSystemPrompt } from "../utils/prompts";
import { index } from "./vectordb";
const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_KEY,
});
const portfolioTool = tool(
  async ({ query }) => {
    const vector = await embeddings.embedQuery(query);
    const result = await index.query({
      vector,
      topK: 5,
      includeMetadata: true,
    });
    const context = result.matches
      ?.map((m) => {
        return m.metadata?.text;
      })
      .filter(Boolean);
    return context.join("\n\n");
  },
  {
    name: "portfolio_retriever",
    description:
      "Search Ashar Ashraf portfolio (projects, skills, certifications, experience) from Pinecone vector database.",
    schema: z.object({
      query: z.string(),
    }),
  },
);
const asharAgentinformation = createAgent({
  model: llm,
  systemPrompt: portfolioSystemPrompt,
  tools: [portfolioTool],
});
export const LLMResponse = async (question: string) => {
  const response = await asharAgentinformation.invoke({
    messages: [new HumanMessage({ content: question })],
  });
  return response.messages.at(-1)?.content;
};
