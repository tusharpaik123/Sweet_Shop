import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config();


const configureCloudinary = () => {
    try {
        if (process.env.CLOUDINARY_URL) {
            console.log('[cloudinary] Using CLOUDINARY_URL for configuration');
            
            const url = process.env.CLOUDINARY_URL;
            const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
            
            if (match) {
                const [, apiKey, apiSecret, cloudName] = match;
                
                cloudinary.config({
                    cloud_name: cloudName,
                    api_key: apiKey,
                    api_secret: apiSecret,
                    secure: true
                });
            } else {
                console.error('[cloudinary] ❌ Invalid CLOUDINARY_URL format. Expected: cloudinary://api_key:api_secret@cloud_name');
                return false;
            }
            
            console.log('[cloudinary] ✅ Cloudinary configured successfully using CLOUDINARY_URL');
        } else {
            const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
            const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY || process.env.CLOUDINARY_KEY;
            const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_SECRET;
            
            if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
                console.error('[cloudinary] ❌ Cloudinary is not configured. Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in server/.env');
                return false;
            }
            
            cloudinary.config({
                cloud_name: CLOUDINARY_CLOUD_NAME,
                api_key: CLOUDINARY_API_KEY,
                api_secret: CLOUDINARY_API_SECRET,
                secure: true
            });
            console.log('[cloudinary] ✅ Cloudinary configured successfully with individual credentials');
        }
        
        return true;
    } catch (error) {
        console.error('[cloudinary] ❌ Failed to configure Cloudinary:', error.message);
        return false;
    }
};

const uploadImageOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        
        console.log('[cloudinary] Uploading file:', localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "sweetshop/sweets",
        });
        
        console.log('[cloudinary] ✅ File uploaded successfully:', response.url);
        
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return response;
    } catch (error) {
        console.error('[cloudinary] ❌ Upload failed:', error.message);
        
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;
    }
};

const testCloudinaryConnection = async () => {
    try {
        await cloudinary.api.ping();
        console.log('[cloudinary] ✅ Cloudinary connection test successful');
        return true;
    } catch (error) {
        console.error('[cloudinary] ❌ Cloudinary connection test failed:', error.message);
        return false;
    }
};

export {
    configureCloudinary,
    uploadImageOnCloudinary,
    testCloudinaryConnection
};