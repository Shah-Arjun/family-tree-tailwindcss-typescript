// DB connection code goes here

import mongoose from "mongoose";

//making and exporting DB connection arrow function at the same time
export const connectDatabase = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      //establish connextion between nodejs and mongoDB
       useNewUrlParser: true, //Uses the new MongoDB connection string parser.
      useUnifiedTopology: true, //Uses the new MongoDB driver engine for handling connections, monitoring, and failovers.
    });
    console.log("MongoDB connected!");
  } catch (err) {
    console.log("MongoDB connection error:", err.message);
    process.exit(1); // exit process if db connection fails
  }
};
