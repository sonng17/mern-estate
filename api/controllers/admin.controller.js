import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import Notification from "../models/notification.model.js";

//Admin controller
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getPendingListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: "pending" });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const approveListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm và cập nhật trạng thái bài đăng
    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    // Kiểm tra bài đăng có tồn tại không
    if (!listing) {
      return res.status(404).json({ message: "Bài đăng không tồn tại." });
    }

    // Tạo thông báo
    const notification = new Notification({
      from: req.user.id, // ID của admin
      to: listing.userRef, // ID của người dùng sở hữu bài đăng
      content: `Bài đăng "${listing?.name}" của bạn đã được duyệt thành công!`,
      type: "approval",
      listingRef: id, // Tham chiếu đến bài đăng
    });

    // Lưu thông báo vào cơ sở dữ liệu
    await notification.save();

    // Trả về phản hồi thành công
    res.status(200).json({ message: "Approve success!", listing });
  } catch (error) {
    // Gọi middleware xử lý lỗi
    next(error);
  }
};

export const rejectListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    const notification = new Notification({
      from: req.user.id, // ID của admin
      to: listing.userRef, // ID của người dùng sở hữu bài đăng
      content: `Bài đăng "${listing?.name}" của bạn đã bị từ chối!`,
      type: "rejection",
      listingRef: id,
    });
    await notification.save();
    res.status(200).json({ message: "Reject success!", listing });
  } catch (error) {
    next(error);
  }
};

export const pendListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: "pending" },
      { new: true }
    );
    res.status(200).json("Pend success!");
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

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef && req.user.role !== "admin") {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUsersAdmin = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
      status: "approved",
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingsAdmin = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
      status: "approved",
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
