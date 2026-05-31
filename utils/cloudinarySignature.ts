import cloudinary from "../services/cloudinary";
import streamifier from "streamifier";
export const generateCloudinarySecret = (timestamp: number) => {
  const folder: string = process.env.CLOUDINARY_FOLDER!;
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET as string,
  );
  return signature;
};
export const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
export const deleteCloudinaryImage = async (public_id: string) => {
  await cloudinary.uploader.destroy(`portfolio/${public_id}`);
};
