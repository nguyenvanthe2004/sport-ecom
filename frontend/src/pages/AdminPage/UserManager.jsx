import React, { useEffect, useState } from "react";
import { getAllUsers, removeUser } from "../../services/api";
import "../../styles/UserManager.css";
import { Trash2, User } from "lucide-react";
import { showToast } from "../../../libs/utils";
import LoadingPage from "../../components/LoadingPage";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Gọi API lấy tất cả user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users || data); // tùy backend trả về
    } catch (err) {
      console.error("Lỗi khi tải danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xóa user
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa người dùng này?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await removeUser(userId); // truyền userId cho API
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      showToast("Xóa người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      showToast("Xóa thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="user-management-container">
      <h2><User size={32} />   Quản lý người dùng</h2>
      <p className="page-subtitle">Theo dõi và quản lý tất cả người dùng</p>
      <table className="user-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Không có người dùng nào.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.role || "user"}</td>
                <td>
                  <button
                    className="btn-delete"
                    disabled={deleting}
                    onClick={() => handleDelete(user._id)}
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
