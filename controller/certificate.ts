import { Request, Response } from "express";
import Certificate from "../model/certificate";
import { ApiResponse } from "../utils/apiResponse";
import { deleteCloudinaryImage } from "../utils/cloudinarySignature";

export const addCertificate = async (req: Request, res: Response) => {
  const { title, issuer, link, imageUrl } = req.body;
  try {
    const cert = new Certificate(title, issuer, link, imageUrl);
    const saved = await cert.create();
    if (saved) {
      return res
        .status(201)
        .json(ApiResponse(true, "Certificate created successfully", saved));
    }
    throw new Error("Error saving certificate");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(400).json(ApiResponse(false, message));
  }
};

export const getCertificates = async (req: Request, res: Response) => {
  try {
    const certs = await Certificate.getCertificates();
    return res
      .status(200)
      .json(ApiResponse(true, "Certificates fetched successfully", certs));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(400).json(ApiResponse(false, message));
  }
};

export const editCertificate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, issuer, link, imageUrl } = req.body;

  try {
    const existingCert = await Certificate.getCertificateById(id as string);
    if (!existingCert) {
      throw new Error("Certificate not found");
    }

    if (
      imageUrl &&
      imageUrl.public_id &&
      existingCert.imageUrl &&
      existingCert.imageUrl.public_id
    ) {
      if (imageUrl.public_id !== existingCert.imageUrl.public_id) {
        await deleteCloudinaryImage(existingCert.imageUrl.public_id);
      }
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (issuer) updateData.issuer = issuer;
    if (link) updateData.link = link;
    if (imageUrl) updateData.imageUrl = imageUrl;

    const updatedCert = await Certificate.editCertificate(
      id as string,
      updateData,
    );
    if (updatedCert) {
      return res
        .status(200)
        .json(
          ApiResponse(true, "Certificate updated successfully", updatedCert),
        );
    }
    throw new Error("Error updating certificate");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(400).json(ApiResponse(false, message));
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cert = await Certificate.getCertificateById(id as string);
    if (!cert) {
      throw new Error("Certificate not found");
    }

    if (cert.imageUrl && cert.imageUrl.public_id) {
      await deleteCloudinaryImage(cert.imageUrl.public_id);
    }

    const deleted = await Certificate.deleteCertificate(id as string);
    if (deleted) {
      return res
        .status(200)
        .json(ApiResponse(true, "Certificate deleted successfully", deleted));
    }
    throw new Error("Error deleting certificate");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(400).json(ApiResponse(false, message));
  }
};
