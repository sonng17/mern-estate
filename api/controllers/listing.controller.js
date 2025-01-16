import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }
  try {
    // Thêm trường status = 'pending' vào req.body
    req.body.status = "pending";

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    // Tìm listing theo ID
    const listing = await Listing.findOne({
      _id: req.params.id,
    });
    // Nếu không tìm thấy listing
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    // Nếu status là "approved", trả về listing
    if (listing.status === "approved") {
      return res.status(200).json(listing);
    } else {
      if (listing.userRef !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json("not allow");
      } else {
        return res.status(200).json(listing);
      }
    }
  } catch (error) {
    // Xử lý lỗi khác
    next(error);
  }
};

export const getListings = async (req, res, next) => {
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
    const provinceRef = req.query.provinceRef || "";
    const districtRef = req.query.districtRef || "";
    const wardRef = req.query.wardRef || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    // Xử lý areaRange
    const areaRange = req.query.areaRange;
    let areaFilter = {};
    if (areaRange) {
      if (areaRange === "greaterThan200") {
        areaFilter = { $gt: 200 }; // Lọc diện tích > 200
      } else {
        const [minArea, maxArea] = areaRange.split("-").map(Number);
        areaFilter = { $gte: minArea, $lte: maxArea };
      }
    }

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      provinceRef: { $regex: provinceRef, $options: "i" },
      districtRef: { $regex: districtRef, $options: "i" },
      wardRef: { $regex: wardRef, $options: "i" },
      offer,
      furnished,
      parking,
      type,
      status: "approved",
      ...(areaRange && { area: areaFilter }),
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getSameListings = async (req, res, next) => {
  try {
    const { id } = req.params; // Lấy id bài đăng từ params

    // Tìm bài đăng ban đầu theo id
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    // Tìm các bài đăng cùng district, ngoại trừ bài đăng ban đầu
    const sameDistrictListings = await Listing.find({
      districtRef: listing.districtRef,
      status: "approved",
      _id: { $ne: id }, // Loại trừ bài đăng ban đầu
    });

    res.status(200).json({ listings: sameDistrictListings });
  } catch (error) {
    next(error); // Truyền lỗi tới middleware xử lý lỗi
  }
};
