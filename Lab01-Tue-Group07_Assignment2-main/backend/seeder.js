//失败了。。。

import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import phones from "./data/phones.js";
import User from "./models/userModel.js";
import Phone from "./models/phoneModel.js";

import connectDB from "./config/db.js";

dotenv.config();
console.log("等待数据库连接".yellow.inverse);
connectDB();

const importData = async () => {
  try {
    //empty database
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(15000); // 等待 15 秒

    await User.deleteMany();
    await Phone.deleteMany();

    //insert sample data
    await User.insertMany(users);
    await Phone.insertMany(phones);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1); //exit with failure
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Phone.deleteMany();

    console.log("Data Destroyed!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1); 
  }
};

// Determine if the argument on the command line is -d, if it is -d, execute destroyData(), if not -d, execute importData()
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}