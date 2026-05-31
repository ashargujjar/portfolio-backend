import { certificate } from "../schema/schema";

type imageType = {
  url: string;
  public_id: string;
};

class Certificate {
  title: string;
  issuer: string;
  imageUrl?: imageType;
  link: string;

  constructor(title: string, issuer: string, link: string, imageUrl?: imageType) {
    this.title = title;
    this.issuer = issuer;
    this.link = link;
    this.imageUrl = imageUrl;
  }

  async create() {
    const newCert = await certificate.create({
      title: this.title,
      issuer: this.issuer,
      link: this.link,
      imageUrl: this.imageUrl,
    });
    return newCert;
  }

  static async getCertificates() {
    const certs = await certificate.find({});
    return certs;
  }

  static async getCertificateById(id: string) {
    const cert = await certificate.findById(id);
    return cert;
  }

  static async editCertificate(id: string, updateData: any) {
    const updatedCert = await certificate.findByIdAndUpdate(id, updateData, { new: true });
    return updatedCert;
  }

  static async deleteCertificate(id: string) {
    const deletedCert = await certificate.findByIdAndDelete(id);
    return deletedCert;
  }
}

export default Certificate;
