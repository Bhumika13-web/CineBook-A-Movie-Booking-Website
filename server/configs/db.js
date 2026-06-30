import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "cinebook",
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;