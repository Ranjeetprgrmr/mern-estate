import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {errorHandler} from "../utils/error.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res, next) => {
  // console.log(req.body); let's destructure the request body and save those values in variables and save in the database

  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
      next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try{
    const validUser = await User.findOne({ email });
    if(!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) {
      return next(errorHandler(401, "wrong credentials!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...otherDetails } = validUser._doc;
    res
    .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000), secure: true, sameSite: "none" })
    .status(200)
    .json({
      message: "User logged in successfully",
      // user: validUser,
      details: otherDetails
    });

  }catch(error) {
    next(error);
  }

}