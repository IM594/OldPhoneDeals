import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Phone from "../models/phoneModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler"; //use this to handle async errors
import { ObjectId } from "mongodb";

// register a new user
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // get the data from the request body
  const { firstname, lastname, email, password } = req.body;

  // using the email, check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(402);
    throw new Error("User already exists");
  }

  //password validation
  if (
    !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/g)
  ) {
    res.status(401);
    throw new Error(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character."
    );
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
    });

    // send email to user
    await user.sendEmail("accountCreation");
  } else {
    // if user is not created
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// verify a user's email address
// @desc Verify a user's email address
// @route GET /api/users/verify/:token
// @access Public
const verifyUserEmail = asyncHandler(async (req, res) => {
  console.log("正在 Verifying user email address");
  // get the token from the request
  const token = req.params.token;

  console.log("token:", token);

  // if no token is provided, return an error
  if (!token) {
    res.status(400);
    throw new Error("No verification token provided");
  }

  // using the token, decode the user's id
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  console.log("decoded:", decoded);

  // find the user by id
  const user = await User.findById(decoded.id);

  // if no user is found, return an error
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // If the corresponding user is found, set their email address to authenticated and remove the authentication token
  user.isVerified = true;
  await user.save();

  res.status(200).json({
    message: "Your email address has been verified successfully",
  });
});

// User authentication & token acquisition
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // If the user does not exist, or if the password does not match, then an exception is thrown with "Incorrect email or password".
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    // throw new Error("Invalid email or password");
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // If the user exists and the password matches, then check the isVerified field
  // Check that the user object has an isVerified field and that the value of this field is false.
  if (user.isVerified === false) {
    // If the isVerified field is present and false, throw an exception "Mailbox not verified"
    // res.status(400);
    // throw new Error("Please verify your email address");
    return res.status(400).json({
      message: "Please verify your email address",
    });
  } else {
    console.log("user.isVerified" + user.isVerified);
    res.status(200).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
    });
  }
});

// Obtain information on successfully logged in users
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Update user profiles
// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // req.user._id 是从 token 中解析出来的用户 id
  const user = await User.findById(req.user._id);

  // if the user exists, update the user's information
  if (user) {
    //If the user wants to change their personal details, they must enter their original password
    if (req.body.password) {
      //Compare passwords using the matchPassword method, which is defined in user_model.js
      const isMatch = await user.matchPassword(req.body.password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid password");
      }
    } else {
      res.status(400);
      throw new Error("Please enter your current password");
    }
    //If the user updates the mailbox, verify that the mailbox already exists and send a verification email to this mailbox
    if (req.body.email && req.body.email !== user.email) {
      // Use the findOne method to find out if there are other users using this mailbox
      const existingUser = await User.findOne({ email: req.body.email });
      // return an error message if there is another user using this mailbox
      if (existingUser) {
        res.status(400);
        throw new Error("Email already in use");
      }
      // Assign this mailbox to user.email if there is no other user using it
      user.email = req.body.email;
      // set isVerified to false if the user already has an isVerified field;
      //If the user does not have an isVerified field, add it to the user and set it to false.
      //Use the $set operator to set or add fields, if they don't exist, add them, if they do, update them
      user.$set({ isVerified: false });
      // send an authentication email to the user using the sendEmail method, which is defined in user_model.js
      await user.sendEmail("emailChange");
    }
    //Update other information, meaning assign req.body.firstname to user.firstname if req.body.firstname exists, otherwise assign user.firstname to user.firstname
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;

    // Update the password if the user enters a new one
    if (req.body.newPassword) {
      user.password = req.body.newPassword;
      await user.sendEmail("passwordChanged");
    }
    // Save the updated user information, which is automatically encrypted before the password is saved, as defined in userSchema.pre('save').
    const updatedUser = await user.save();
    // Return the updated user information to the front-end and regenerate the token.
    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//forgot password
// @desc Forgot password
// @route POST /api/users/forgotpassword
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please enter your email" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.sendEmail("forgotPassword");
    //如果找到了用户，则发送重置密码邮件给用户
    res.json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//监听用户是否点击了重置密码邮件中的链接。如果点击了，用户能直接输入新密码进行修改。如果没点击，用户输入新密码并提交时，会提示‘没有点击链接’。需要把是否点击链接的状态保存在数据库中，这里我们使用 resetLinkVerified 字段来保存。
// @desc verify if the user clicks the link in the reset password email
// @route GET /api/users/verify-reset-password/:token
// @access Public
const verifyResetPassword = asyncHandler(async (req, res) => {
  //get token from request parameters
  const { token } = req.params;
  //Verify the token using jwt's verify method
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      //if the token is invalid, return an error message
      return res.status(401).json({ message: "Invalid token" });
    }
    //if the token is valid, get the user's id from the decoded token
    const { id } = decoded;
    //find the user by id
    const user = await User.findById(id);
    //if the user doesn't exist, return an error message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //if the user exists, add a new field named resetLinkVerified to the user and set it to true
    //add a new field to the user using the $set operator
    user.$set({ resetLinkVerified: true });

    //save the updated user information
    await user.save();
    //return user information to the front-end
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      resetLinkVerified: user.resetLinkVerified,
    });
  });
});

