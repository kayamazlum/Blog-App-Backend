import mongoose, { ConnectOptions } from "mongoose";
import { MONGO_URI } from "./config";

const db = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the enviroment veriables");
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("MongoDB is connected!");
  } catch (err) {
    console.error("Error! MongoDB connection is failed", err);
  }
};

export default db;
