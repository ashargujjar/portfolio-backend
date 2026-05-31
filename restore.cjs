const fs = require('fs');

const missing = `import { Schema, model } from "mongoose";

const UploadedFileSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false },
);
const knowledgeSchema = new Schema({
  title: {
    type: String,
    default: "Knowledge Schme",
    unique: true,
  },
  publicUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});
const skills = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
`;

const content = fs.readFileSync('d:/portfolio/backend/schema/schema.ts', 'utf8');
fs.writeFileSync('d:/portfolio/backend/schema/schema.ts', missing + content);
console.log("Fixed schema.ts successfully");
