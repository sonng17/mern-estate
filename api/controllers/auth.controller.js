import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import brcyptjs from "bcryptjs";
import jwt from "jsonwebtoken";

//Create controller for router
//-signup controller for post router
export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = brcyptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword }); //create new user để save to db

  //xử lý và handle lỗi ở đây nhé
  try {
    await newUser.save(); //save đi
    res.status(201).json("User created successfully!"); //res cho m nè
  } catch (error) {
    //next(errorHandler(550, "error from the function"));//some cases se dung den error manual
    next(error);
  }
}; //

//-signin controller for post router
export const signin = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = brcyptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credential!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
}; ////
