import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI?.endsWith('/') 
            ? `${process.env.MONGODB_URI}${process.env.DB_NAME}` 
            : `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;
            
        const connectionInstance = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Connected !! \n DB HOST: ${connectionInstance.connection.host}`);
        console.log(`Database: ${connectionInstance.connection.name}`);
    }
    catch (error) {
        console.log("MongoDB connection error ", error);
        process.exit(1);
    }
}

export default connectDB;