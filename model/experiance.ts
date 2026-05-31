import { experienceSchema } from "../schema/schema";

class Experiance {
  role: string;
  company: string;
  period: string;
  description: string;
  constructor(role: string, company: string, period: string, description: string) {
    this.role = role;
    this.company = company;
    this.period = period;
    this.description = description;
  }
  async save() {
    const saved = await experienceSchema.insertOne({
      role: this.role,
      company: this.company,
      period: this.period,
      description: this.description,
    });
    if (saved) {
      return saved;
    }
    throw new Error("error adding the experiance");
  }
  static async deleteExperiance(id: string) {
    const del = await experienceSchema.findByIdAndDelete(id);
    return del;
  }
  static async getExperiance() {
    const experiance = await experienceSchema.find();
    return experiance;
  }
  static async editExperiance(
    id: string,
    role: string,
    company: string,
    period: string,
    description: string,
  ) {
    const edit = await experienceSchema.findByIdAndUpdate(
      id,
      {
        role: role,
        company: company,
        period: period,
        description: description,
      },
      { new: true },
    );
    return edit;
  }
}

export default Experiance;
