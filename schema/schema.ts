import { Schema, model } from "mongoose";

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
  },
  skills: {
    type: [String],
    required: true,
    default: [],
  },
});
const ProjectsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  topBannerImg: {
    secure_url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  description: {
    type: String,
    required: true,
  },
  shortSummary: {
    type: String,
    required: true,
  },
  image: [
    {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  ],
  github: {
    type: String,
    default: "",
  },
  live: {
    type: String,
    default: "",
  },
});
const ArticalSchema = new Schema({
  title: {
    type: String,

    required: true,
  },
  category: {
    type: String,

    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: UploadedFileSchema,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  aiSummary: {
    type: String,
  },
  topics: {
    type: [String],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});
const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  heroText: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gitHub: {
    type: String,
    required: true,
  },
  linkedinUrl: {
    type: String,
    required: true,
  },
});
const UploadResume = new Schema({
  resumeUrl: {
    type: UploadedFileSchema,
    required: true,
  },
});
const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);
const EducationSchema = new Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },

    school: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);
const certificateSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, "Issuer name is required"],
      trim: true,
    },
    imageUrl: {
      type: UploadedFileSchema,
      default: undefined,
    },
    link: {
      type: String,
      trim: true,
      default: "#",
    },
  },
  {
    timestamps: true,
  },
);
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: String,
    required: true,
    trim: true,
  },
})
export const userSchema = model("user", UserSchema);
export const knowledge = model("Knowledge", knowledgeSchema);
export const certificate = model("certificate", certificateSchema);
export const educationSchema = model("education", EducationSchema);
export const experienceSchema = model("experiance", ExperienceSchema);
export const uploadResume = model("resume", UploadResume);
export const profileSchema = model("profile", ProfileSchema);
export const skillsSchema = model("skills", skills);
export const projectsSchema = model("project", ProjectsSchema);
export const articalSchema = model("article", ArticalSchema);
