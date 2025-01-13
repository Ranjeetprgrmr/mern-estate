import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import multer from "multer";

const upload = multer({
  dest: "./uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const test = (req, res) => {
  res.json({
    message: "hello world",
  });
};

export const updateUser = async (req, res, next) => {
  console.log("req.params", req.params);
  console.log("req.user.id", req.user.id);
  console.log("req.params.id", req.params.id);
  if (!req.user || !req.params.id) {
    return next(errorHandler(400, "Invalid request"));
  }
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "You can only update your account!"));
    }

    const updateData = {};

    if (req.body.username) {
      updateData.username = req.body.username;
    }

    if (req.body.email) {
      updateData.email = req.body.email;
    }

    if (req.body.password && req.body.password !== "") {
      updateData.password = await bcryptjs.hash(req.body.password, 10);
    }

    if (req.file && req.file.fieldname === "avatar") {
      const avatar = req.file;
      const avatarPath = avatar.path;
      updateData.avatar = avatarPath;
    }
 
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateData,
      },
      { new: true }
    );

    const { password, ...otherDetails } = updateUser._doc;

    res.status(200).json(otherDetails);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only delete your account!"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id }).lean();
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "You can only view your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    // const user = await User.findById(req.params.id).lean();
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found"));

    const { password: pass, ...otherDetails } = user._doc;
    res.status(200).json(otherDetails);
  } catch (error) {
    next(error);
  }
};
