import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const mongoURI = isProduction ? process.env.MONGO_URI : process.env.LOCAL_MONGO_URI;

    if (!mongoURI) {
      throw new Error(`MongoDB URI is not defined for ${isProduction ? "production" : "development"}`);
    }

    await mongoose.connect(mongoURI);

    if (isProduction) {
      console.log("Database connected in PRODUCTION mode (Cloud Atlas)...");
    } else {
      console.log("Database connected in DEVELOPMENT mode (Local)...");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
export default dbConnect;
