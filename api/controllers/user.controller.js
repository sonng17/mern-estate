import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import Notification from "../models/notification.model.js";

//Create controller for router
export const test = (req, res, next) => {
  console.log(req.body);
  res.json({
    message: "Hello nhe",
  }); //res cho m nè client
}; //

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          bio: req.body.bio,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin")
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getMyUserListing = async (req, res, next) => {
  try {
    // Tìm listing với id và trạng thái "approved"
    const listing = await Listing.findOne({
      _id: req.params.id,
    });

    // Nếu không tìm thấy, trả về lỗi 404
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Nếu tìm thấy, trả về dữ liệu
    res.status(200).json(listing);
  } catch (error) {
    // Xử lý lỗi khác
    next(error);
  }
};

export const getMyUserListings = async (req, res, next) => {
  const userId = req.params.id;
  // Kiểm tra nếu userId không tồn tại
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }
  try {
    // Truy vấn danh sách theo userRef và status "approved"
    const listings = await Listing.find({
      userRef: userId,
    });

    // Nếu không có danh sách nào được tìm thấy
    if (listings.length === 0) {
      return res
        .status(404)
        .json({ message: "No listings found for this user.", listings: [] });
    }

    // Phản hồi với danh sách tìm thấy
    res.status(200).json(listings);
  } catch (error) {
    // Truyền lỗi sang middleware xử lý lỗi
    next(error);
  }
};

export const getMyUserNotifications = async (req, res, next) => {
  const userId = req.params.id;
  // Kiểm tra nếu userId không tồn tại
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }
  try {
    // Truy vấn danh sách thông báo theo userRef
    const notifications = await Notification.find({
      to: userId,
    });

    // Nếu không có danh sách nào được tìm thấy, trả về thông báo nhưng mã trạng thái vẫn là 200
    if (notifications.length === 0) {
      return res.status(200).json({
        message: "No notifications found for this user.",
        notifications: [],
      });
    }

    // Phản hồi với danh sách thông báo tìm thấy
    res.status(200).json(notifications);
  } catch (error) {
    // Truyền lỗi sang middleware xử lý lỗi
    next(error);
  }
};

export const MarkAsRead = async (req, res, next) => {
  try {
    const { id } = req.params; // ID của người dùng được truyền qua params
    // Cập nhật tất cả thông báo có trường "to" === id, set status thành "read"
    await Notification.updateMany(
      { to: id, status: "unread" },
      { $set: { status: "read" } }
    );

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    next(error); // Gửi lỗi tới middleware xử lý lỗi
  }
};

export const getUserListings = async (req, res, next) => {
  const userId = req.params.id;

  // Kiểm tra nếu userId không tồn tại
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Truy vấn danh sách theo userRef và status "approved"
    const listings = await Listing.find({
      userRef: userId,
      status: "approved",
    });

    // Nếu không có danh sách nào được tìm thấy
    if (listings.length === 0) {
      return res
        .status(404)
        .json({ message: "No listings found for this user." });
    }

    // Phản hồi với danh sách tìm thấy
    res.status(200).json(listings);
  } catch (error) {
    // Truyền lỗi sang middleware xử lý lỗi
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
