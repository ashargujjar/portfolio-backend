import { educationSchema } from "../schema/schema";

class Education {
  degree: string;
  school: string;
  year: string;
  constructor(degree: string, school: string, year: string) {
    this.degree = degree;
    this.school = school;
    this.year = year;
  }
  async save() {
    const saved = await educationSchema.insertOne({
      degree: this.degree,
      school: this.school,
      year: this.year,
    });
    if (saved) {
      return saved;
    }
    throw new Error("error adding the education");
  }
  static async deleteEducation(id: string) {
    const del = await educationSchema.findByIdAndDelete(id);
    return del;
  }
  static async getEducation() {
    const education = await educationSchema.find();
    return education;
  }
  static async editEducation(id: string, degree: string, school: string, year: string) {
    const edit = await educationSchema.findByIdAndUpdate(
      id,
      {
        degree: degree,
        school: school,
        year: year,
      },
      { new: true },
    );
    return edit;
  }
}

export default Education;
