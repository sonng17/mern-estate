/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Để hiển thị tiếng Việt

export default function ListingItem({
  listing,
  isMyListing = false,
  handleListingDelete,
}) {
  // Tính khoảng cách thời gian từ thời điểm tạo đến hiện tại
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), {
    addSuffix: true, // Thêm hậu tố như "trước"
    locale: vi, // Đặt ngôn ngữ tiếng Việt
  });
  return (
    <div className="bg-white shadow-2xl transform translate-y-[-4px] overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
      </Link>

      <div className="p-3 flex flex-col gap-2 w-full">
        <Link to={`/listing/${listing._id}`}>
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex justify-between">
            <div>
              <p className="text-slate-500 mt-2 font-semibold ">
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}{" "}
                VND
                {listing.type === "rent" && "/tháng"}
              </p>
              <p className="text-slate-500 font-semibold ">{timeAgo}</p>
            </div>
            {listing.type === "rent" ? (
              <div className="cursor-pointer font-semibold bg-yellow-400 text-white flex items-center justify-center rounded-2xl px-2 mt-5">
                Cho thuê
              </div>
            ) : (
              <div className="cursor-pointer font-semibold bg-red-600 text-white flex items-center justify-center rounded-2xl px-4 mt-5">
                Bán
              </div>
            )}
          </div>

          <div className="text-slate-700 flex gap-4 mt-2">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} phòng ngủ `
                : `${listing.bedrooms} phòng ngủ `}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} phòng tắm `
                : `${listing.bathrooms} phòng tắm `}
            </div>
            <div className="font-bold text-xs">{listing.area}m2</div>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <div className="cursor-pointer font-semibold bg-blue-500 text-white flex items-center justify-center rounded-3xl px-4">
              {listing.provinceRef}
            </div>
            <div className="cursor-pointer font-semibold bg-blue-500 text-white flex items-center justify-center rounded-full px-4">
              {listing.districtRef}
            </div>
            <div className="cursor-pointer font-semibold bg-blue-500 text-white flex items-center justify-center rounded-full px-4">
              {listing.wardRef}
            </div>
          </div>
        </Link>
        {isMyListing ? (
          <div className="flex h-8 gap-2  overflow-hidden">
            {listing.status === "approved" ? (
              <>
                <div className="flex-1 font-semibold border-2 bg-green-700 text-white flex items-center justify-center ">
                  Đã duyệt
                </div>
              </>
            ) : listing.status === "rejected" ? (
              <div className="flex-1 font-semibold border-2 bg-red-700 text-white flex items-center justify-center ">
                Từ chối
              </div>
            ) : (
              <>
                <div className="flex-1 font-semibold border-2 bg-yellow-500 text-white flex items-center justify-center ">
                  Chờ duyệt
                </div>
              </>
            )}

            <div className="flex-1 font-semibold border-2 text-blue-500 flex items-center justify-center  hover:bg-slate-200">
              <Link to={`/update-listing/${listing._id}`}>
                <div>Cập nhật</div>
              </Link>
            </div>
            <button
              onClick={() => {
                handleListingDelete(listing._id);
              }}
              className="flex-1 font-semibold border-2 text-blue-500 flex items-center justify-center  hover:bg-red-600 hover:text-white"
            >
              Xóa
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
