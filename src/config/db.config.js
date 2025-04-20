import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    await mongoose.connect(process.env.URL)
    .then(() => {console.log("Connected to DB!")})
    .catch((e) => {console.log("Error while connecting to DB!", e.message)});
};

export { connectDB };