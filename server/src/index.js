import dotenv from "dotenv";
import connectDB from "./services/mongodb.js";
import { configureCloudinary, testCloudinaryConnection } from "./services/cloudinary.js";
import { app } from "./app.js";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

const initializeCloudinary = async () => {
    const cloudinaryConfigured = configureCloudinary();
    if (cloudinaryConfigured) {
        await testCloudinaryConnection();
    }
    return cloudinaryConfigured;
};

const initializeServices = async () => {
    try {
        const cloudinaryConfigured = await initializeCloudinary();
        
        // Connect to MongoDB
        await connectDB();
        console.log("✅ Database connected. Logging registered routes...");
        
        // Start server
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
            if (cloudinaryConfigured) {
                console.log("✅ All services initialized successfully!");
            } else {
                console.log("⚠️  Server running but Cloudinary not configured");
            }
        });
    } catch (err) {
        console.log("❌ Service initialization failed:", err.message);
        process.exit(1);
    }
};

initializeServices();