//在重置密码的方法里，我们需要接收三个参数，一个是上一步用户输入的邮箱，另外两个是用户输入的新密码。

//监听用户是否点击了重置密码邮件中的链接。如果点击了，就能直接输入新密码进行修改。如果没点击，用户输入新密码并提交时会提示没有点击链接。在重置密码的方法里，我们需要接收三个参数，一个是上一步用户输入的邮箱，另外两个是用户输入的新密码。

//废弃
//Verify the token to reset the password and redirect to the reset password page
// @desc Redirect to reset password page
// @route GET /api/users/redirect-reset-password/:token
// @access Public
const redirectResetPassword = asyncHandler(async (req, res) => {
  // //get token from request parameters
  // const { token } = req.params;
  // //Verify the token using jwt's verify method
  // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: "Invalid token" });
  //   }
  //   const { id } = decoded;
  //   try {
  //     const user = await User.findById(id);
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //     // If the user exists, redirect to the reset password page and pass the token as a parameter to the page
  //     console.log(`${process.env.CLIENT_URL}/reset-password/${token}`);
  //     res.redirect(`${process.env.CLIENT_URL}/reset-password/${token}`); //The CLIENT_URL here is the address of the front-end, e.g. http://localhost:3000, where the token is taken from the request parameters
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Something went wrong" });
  //   }
  // });
});

// //user reset password
// // @desc Reset password
// // @route PUT /api/users/resetpassword
// // @access Public
// const resetPassword = asyncHandler(async (req, res) => {
//   const { newPassword, confirmPassword } = req.body;
//   const { token } = req.params;
//   if (!newPassword) {
//     return res.status(400).json({ message: "Please enter your new password" });
//   }
//   if (!confirmPassword) {
//     return res
//       .status(400)
//       .json({ message: "Please enter your confirm password" });
//   }
//   if (newPassword !== confirmPassword) {
//     return res
//       .status(400)
//       .json({ message: "New password and confirm password do not match" });
//   }
//   try {
//     jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: "Invalid token" });
//       }
//       const { id } = decoded;
//       const user = await User.findById(id);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       //if the user exists, update the password
//       user.password = newPassword;
//       await user.save();
//       //The updated user information is returned to the front-end and the token is regenerated.
//       res.json({
//         _id: user._id,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//       //send email to user to notify them that their password has been changed
//       await user.sendEmail("passwordChanged");
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

//在重置密码的方法里，我们需要接收三个参数，一个是上一步用户输入的邮箱，另外两个是用户输入的新密码。根据用户输入的邮箱，我们从数据库中查找用户，如果找到了用户，则根据其中的 resetLinkVerified 字段判断用户是否已经点击邮箱中的链接。如果点击了，用户能直接输入新密码进行修改。如果没点击，用户输入新密码并提交时，会提示‘没有点击链接’。需要把是否点击链接的状态保存在数据库中，这里我们使用 resetLinkVerified 字段来保存。

//user reset password
// @desc Reset password
// @route PUT /api/users/resetpassword
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  //首先根据 email 查询用户，看用户的 resetLinkVerified 字段是否为 true，如果为 true，说明用户已经点击了重置密码邮件中的链接，可以直接修改密码。如果为 false，说明用户没有点击链接，需要提示用户点击链接。
  try {
    //根据邮箱查询用户
    const user = await User.findOne({ email });
    console.log(user);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    //从 user 中取出 resetLinkVerified 字段
    const { resetLinkVerified } = user;
    console.log(resetLinkVerified);

    //根据邮箱查询到用户后，判断用户是否点击了链接
    //查询用户的 resetLinkVerified 字段是否为 true，如果为 true，说明用户已经点击了重置密码邮件中的链接，可以直接修改密码。否则，提示用户点击链接。

    if (resetLinkVerified === true) {
      //如果用户点击了链接，就可以直接修改密码
      if (!newPassword) {
        return res
          .status(400)
          .json({ message: "Please enter your new password" });
      }
      if (!confirmPassword) {
        return res
          .status(400)
          .json({ message: "Please enter your confirm password" });
      }
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }
      //if the user exists, update the password

      //password validation
      if (
        !newPassword.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/g
        )
      ) {
        return res
          .status(401)
          .json({
            message:
              "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.",
          });
      }

      user.password = newPassword;
      user.resetLinkVerified = false;
      await user.save();

      //The updated user information is returned to the front-end and the token is regenerated.
      res.json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        token: generateToken(user._id),
      });
      //send email to user to notify them that their password has been changed
      await user.sendEmail("passwordChanged");
    } else {
      // 如果用户没有点击链接，提示用户点击链接
      return res.status(400).json({
        message: "Please click the link in the email to reset your password",
      });
      // return user
      // return res.json({
      //   _id: user._id,
      //   firstname: user.firstname,
      //   lastname: user.lastname,
      //   email: user.email,
      //   resetLinkVerified: user.resetLinkVerified,
      // });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export {
  registerUser,
  verifyUserEmail,
  authUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyResetPassword,
  redirectResetPassword,
  resetPassword,
};
