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

  //xử lý và handle lỗi khi thao tác trong server
  // Xử lý thành công ? trả về res với statusCode + json : trả về manual Error với statusCode + json
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

  //xử lý và handle lỗi khi thao tác trong server
  // Xử lý thành công ? trả về res với statusCode + json : trả về manual Error với statusCode + json
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = brcyptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credential!"));

    //+Kiến thức: Cookies là phương thức lưu trữ trên web browser, dùng để gửi thông tin tự động trong các yêu cầu HTTP
    //+Kiến thức: tạo một token JWT với các dữ liệu user muốn mã hóa->Gửi token đó qua cookie để lưu trên trình duyệt người dùng.->Token được sử dụng trong các lần yêu cầu tiếp theo để xác minh user, k yêu cầu đnhap lại
    //const token = jwt.sign(payload, secretKey, options); payload: dữ liệu user cần thiết dc sdung để mã hóa
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // Chuỗi xác thực người dùng được lưu trong cookies web để dùng trong các request tiếp theo mà k cần tra lại db
    console.log(token);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true }) //Lưu vào cookies với trường access_token: token và các tùy chọn bảo mật
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
}; ////
