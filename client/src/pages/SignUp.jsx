import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      } else {
        setLoading(false);
        setError(null);
        toast.success("Đăng ký thành công!", {
          position: "top-center", // Hiển thị ở trên và giữa màn hình
          autoClose: 1000, // Tự động đóng sau 1 giây
        });
        setTimeout(() => navigate("/sign-in"), 1000); // Chuyển hướng sau 1 giây
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="pb-28 p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 font-semibold text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Đăng ký"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Đã có tài khoản?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 font-semibold underline">
            Đăng nhập
          </span>
        </Link>
      </div>
      <div>{error && <p className="text-red-500 mt-5">{error}</p>}</div>

      {/* Thêm container cho React Toastify */}
      <ToastContainer />
    </div>
  );
}
