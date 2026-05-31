import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import Project from "../model/project";
import {
  deleteCloudinaryImage,
  uploadToCloudinary,
} from "../utils/cloudinarySignature";
type imageType = {
  secure_url: string;
  public_id: string;
};
export const uploadProject = async (req: Request, res: Response) => {
  const { title, stack, summary, description, projectUrl, githubUrl } =
    req.body;
  try {
    const stackUsed = stack.split(",").map((x: string) => x.trim());
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    let banner: imageType = {
      secure_url: "",
      public_id: "",
    };
    let gallery: imageType[] = [];
    if (files.banner?.[0]) {
      const bannerResult: any = await uploadToCloudinary(files.banner[0]);
      banner.secure_url = bannerResult.secure_url;
      banner.public_id = bannerResult.public_id;
    }
    if (files.gallery) {
      for (const file of files.gallery) {
        let links: imageType = {
          public_id: "",
          secure_url: "",
        };
        const imageResult: any = await uploadToCloudinary(file);
        links["public_id"] = imageResult.public_id;
        links["secure_url"] = imageResult.secure_url;
        gallery.push(links);
      }
    }
    const project = new Project(
      title,
      stackUsed,
      banner,
      description,
      summary,
      gallery,
      githubUrl,
      projectUrl,
    );
    const saved = await project.create();
    if (saved) {
      const apires = ApiResponse(true, "Project created successfully", saved);
      return res.status(201).json(apires);
    } else {
      throw new Error("Error saving the user");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "internal server error";
    const apires = ApiResponse(false, message);
    return res.status(400).json(apires);
  }
};
export const getProject = async (req: Request, res: Response) => {
  const projects = await Project.getProjects();
  const apiResp = ApiResponse(true, "Projects fetched succesfull", projects);
  return res.status(200).json(apiResp);
};
export const editProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, stack, summary, description, projectUrl, githubUrl } = req.body;

  try {
    const updateData: any = {};
    if (title) updateData.title = title;
    if (stack) {
      updateData.techStack = stack.split(",").map((x: string) => x.trim());
    }
    if (summary) updateData.shortSummary = summary;
    if (description) updateData.description = description;
    if (projectUrl) updateData.live = projectUrl;
    if (githubUrl) updateData.github = githubUrl;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files && files.banner?.[0]) {
      const bannerResult: any = await uploadToCloudinary(files.banner[0]);
      updateData.topBannerImg = {
        secure_url: bannerResult.secure_url,
        public_id: bannerResult.public_id,
      };
    }

    let gallery: imageType[] = [];
    if (files && files.gallery) {
      for (const file of files.gallery) {
        let links: imageType = {
          public_id: "",
          secure_url: "",
        };
        const imageResult: any = await uploadToCloudinary(file);
        links["public_id"] = imageResult.public_id;
        links["secure_url"] = imageResult.secure_url;
        gallery.push(links);
      }
    }

    const updatedProject = await Project.editProject(id as string, updateData, gallery);

    if (updatedProject) {
      const apires = ApiResponse(
        true,
        "Project updated successfully",
        updatedProject,
      );
      return res.status(200).json(apires);
    } else {
      throw new Error("Project not found or error updating the project");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "internal server error";
    const apires = ApiResponse(false, message);
    return res.status(400).json(apires);
  }
};
export const deleteImage = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { public_id } = req.body;
  try {
    if (!projectId || !public_id) {
      throw new Error("Both project and the public id is required ");
    }
    const deletePicture = await Project.deletePicture(
      projectId as string,
      public_id,
    );
    if (deletePicture) {
      await deleteCloudinaryImage(public_id);
      const apires = ApiResponse(
        true,
        "image deleted successfully",
        deletePicture,
      );
      return res.status(200).json(apires);
    } else {
      throw new Error("error deleting the picture");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "internal server error";
    const apires = ApiResponse(false, message);
    return res.status(400).json(apires);
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.getProjectById(id as string);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.topBannerImg && project.topBannerImg.public_id) {
      await deleteCloudinaryImage(project.topBannerImg.public_id);
    }

    if (project.image && project.image.length > 0) {
      for (const img of project.image) {
        if (img.public_id) {
          await deleteCloudinaryImage(img.public_id);
        }
      }
    }

    const deleted = await Project.deleteProject(id as string);

    if (deleted) {
      const apires = ApiResponse(true, "Project deleted successfully", deleted);
      return res.status(200).json(apires);
    } else {
      throw new Error("Error deleting the project");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "internal server error";
    const apires = ApiResponse(false, message);
    return res.status(400).json(apires);
  }
};
