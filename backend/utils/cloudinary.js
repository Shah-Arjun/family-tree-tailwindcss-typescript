import { v2 as cloudinary } from "cloudinary";
//import fs from "fs"; //fs--> nodejs file system for file operation
import dotenv from 'dotenv';

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//wrote self, direct Cloudinary upload helper function., upload buffer directly
export const uploadOnCloudinary = async (fileBuffer) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "public" }, // optional folder
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer); // send buffer
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};
