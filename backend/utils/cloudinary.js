import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //fs--> nodejs file system for file operation

// from cloudinary images
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//wrote self, direct Cloudinary upload helper function.
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //else upload file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", //for all type file
    });

    console.log("File uploaded to cloudinary: ", res.url);

    fs.unlinkSync(localFilePath); // cleanup/unlink/remove temp file after successful upload
    return res;

  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    fs.unlinkSync(localFilePath); //unlink/ delete / remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

