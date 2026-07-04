import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://himanshukardam1437_db_user:<db_password>@cluster0.aqpt8cm.mongodb.net/?appName=Cluster0';

    await mongoose.connect(mongoUri).then(() => {
        console.log('DB connected');
    });
};