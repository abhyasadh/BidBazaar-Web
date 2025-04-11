const { User, OTP } = require("../models/models.js");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const cloudinary = require("cloudinary");
const fs = require("fs");
const fileType = import("file-type");

const OTP_EXPIRY_TIME = 60 * 1000;
const MAX_OTP_ATTEMPTS = 3;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

function hash(string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

function timeFromDatabase(date) {
  return new Date(date).getTime() - new Date().getTimezoneOffset() * 60 * 1000;
}

async function fileMimeInfo(image) {
  const fileBuffer = fs.readFileSync(image.path);
  const info = await (await fileType).fileTypeFromBuffer(fileBuffer);

  return info;
}

function getPublicIdFromUrl(cloudinaryUrl) {
  try {
    const url = new URL(cloudinaryUrl);
    const parts = url.pathname.split("/Profile%20Pictures/")[1];
    const withoutExtension = parts.replace(/\.[^/.]+$/, "");
    return withoutExtension.startsWith("/")
      ? withoutExtension.slice(1)
      : withoutExtension;
  } catch (err) {
    console.error("Invalid URL:", err);
    return null;
  }
}

const login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    const hashedPhone = hash(phone);
    const userList = await User.findBy("phone", hashedPhone);
    const user = userList[0];
    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect Phone Number!",
      });
    }

    if (
      user.accountLockedUntil &&
      timeFromDatabase(user.accountLockedUntil) > Date.now()
    ) {
      const lockoutTimeRemaining = Math.ceil(
        (timeFromDatabase(user.accountLockedUntil) - Date.now()) / 60000
      );
      return res.json({
        success: false,
        message: `Account is locked. Try again in ${lockoutTimeRemaining} minutes.`,
      });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.accountLockedUntil = new Date(Date.now() + LOCKOUT_DURATION)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        user.failedLoginAttempts = 0;
        await User.update(user.id, user);
        return res.json({
          success: false,
          message:
            "Account is locked due to multiple failed login attempts. Try again later.",
        });
      }
      await User.update(user.id, user);
      return res.json({
        success: false,
        message: "Incorrect Password!",
      });
    }

    if (user.failedLoginAttempts > 0 || user.accountLockedUntil) {
      user.failedLoginAttempts = 0;
      user.accountLockedUntil = null;
      await User.update(user.id, user);
    }

    const newUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profileImageURL + "?v=" + Date.now(),
      citizenshipImage: [user.citizenshipFront, user.citizenshipBack],
      isVerified: user.verified,
      isAdmin: user.isAdmin,
    };

    req.session.user = newUser;
    res.status(200).json({
      success: true,
      message: "Login Successful!",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const register = async (req, res) => {
  const { phone, firstName, lastName, email, password } = req.body;
  const { profileImage } = req.files;
  let profileImageURL = null;

  let validationErrors = [];

  if (!firstName || !lastName || !phone || !password || !email) {
    validationErrors.push("All fields are required!");
    return res.json({ success: false, message: validationErrors.join("\n") });
  }
  if (!firstName.match(/^[a-zA-Z]+$/)) {
    validationErrors.push("Invalid first name!");
  }
  if (!lastName.match(/^[a-zA-Z]+$/)) {
    validationErrors.push("Invalid last name!");
  }
  if (!phone.match(/^[0-9]+$/)) {
    validationErrors.push("Invalid phone number!");
  }
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    validationErrors.push("Invalid email format!");
  }
  if (profileImage) {
    try {
      const mimeInfo = await mime(profileImage);

      if (!mimeInfo || !mimeInfo.mime.startsWith("image/")) {
        validationErrors.push("Invalid file format. Please upload an image!");
      } else {
        const uploadedImage = await cloudinary.v2.uploader.upload(
          profileImage.path,
          {
            folder: "Profile Pictures",
            crop: "scale",
          }
        );
        profileImageURL = uploadedImage.secure_url;
      }
    } catch (error) {
      console.log(error);
      validationErrors.push("Invalid file format. Please upload an image!");
    }
  }
  if (!/[A-Z]/.test(password)) {
    validationErrors.push(
      "Password must contain at least one uppercase letter."
    );
  }
  if (!/[a-z]/.test(password)) {
    validationErrors.push(
      "Password must contain at least one lowercase letter."
    );
  }
  if (!/\d/.test(password)) {
    validationErrors.push("Password must contain at least one number.");
  }
  if (!/[!@#$%^&*()\-=+_{}[\]:;<>,.?/~]/.test(password)) {
    validationErrors.push(
      "Password must contain at least one special character."
    );
  }
  if (password.length < 8) {
    validationErrors.push("Password must be at least 8 characters long.");
  }
  if (validationErrors.length > 0)
    return res.json({ success: false, message: validationErrors.join("\n") });

  try {
    const hashedPhone = hash(phone);
    const existingUser = await User.findBy("phone", hashedPhone);
    if (existingUser.length !== 0) {
      return res.json({
        success: false,
        message: "User already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      phone: hashedPhone,
      password: encryptedPassword,
      email: email,
      profileImageURL: profileImageURL,
    };

    await User.insert(newUser);
    res.status(200).json({
      success: true,
      message: "Registration successful!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const sendOTP = async (req, res) => {
  const { phone, type } = req.body;

  if (!phone) {
    return res.json({
      success: false,
      message: "Please enter phone number!",
    });
  }

  try {
    const hashedPhone = hash(phone);
    const existingUser = await User.findBy("phone", hashedPhone);
    if (!existingUser.length >= 1 && type === "reset") {
      return res.json({
        success: false,
        message: "User not found!",
      });
    } else if (existingUser.length >= 1 && type === "register") {
      return res.json({
        success: false,
        message: "User already exists!",
      });
    }

    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    console.log("Otp: ", otp);

    const otpEntry = {
      otp: hash(otp),
      phone: hash(phone),
    };

    // const messageBody = `OTP for BidBazaar: ${otp}`;
    // const msgOptions = {
    //     from: process.env.FROM_NUMBER,
    //     to: '+977'+phone,
    //     body: messageBody,
    // };

    req.session.resetPhone = hashedPhone;

    // await client.messages.create(msgOptions);
    await OTP.insertAllowDuplicates(otpEntry, "otp", otpEntry.otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  const hashedPhone = hash(phone);

  const otpData = await OTP.findBy("phone", hashedPhone);

  if (otpData.length === 0) {
    return res.json({
      success: false,
      message: "OTP not found. Please request a new OTP.",
    });
  }

  currentOtp = otpData[0];

  if (Date.now() > new Date(currentOtp.updatedAt).getTime() + OTP_EXPIRY_TIME) {
    OTP.delete(currentOtp.id);
    return res.json({
      success: false,
      message: "OTP expired. Please request a new OTP.",
    });
  }

  if (currentOtp.attempts >= MAX_OTP_ATTEMPTS) {
    OTP.delete(currentOtp.id);
    return res.json({
      success: false,
      message: "Maximum OTP attempts reached. Please request a new OTP!",
    });
  }

  const hashedOTP = hash(`${otp}`);

  if (hashedOTP !== currentOtp.otp) {
    currentOtp.attempts += 1;
    OTP.update(currentOtp.id, currentOtp);
    return res.json({
      success: false,
      message: "Incorrect OTP!",
    });
  }

  OTP.delete(currentOtp.id);

  return res.json({
    success: true,
    message: "OTP verified successfully!",
  });
};

const updatePassword = async (req, res) => {
  const { previousPassword, password } = req.body;
  const hashedPhone = req.session.resetPhone;

  if (!previousPassword && !hashedPhone) {
    return res.json({
      success: false,
      message: "Session expired or invalid session!",
    });
  }

  try {
    let existingUser = null;

    if (hashedPhone) {
      existingUser = await User.findBy("phone", hashedPhone);
    } else if (previousPassword) {
      existingUser = await User.findBy("id", req.session.user.id);
    }

    if (!existingUser) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    } else {
      if (previousPassword) {
        const result = await bcrypt.compare(
          previousPassword,
          existingUser[0].password
        );
        if (!result) {
          return res.json({
            success: false,
            message: "Incorrect Password!",
          });
        }
      }

      let validationErrors = [];

      if (!/[A-Z]/.test(password)) {
        validationErrors.push(
          "Password must contain at least one uppercase letter."
        );
      }
      if (!/[a-z]/.test(password)) {
        validationErrors.push(
          "Password must contain at least one lowercase letter."
        );
      }
      if (!/\d/.test(password)) {
        validationErrors.push("Password must contain at least one number.");
      }
      if (!/[!@#$%^&*()\-=+_{}[\]:;<>,.?/~]/.test(password)) {
        validationErrors.push(
          "Password must contain at least one special character."
        );
      }
      if (password.length < 8) {
        validationErrors.push("Password must be at least 8 characters long.");
      }
      if (validationErrors.length > 0)
        return res.json({
          success: false,
          message: validationErrors.join("\n"),
        });

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      const user = existingUser[0];

      user.password = encryptedPassword;
      await User.update(user.id, user);

      if (hashedPhone) {
        req.session.resetPhone = null;
      }

      return res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const update = async (req, res) => {
  const userId = req.session.user.id;
  if (!userId) {
    return res.json({
      success: false,
      message: "Session Expired. Please Login Again!",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.json({
      success: false,
      message: "Session Expired. Please Login Again!",
    });
  }

  const { firstName, lastName, email, verified, accountLockedUntil } = req.body;
  const { profileImage, citizenshipFront, citizenshipBack } = req.files;

  let profileImageURL = null;
  let citizenshipFrontURL = null;
  let citizenshipBackURL = null;

  let validationErrors = [];

  if (firstName && !firstName.match(/^[a-zA-Z]+$/)) {
    validationErrors.push("Invalid first name!");
  }
  if (lastName && !lastName.match(/^[a-zA-Z]+$/)) {
    validationErrors.push("Invalid last name!");
  }
  if (email && !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    validationErrors.push("Invalid email format!");
  }
  if (profileImage) {
    const mimeInfo = await fileMimeInfo(profileImage);

    if (!mimeInfo || !mimeInfo.mime.startsWith("image/")) {
      validationErrors.push("Invalid file format. Please upload an image!");
    } else {
      try {
        const uploadedImage = await cloudinary.v2.uploader.upload(
          profileImage.path,
          {
            public_id: getPublicIdFromUrl(user.profileImageURL),
            overwrite: true,
            invalidate: true,
            resource_type: "image",
            folder: "Profile Pictures",
          }
        );
        profileImageURL = uploadedImage.secure_url;
      } catch (e) {
        console.log(e);
      }
    }
  }
  if (citizenshipFront && citizenshipBack) {
    const citizenship = [citizenshipFront, citizenshipBack];

    for (const image of citizenship) {
      const fileBuffer = fs.readFileSync(image.path);
      const mimeInfo = await (await fileType).fileTypeFromBuffer(fileBuffer);

      if (!mimeInfo || !mimeInfo.mime.startsWith("image/")) {
        return res.json({ success: false, message: "Invalid file format!" });
      }
    }

    const uploadPromises = citizenship.map(async (image) => {
      const uploadedImage = await cloudinary.v2.uploader.upload(image.path, {
        folder: "Citizenship",
        crop: "scale",
      });
      return uploadedImage.secure_url;
    });

    imagesUrl = await Promise.all(uploadPromises);

    citizenshipFrontURL = imagesUrl[0];
    citizenshipBackURL = imagesUrl[1];

    user.verified = "Pending";
  }

  if (validationErrors.length > 0)
    return res.json({ success: false, message: validationErrors.join("\n") });

  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;
  user.email = email ?? user.email;
  user.profileImageURL = profileImageURL ?? user.profileImageURL;
  user.citizenshipFront = citizenshipFrontURL ?? user.citizenshipFront;
  user.citizenshipBack = citizenshipBackURL ?? user.citizenshipBack;
  user.verified = verified ?? user.verified;
  user.accountLockedUntil = accountLockedUntil ?? user.accountLockedUntil;

  try {
    const result = await User.update(user.id, user);
    if (result) {
      const newUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profileImageURL + "?v=" + Date.now(),
        citizenshipImage: [user.citizenshipFront, user.citizenshipBack],
        isVerified: user.verified,
        isAdmin: user.isAdmin,
      };
      req.session.user = newUser;
      res.status(200).json({
        success: true,
        message: "Details updated!",
        user: newUser,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to update details!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const logout = async (req, res) => {
  await req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Error logging out." });
    }
    res.clearCookie("connect.sid");
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  });
};

const getSession = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ success: true, user: req.session.user });
  }
  return res.status(200).json({ success: false, message: "No active session" });
};

module.exports = {
  login,
  register,
  sendOTP,
  verifyOTP,
  updatePassword,
  update,
  logout,
  getSession,
};
