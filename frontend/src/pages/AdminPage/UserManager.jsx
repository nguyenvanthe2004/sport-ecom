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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // 🔹 Gọi API lấy user theo phân trang
  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const data = await getAllUsers(page, limit); // API trả về { users, totalPages }
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi tải danh sách user:", err);
      showToast("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 🔹 Xóa user
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa người dùng này?"
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await removeUser(userId); 
      showToast("Xóa người dùng thành công!");
      fetchUsers(page); // reload trang hiện tại
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      showToast("Xóa thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  if (loading) return <LoadingPage />;

  return (
    <div className="user-management-container">
      <h2>
        <User size={32} /> Quản lý người dùng
      </h2>
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
                <td>{(page - 1) * limit + index + 1}</td>
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

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="pagination mt-3 text-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManager;
