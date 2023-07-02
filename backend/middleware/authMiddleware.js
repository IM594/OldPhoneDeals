import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// Protect here means protected route, only logged in users can access it, otherwise it returns 401
const protect = asyncHandler(async (req, res, next) => {
  let token;
  //   console.log(req.headers.authorization);
  if (
    //if req.headers.authorization exists and starts with Bearer
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // The token here is the token passed from the front-end
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
      // decoded here refers to the user information parsed from the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      // here req.user refers to the user information retrieved from the database, with the password removed
      req.user = await User.findById(decoded.id).select("-password");
      //next() means to proceed to the next step if the user information is successfully verified
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
