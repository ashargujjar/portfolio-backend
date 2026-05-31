import { projectsSchema } from "../schema/schema";

type imageType = {
  secure_url: string;
  public_id: string;
};

class Project {
  title: string;
  techStack: string[];
  topBannerImg: imageType;
  description: string;
  shortSummary: string;
  image: imageType[];
  github: string;
  live: string;

  constructor(
    title: string,
    techStack: string[],
    topBannerImg: imageType,
    description: string,
    shortSummary: string,
    image: imageType[],
    github: string,
    live: string,
  ) {
    this.title = title;
    this.techStack = techStack;
    this.topBannerImg = topBannerImg;
    this.description = description;
    this.shortSummary = shortSummary;
    this.image = image;
    this.github = github;
    this.live = live;
  }
  async create() {
    const project = await projectsSchema.create({
      description: this.description,
      github: this.github,
      image: this.image,
      live: this.live,
      shortSummary: this.shortSummary,
      title: this.title,
      techStack: this.techStack,
      topBannerImg: this.topBannerImg,
    });
    return project;
  }
  static async getProjects() {
    const projects = await projectsSchema.find({});
    return projects;
  }
  static async deletePicture(projectId: string, public_id: string) {
    const projects = await projectsSchema.findByIdAndUpdate(
      { _id: projectId },
      { $pull: { image: { public_id: public_id } } },
    );
    return projects;
  }
  static async editProject(projectId: string, updateData: any, newGallery: imageType[]) {
    let updateQuery: any = { $set: updateData };
    if (newGallery && newGallery.length > 0) {
      updateQuery.$push = { image: { $each: newGallery } };
    }
    const updatedProject = await projectsSchema.findByIdAndUpdate(
      projectId,
      updateQuery,
      { new: true }
    );
    return updatedProject;
  }
  static async getProjectById(projectId: string) {
    const project = await projectsSchema.findById(projectId);
    return project;
  }
  static async deleteProject(projectId: string) {
    const project = await projectsSchema.findByIdAndDelete(projectId);
    return project;
  }
}

export default Project;
