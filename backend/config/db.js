import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://dulanjalisenarathna93:E2JUb0zfaT2FVp8D@cluster0.exkxkun.mongodb.net/reactjs-food-delivery-app';

    await mongoose.connect(mongoUri).then(() => {
        console.log('DB connected');
    });
};