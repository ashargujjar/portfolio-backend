import { knowledge } from "../schema/schema";
import cloudinary from "../services/cloudinary";

class UploadSkill {
  publicUrl: string;
  publicId: string;
  constructor(publicUrl: string, publicId: string) {
    this.publicUrl = publicUrl;
    this.publicId = publicId;
  }
  async save() {
    const saved = await knowledge.insertOne({
      publicUrl: this.publicUrl,
      publicId: this.publicId,
    });
    if (saved) {
      return saved;
    }
    throw new Error("error saving the knowledge pdf");
  }
  async exists() {
    const pdf = await knowledge.findOne({});
    return pdf;
  }
  static async getPdf() {
    const pdf = await knowledge.findOne({});
    return pdf;
  }
  static async deletePdf(publicId: string) {
    let deletion = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    if (deletion.result !== "ok") {
      deletion = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
    }
    const deleted = await knowledge.findOneAndDelete({ publicId });
    return deleted;
  }
}
export default UploadSkill;
