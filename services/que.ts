import { Queue } from "bullmq";
import { randomUUID } from "crypto";
import { connection } from "../utils/RedisConnection";

export function generateId(): string {
  return randomUUID();
}

export const ragQueue = new Queue("rag-processing", {
  connection: connection as any,
});
