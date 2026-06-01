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
Routes.post("/login", login);
Routes.post("/chat", PostChatQuestion);
// -------------- Skill ---------------
Routes.route("/skills")
  .get(getSkills)
  .post(Authenticate, CreateSkillCategory)
  .patch(Authenticate, AddSkills)
  .delete(Authenticate, deleteSkill);

Routes.delete("/skills/specific", deleteSpecificSkill);
Routes.patch("/skills/title", editTitle);

// --------------- Education ------------------
Routes.route("/education")
  .get(getEducation)
  .post(Authenticate, addEducation)
  .delete(Authenticate, deletEducation)
  .patch(Authenticate, editEducation);
// --------------- Experience ------------------

Routes.route("/experience")
  .get(getExperience)
  .post(Authenticate, addExperience)
  .delete(Authenticate, deleteExperiance)
  .patch(Authenticate, editExperiance);
Routes.post("/uploads/signature", Authenticate, generateSignature);
Routes.route("/uploads/knowledge-pdf")
  .get(getPdf)
  .post(Authenticate, uploadKnowledgePdf)
  .delete(Authenticate, deletePdf);
//   ----------- Project ------------
Routes.route("/project").post(
  Authenticate,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  uploadProject,
);
Routes.route("/project/:id").patch(
  Authenticate,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  editProject,
);
Routes.delete("/image/:projectId", Authenticate, deleteImage);
Routes.delete("/project/:id", Authenticate, deleteProject);
Routes.get("/project", getProject);

// ----------- Certificate ------------
Routes.route("/certificates")
  .get(getCertificates)
  .post(Authenticate, addCertificate);
Routes.route("/certificates/:id")
  .patch(Authenticate, editCertificate)
  .delete(Authenticate, deleteCertificate);

// ----------- Blog ------------
Routes.route("/blogs")
  .get(getBlogs)
  .post(Authenticate, addBlog);
Routes.route("/blogs/:id")
  .patch(Authenticate, editBlog)
  .delete(Authenticate, deleteBlog);

export default Routes;
