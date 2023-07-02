import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetLinkVerified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Encrypt the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // If the password has not been changed, there is no need to encrypt it, just go to the next step, i.e. save
    next();
  }
  const salt = await bcrypt.genSalt(10); //Generate a salt, where 10 is the cost of generating the salt, the higher the cost, the more complex the encrypted cipher
  this.password = await bcrypt.hash(this.password, salt); //Use the salt to encrypt the password
});

// 检查用户输入的密码是否和数据库中的密码匹配
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); //the first parameter is the password entered by the user, the second parameter is the encrypted password in the database
};

// send email to user
userSchema.methods.sendEmail = async function (scenario) {
  console.log(`Sending ${scenario} email to:`, this.email);

  const user = this;

  // 创建一个 nodemailer 发送器
  const transporter = nodemailer.createTransport({
    service: "Outlook",
    host: "smtp.office365.com",
    secureConnection: false,
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
  });

  console.log(
    "Transporter created, service:",
    transporter.options.service,
    "host:",
    transporter.options.host,
    "port:",
    transporter.options.port,
    "secure:",
    transporter.options.secure,
    "auth:",
    transporter.options.auth
  );

  // Create an authentication token, using the user's id as the payload, set an expiry time and a key
  const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log("Verification token:", verificationToken);
  // Construct the authentication link, using the token as a parameter
  const verificationLink = `http://localhost:5001/api/users/verify/${verificationToken}`;
  console.log("Verification link:", verificationLink);

  // Construct different email content according to different scenarios
  let mailOptions;
  switch (scenario) {
    // In the case of a newly registered account scenario
    case "accountCreation":
      //Email templates for /sending verification emails
      mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: user.email,
        subject: "Please verify your email address",
        text:
          `Hello ${user.firstname},\n\n` +
          `Thank you for registering on OldPhoneDeals. Please click on the link below to verify your email address.\n\n` +
          `${verificationLink}\n\n` +
          `If you did not request this verification email, please ignore it.\n\n` +
          `Best regards,\n` +
          `COMP5347_GROUP7`,
      };
      break;

    case "emailChange":
      mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: user.email,
        subject: "Please verify your email address",
        text:
          `Hello ${user.firstname},\n\n` +
          `You have requested to change your email address on OldPhoneDeals. Please click on the link below to verify your new email address.\n\n` +
          `${verificationLink}\n\n` +
          `If you did not request this verification email, please ignore it.\n\n` +
          `Best regards,\n` +
          `COMP5347_GROUP7`,
      };
      break;

    case "passwordChanged":
      mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: user.email,
        subject: "Password Changed",
        text:
          `Hello ${user.firstname},\n\n` +
          `You have successfully changed your password on OldPhoneDeals. You can now log in with your new password.\n\n` +
          `If you did not change your password, please contact us immediately.\n\n` +
          `Best regards,\n` +
          `COMP5347_GROUP7`,
      };
      break;

    case "forgotPassword":
      // Create a token to reset the password and set it to be valid for 1 hour
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log("Reset token:", resetToken);
      // Construct the reset password link, using the token as a parameter
      const resetLink = `http://localhost:5001/api/users/redirect-reset-password/${resetToken}`;
      console.log("Reset link:", resetLink);
      //Update user's reset password token and expiry date and save to database

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; //1 hour
      await user.save();

      mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: user.email,
        subject: "Password Reset",
        text:
          `Hello ${user.firstname},\n\n` +
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `${resetLink}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n` +
          `Best regards,\n` +
          `COMP5347_GROUP7`,
      };
      break;

    default:
      return res.status(400).json({ message: "Invalid scenario" });
  }


  // send mail with defined transport object
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error); 
    } else {
      console.log("Email sent: " + info.response); 
    }
  });
};


const User = mongoose.model("User", userSchema); 

export default User; 
