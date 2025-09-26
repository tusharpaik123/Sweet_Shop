import dotenv from "dotenv";
import connectDB from "./src/services/mongodb.js";
import { app } from "./src/app.js";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

connectDB().then(
    () => {
        console.log("Database connected. Logging registered routes.");
        
        app.listen(process.env.PORT || 8000, () =>{
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    }
).catch((err) => {
    console.log("MONGO DB Connection failed in server.js ", err);
});