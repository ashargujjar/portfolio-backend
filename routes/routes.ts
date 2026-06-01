import express, { Request, Response } from "express";
import {
  AddSkills,
  CreateSkillCategory,
  addEducation,
  addExperience,
  deleteExperiance,
  deletEducation,
  editEducation,
  editExperiance,
  getEducation,
  getExperience,
  getSkills,
  deleteSkill,
  deleteSpecificSkill,
  editTitle,
} from "../controller/controller";
import { generateSignature } from "../controller/generateSignature";
import { uploadKnowledgePdf, deletePdf, getPdf } from "../controller/UploadPdf";
import upload from "../services/multer";
import { deleteImage, deleteProject, editProject, getProject, uploadProject } from "../controller/project";
import { addCertificate, deleteCertificate, editCertificate, getCertificates } from "../controller/certificate";
import { addBlog, editBlog, deleteBlog, getBlogs } from "../controller/Blogs";
import { login } from "../controller/Login";
import { PostChatQuestion } from "../controller/Chat";
import Authenticate from "../middleware/Authenticate";

const Routes = express.Router();

Routes.get("/", (req: Request, res: Response) => {
  res.send("server is running");
});
Routes.post("/api/login", login);
Routes.post("/api/chat", PostChatQuestion);
// -------------- Skill ---------------
Routes.route("/api/skills")
  .get(getSkills)
  .post(Authenticate, CreateSkillCategory)
  .patch(Authenticate, AddSkills)
  .delete(Authenticate, deleteSkill);

Routes.delete("/api/skills/specific", deleteSpecificSkill);
Routes.patch("/api/skills/title", editTitle);

// --------------- Education ------------------
Routes.route("/api/education")
  .get(getEducation)
  .post(Authenticate, addEducation)
  .delete(Authenticate, deletEducation)
  .patch(Authenticate, editEducation);
// --------------- Experience ------------------

Routes.route("/api/experience")
  .get(getExperience)
  .post(Authenticate, addExperience)
  .delete(Authenticate, deleteExperiance)
  .patch(Authenticate, editExperiance);
Routes.post("/api/uploads/signature", Authenticate, generateSignature);
Routes.route("/api/uploads/knowledge-pdf")
  .get(getPdf)
  .post(Authenticate, uploadKnowledgePdf)
  .delete(Authenticate, deletePdf);
//   ----------- Project ------------
Routes.route("/api/project").post(
  Authenticate,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  uploadProject,
);
Routes.route("/api/project/:id").patch(
  Authenticate,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  editProject,
);
Routes.delete("/api/image/:projectId", Authenticate, deleteImage);
Routes.delete("/api/project/:id", Authenticate, deleteProject);
Routes.get("/api/project", getProject);

// ----------- Certificate ------------
Routes.route("/api/certificates")
  .get(getCertificates)
  .post(Authenticate, addCertificate);
Routes.route("/api/certificates/:id")
  .patch(Authenticate, editCertificate)
  .delete(Authenticate, deleteCertificate);

// ----------- Blog ------------
Routes.route("/api/blogs")
  .get(getBlogs)
  .post(Authenticate, addBlog);
Routes.route("/api/blogs/:id")
  .patch(Authenticate, editBlog)
  .delete(Authenticate, deleteBlog);

export default Routes;
