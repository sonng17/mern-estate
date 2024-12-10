import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import brcyptjs from "bcryptjs";
import jwt from "jsonwebtoken";

//-Create controller for router
//+Signup controller for post router
export const signup = async (req, res, next) => {
  //Lấy req
  console.log(req.body);
  const { username, email, password } = req.body;

  //Xử lý res, trả res, handle lỗi. Xử lý thành công ? trả về res với statusCode + json : trả về manual Error với statusCode + json
  try {
    const hashedPassword = brcyptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword }); //create new user để save to db
    await newUser.save(); //save đi
    res.status(201).json("User created successfully!"); //res cho m nè
  } catch (error) {
    //next(errorHandler(550, "error from the function"));//some cases se dung den error manual
    next(error);
  }
}; //

//+Signin controller for post router
export const signin = async (req, res, next) => {
  //Lấy req
  const { email, password } = req.body;

  //Xử lý req, trả res, handle error
  try {
    //Check người dùng trong db
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = brcyptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credential!"));

    //Tạo token và gửi token cho client để client lưu trong cookies
    //Kiến thức: Cookies là phương thức lưu trữ trên web browser, dùng để gửi thông tin tự động trong các yêu cầu HTTP
    //Kiến thức: tạo một token JWT với các dữ liệu user cần mã hóa->Gửi token đó qua cookie để lưu trên trình duyệt người dùng.->Token được sử dụng trong các lần yêu cầu tiếp theo để xác minh user, k yêu cầu đnhap lại
    //Kiến thức: JWT Token là chuỗi xác thực người dùng được lưu trong cookies web để dùng trong các request tiếp theo mà k cần tra lại db
    //const token = jwt.sign(payload, secretKey, options); Tạo token với payload: dữ liệu user cần thiết dc sdung để mã hóa; secretkey: server tự tạo và chỉ server biết; options: dữ liệu thêm cho payload
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true }) //Lưu vào cookies với trường access_token: token và các tùy chọn bảo mật
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  //Lấy req
  const { name, email, photo } = req.body;

  //Xử lý req, trả res, handle error
  try {
    //Check người dùng trong db
    const user = await User.findOne({ email });

    if (user) {
      //Tạo token và gửi token cho client để client lưu trong cookies
      //Kiến thức: Cookies là phương thức lưu trữ trên web browser, dùng để gửi thông tin tự động trong các yêu cầu HTTP
      //Kiến thức: tạo một token JWT với các dữ liệu user cần mã hóa->Gửi token đó qua cookie để lưu trên trình duyệt người dùng.->Token được sử dụng trong các lần yêu cầu tiếp theo để xác minh user, k yêu cầu đnhap lại
      //Kiến thức: JWT Token là chuỗi xác thực người dùng được lưu trong cookies web để dùng trong các request tiếp theo mà k cần tra lại db
      //const token = jwt.sign(payload, secretKey, options); Tạo token với payload: dữ liệu user cần thiết dc sdung để mã hóa; secretkey: server tự tạo và chỉ server biết; options: dữ liệu thêm cho payload
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true }) //Lưu vào cookies với trường access_token: token và các tùy chọn bảo mật
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = brcyptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true }) //Lưu vào cookies với trường access_token: token và các tùy chọn bảo mật
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
////
