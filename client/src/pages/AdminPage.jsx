import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);

  useEffect(() => {
    // Fetch Users
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/getAllUsers");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          const data = await res.json();
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch Pending Listings
    const fetchPendingListings = async () => {
      try {
        const res = await fetch("/api/admin/getPendingListings");
        if (res.ok) {
          const data = await res.json();
          setPendingListings(data);
        } else {
          const data = await res.json();
          console.log(data.message);
        }
      } catch (error) {
        console.log(error)
      }
    };

    fetchUsers();
    fetchPendingListings();
  }, [currentUser]);

  return (
    <div>
      {currentUser && currentUser.role === "admin" && (
        <div>
          <h1>Admin Dashboard</h1>

          <section>
            <h2>Users</h2>
            {users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li key={user._id}>
                    {user.name} - {user.email} ({user.role})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </section>

          <section>
            <h2>Pending Listings</h2>
            {pendingListings.length > 0 ? (
              <ul>
                {pendingListings.map((listing) => (
                  <li key={listing._id}>
                    {listing.name} - {listing.status}
                    <button>Approve</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending listings found.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
