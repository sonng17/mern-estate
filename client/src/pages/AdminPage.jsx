import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
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
        console.log(error);
      }
    };

    fetchUsers();
    fetchPendingListings();
  }, [currentUser]);

  //User tab-----------------
  // Handle Get User
  const handleGetUser = (id) => {
    window.open(`/profile/${id}`, "_blank");
  };

  // Handle Delete User
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`/api/admin/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id)); // Cập nhật danh sách user sau khi xóa
      } else {
        const data = await res.json();
        message.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      message.error("An error occurred while deleting the user");
      console.log(error);
    }
  };

  // Cấu hình các cột của bảng User
  const userColumns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img
          src={avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleGetUser(record._id)}>
            Get
          </Button>
          <Button type="default">Update</Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDeleteUser(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Render bảng danh sách User
  const renderUsersTable = () => {
    return (
      <Table
        dataSource={users}
        columns={userColumns}
        rowKey={(record) => record._id} // Dùng _id làm key cho từng hàng
        pagination={{ pageSize: 5 }}
      />
    );
  };

  //Listings tab-----------------
  // Render bảng danh sách Listing
  const renderListingsTable = () => {
    return (
      <Table
        dataSource={users}
        columns={userColumns}
        rowKey={(record) => record._id} // Dùng _id làm key cho từng hàng
        pagination={{ pageSize: 5 }}
      />
    );
  };
  //Pending listing tab-----------------

  // Cấu hình các tab
  const items = [
    {
      key: "1",
      label: "Users",
      children: renderUsersTable(),
    },
    {
      key: "2",
      label: "Listings",
      children: renderListingsTable(),
    },
    {
      key: "3",
      label: "Pending Listings",
      children: (
        <div>
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
        </div>
      ),
    },
  ];

  return (
    <div>
      {currentUser && currentUser.role === "admin" && (
        <div className="min-h-full">
          <h1 className="text-3xl font-semibold text-center text-slate-700 my-7">
            Admin Dashboard
          </h1>
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      )}
    </div>
  );
}
