import { skillsSchema } from "../schema/schema";

class Skills {
  category: string;
  constructor(category: string) {
    this.category = category;
  }
  async save() {
    const saved = await skillsSchema.insertOne({ title: this.category });
    if (saved) {
      return saved;
    }
    throw new Error("error creating the category");
  }
  static async addSkill(id: string, skill: string) {
    const added = await skillsSchema.updateOne(
      { _id: id },
      { $push: { skills: skill } },
    );
    if (added) {
      return added;
    }
    throw new Error("error adding the skill");
  }
  static async getSkills() {
    const skills = await skillsSchema.find();
    return skills;
  }
  static async editTitle(id: string, category: string) {
    const edit = await skillsSchema.findByIdAndUpdate(
      id,
      { title: category },
      { new: true },
    );
    return edit;
  }
  static async deleteSkill(id: string) {
    const del = await skillsSchema.findByIdAndDelete(id);
    return del;
  }
  static async deleteSpecific(id: string, skill: string) {
    const exists = await skillsSchema.findOne({ _id: id, skills: skill });
    if (!exists) {
      throw new Error("Skill not exists");
    }
    const todel = await skillsSchema.updateOne(
      { _id: id },
      { $pull: { skills: skill } },
    );
    return todel;
  }
}

export default Skills;
