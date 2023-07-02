import mongoose from "mongoose";

//connect to mongodb
const connectDB = async () => {
  try {
    console.log("MongoDB Connecting... Please wait...".cyan.underline);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`!!! MongoDB Connected: ${conn.connection.host}`.cyan.underline);//cyan.underline.bold is a color
  } catch (error) {
    console.error(`??? Error: ${error.message}`.red.underline.bold);
    process.exit(1); //exit with failure
  }
};

export default connectDB;
