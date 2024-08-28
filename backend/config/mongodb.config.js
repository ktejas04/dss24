import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'; 

export const connectDB = async () => {
    
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Error connecting to MongoDB", err)) 
}