import { ChatDeepSeek } from "@langchain/deepseek";
const llm = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.1,
});

export default llm;
