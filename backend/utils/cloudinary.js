import {v2 as cloudinary} from "cloudinary";
import fs from "fs";      //fs--> nodejs file system for file operation

// from cloudinary images
 // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    //wrote self, direct Cloudinary upload helper function.
    const uploadOnCloudinary = async(localFilePath) => {
        try {
            if(!localFilePath) return null;

            //upload file on cloudinary
            const res = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto'                 //for all type file
            })
            console.log("File uploaded to cloudinary: ", res.url);
            return res;
        } catch (error) {
            fs.unlinkSync(localFilePath)  //unlink/ delete / remove the locally saved temporary file as the upload operation got failed
            return null;
        }
    }

    export default cloudinary;