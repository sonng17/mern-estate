import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    provinceRef: "",
    districtRef: "",
    wardRef: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    area: 10,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      const data = await response.json();
      setLocationData(data); // Lưu dữ liệu toàn bộ tỉnh, quận, xã
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    const selectedProvince = locationData.find(
      (province) => province.code === +provinceCode
    );
    setDistricts(selectedProvince.districts); // Lấy danh sách quận
    setFormData({
      ...formData,
      provinceRef: selectedProvince.name,
      districtRef: "",
      wardRef: "",
    });
    setWards([]); // Reset danh sách xã
  };
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    if (!districtCode) {
      setWards([]);
      return;
    }
    const selectedDistrict = districts.find(
      (district) => district.code === +districtCode
    );
    setWards(selectedDistrict.wards); // Lấy danh sách xã
    setFormData({
      ...formData,
      districtRef: selectedDistrict.name,
      wardRef: "",
    });
  };
  const handleWardChange = (e) => {
    const wardName = e.target.value;
    setFormData({
      ...formData,
      wardRef: wardName,
    });
  };
  useEffect(() => {
    fetchProvinces();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`${API_BASE_URL}/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
        credentials: "include", // Đảm bảo gửi cookie kèm theo yêu cầu
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      toast.success("Đăng tin thành công! Chờ xét duyệt", {
        position: "top-center", // Hiển thị ở trên và giữa màn hình
        autoClose: 1000, // Tự động đóng sau 1 giây
      });
      setTimeout(() => navigate(`/listing/${data._id}`), 1000); // Chuyển hướng sau 1 giây
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  console.log(formData);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Tạo bài đăng</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* --------Phần tử 1--------- */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Title bài đăng"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="100"
            minLength="10"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <textarea
            type="text"
            placeholder="Mô tả"
            className="border p-3 rounded-lg"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <label htmlFor="province">Tỉnh/Thành phố:</label>
          <select id="province" onChange={handleProvinceChange}>
            <option value="">Chọn tỉnh/thành phố</option>
            {locationData.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>

          <label htmlFor="district">Quận/Huyện:</label>
          <select
            id="district"
            onChange={handleDistrictChange}
            disabled={!districts.length}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>

          <label htmlFor="ward">Xã/Phường:</label>
          <select
            id="ward"
            onChange={handleWardChange}
            disabled={!wards.length}
          >
            <option value="">Chọn xã/phường</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>

          {/* select choices */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Bán</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Cho thuê</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Có chỗ đỗ xe</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Trang bị nội thất</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* select room number */}
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Phòng ngủ</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Phòng tắm</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="area"
                  min="1"
                  max="1000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.area}
                />
                <p>Diện tích (m2)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="500000"
                max="50000000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Giá gốc</p>
                {formData.type === "rent" && (
                  <span className="text-xs">(VND/tháng)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="500000"
                  max="50000000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Giá đã giảm</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">(VND/tháng)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* --------Phần tử 2--------- */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Ảnh:
            <span className="font-normal text-gray-600 ml-2">
              Ảnh đầu sẽ được đặt làm ảnh cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 font-semibold text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 font-semibold text-red-700 rounded-lg hover:opacity-75"
                >
                  Xóa
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 font-bold bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Đang tạo..." : "Đăng bài"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
      {/* Thêm container cho React Toastify */}
      <ToastContainer />
    </main>
  );
}
