import mongoose from "mongoose";
export const connectDb = async (cb: () => void) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    cb();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
