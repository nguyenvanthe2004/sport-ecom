import React from "react";
import "../../styles/CategoryManager/CategoryList.css";

export default function CategoryList({ categories }) {
  return (
    <table className="category-table">
      <thead>
        <tr>
          <th>Tên Danh mục</th>
          <th>Tất cả</th>
          <th>Sản phẩm</th>
          <th>Dịch vụ</th>
          <th>Bài viết</th>
        </tr>
      </thead>
      <tbody>
        {categories.length === 0 ? (
          <tr>
            <td colSpan="5" className="no-data">
              Chưa có danh mục nào
            </td>
          </tr>
        ) : (
          categories.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
