import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`/api/user/get/${params.userId}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setUserProfile(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [params.userId]);

  useEffect(() => {
    const showUserListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${params.userId}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setUserListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    showUserListings();
  }, []);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center text-slate-700 my-7">
        Profile
      </h1>

      {userProfile ? (
        <>
          <div className="flex flex-col">
            <img
              src={userProfile.avatar}
              alt="profile"
              className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
            />
            <div className="flex flex-col  py-4">
              <div className="text-center font-bold text-slate-700 text-xl mb-4 border-b-2 border-slate-500">
                {userProfile.username}
              </div>

              <div>
                <span className="font-bold text-slate-700">Giới thiệu: </span>
                <span>{userProfile.bio}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">SĐT: </span>
                <span>{userProfile.phone}</span>
              </div>
              <div className="mb-4">
                <span className="font-bold text-slate-700">Email: </span>
                <span>{userProfile.email}</span>
              </div>
            </div>

            <button className="bg-slate-700 text-white rounded-lg p-3 mb-4 uppercase hover:opacity-95 disabled:opacity-80">
              Liên hệ qua zalo
            </button>
            <button className="bg-slate-700 text-white rounded-lg p-3  uppercase hover:opacity-95 disabled:opacity-80">
              Gửi Email
            </button>
          </div>
        </>
      ) : (
        <p>Loading profile details...</p>
      )}

      {userProfile && (
        <h1 className=" mt-7 text-2xl font-semibold mb-2 border-t-2 border-slate-500">
          {userProfile.username} Listings
        </h1>
      )}

      {userListings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Has no listing yet.</p>
      )}
    </div>
  );
}
