import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import {
  educationValidation,
  experienceValidation,
  skillCategory,
} from "../schema/validation";
import Education from "../model/education";
import Experiance from "../model/experiance";
import Skills from "../model/skills";
import { skillsSchema } from "../schema/schema";
export const CreateSkillCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const result = skillCategory.safeParse({
      category: category,
    });

    if (!result.success) {
      throw new Error(result.error.message);
    }

    const skill = new Skills(result.data.category!);
    const saved = await skill.save();
    const api = ApiResponse(true, "Category created successfully", saved);
    return res.status(201).json(api);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const AddSkills = async (req: Request, res: Response) => {
  try {
    const { id, skills } = req.body;
    const result = skillCategory.safeParse({
      skills: skills,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const add = await Skills.addSkill(id, result.data.skills!);
    const resp = ApiResponse(true, "skill added", add);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skills.getSkills();
    const resp = ApiResponse(true, "fetched succesfull", skills);
    console.log(resp);
    return res.status(200).json(resp);
  } catch (error) {
    const resp = ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const skill = await skillsSchema.findById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }
    const del = await Skills.deleteSkill(id);
    if (!del) {
      throw new Error("Error deleting the Skill ");
    }
    const resp = ApiResponse(true, "deleted succesfull", del);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const deleteSpecificSkill = async (req: Request, res: Response) => {
  try {
    const { id, skillname } = req.body;
    const del = await Skills.deleteSpecific(id, skillname);
    const resp = ApiResponse(true, "deleted succesfull", del);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const editTitle = async (req: Request, res: Response) => {
  try {
    const { id, category } = req.body;
    const result = skillCategory.safeParse({
      category: category,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    if (!result.data.category) {
      throw new Error("Category is required");
    }
    const skill = await skillsSchema.findById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }
    const edit = await Skills.editTitle(id, result.data.category);
    if (!edit) {
      throw new Error("Error editing the Skill ");
    }
    const resp = ApiResponse(true, "edited succesfull", edit);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
// ----------- experience -------------
export const addEducation = async (req: Request, res: Response) => {
  try {
    const { degree, school, year } = req.body;
    const result = educationValidation.safeParse({
      degree: degree,
      school: school,
      year: year,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const education = new Education(
      result.data.degree,
      result.data.school,
      result.data.year,
    );
    const saved = await education.save();
    const resp = ApiResponse(true, "education added", saved);
    return res.status(201).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const deletEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const del = await Education.deleteEducation(id);
    if (!del) {
      throw new Error("Error deleting the education ");
    }
    const resp = ApiResponse(true, "deleted succesfull", del);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const editEducation = async (req: Request, res: Response) => {
  try {
    const { id, degree, school, year } = req.body;
    const result = educationValidation.safeParse({
      degree: degree,
      school: school,
      year: year,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const edit = await Education.editEducation(
      id,
      result.data.degree,
      result.data.school,
      result.data.year,
    );
    if (!edit) {
      throw new Error("Error editing the education ");
    }
    const resp = ApiResponse(true, "edited succesfull", edit);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const getEducation = async (req: Request, res: Response) => {
  try {
    const education = await Education.getEducation();
    const resp = ApiResponse(true, "fetched succesfull", education);
    return res.status(200).json(resp);
  } catch (error) {
    const resp = ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const getExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experiance.getExperiance();
    const resp = ApiResponse(true, "fetched succesfull", experience);
    return res.status(200).json(resp);
  } catch (error) {
    const resp = ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const addExperience = async (req: Request, res: Response) => {
  try {
    const { role, company, period, description } = req.body;
    const result = experienceValidation.safeParse({
      role: role,
      company: company,
      period: period,
      description: description,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const experiance = new Experiance(
      result.data.role,
      result.data.company,
      result.data.period,
      result.data.description,
    );
    const saved = await experiance.save();
    const resp = ApiResponse(true, "experiance added", saved);
    return res.status(201).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const deleteExperiance = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const del = await Experiance.deleteExperiance(id);
    if (!del) {
      throw new Error("Error deleting the experiance ");
    }
    const resp = ApiResponse(true, "deleted succesfull", del);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
export const editExperiance = async (req: Request, res: Response) => {
  try {
    const { id, role, company, period, description } = req.body;
    const result = experienceValidation.safeParse({
      role: role,
      company: company,
      period: period,
      description: description,
    });
    if (!result.success) {
      throw new Error(result.error.message);
    }
    const edit = await Experiance.editExperiance(
      id,
      result.data.role,
      result.data.company,
      result.data.period,
      result.data.description,
    );
    if (!edit) {
      throw new Error("Error editing the experiance ");
    }
    const resp = ApiResponse(true, "edited succesfull", edit);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
