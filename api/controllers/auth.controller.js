import { errorHandler } from "../error.js";
import User from "../models/user.model.js";
import brcyptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = brcyptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    //next(errorHandler(550, "error from the function"));//some cases se dung den error manual
    next(error);
  }
};
