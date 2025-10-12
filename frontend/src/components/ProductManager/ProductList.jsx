import React, { useState } from "react";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import "../../styles/ProductManager/ProductList.css";

export default function ProductList({ products, onAddDetail }) {
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setDetails({
      ...details,
      [id]: {
        image: "",
        color: "",
        size: "",
        quantity: 1,
      },
    });
  };

  const handleDetailChange = (id, field, value) => {
    setDetails({
      ...details,
      [id]: { ...details[id], [field]: value },
    });
  };

  const handleAddDetail = (productId, e) => {
    e.preventDefault();
    if (!details[productId]) return;
    onAddDetail(productId, details[productId]);
    setExpandedId(null);
  };

  const renderSizeOptions = (category) => {
    if (category === "Áo") return ["S", "M", "L", "XL", "XXL"];
    if (category === "Giày") return Array.from({ length: 9 }, (_, i) => 36 + i);
    return [];
  };

  return (
    <div className="product-list">
      <h3>Danh sách sản phẩm</h3>
      <table>
        <thead>
          <tr>
            <th>Ảnh sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Ngày tạo</th>
            <th>Chi tiết</th>
            <th>Thêm chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <React.Fragment key={p.id}>
              <tr>
                <td>
                  <img src={p.image} alt={p.name} width="50" height="50" />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price.toLocaleString()}đ</td>
                <td>{p.createdAt}</td>
                <td>
                  {p.variants && p.variants.length > 0 ? (
                    <ul className="variant-list">
                      {p.variants.map((v, i) => (
                        <li key={i}>
                          <strong>Màu:</strong> {v.color} |{" "}
                          <strong>Size:</strong> {v.size} |{" "}
                          <strong>Số lượng:</strong> {v.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <em>Chưa có chi tiết</em>
                  )}
                </td>
                <td>
                  <button
                    className="detail-btn"
                    onClick={() => handleToggle(p.id)}
                    title="Thêm chi tiết"
                  >
                    <IoChevronDownCircleOutline
                      className={`icon ${expandedId === p.id ? "rotate" : ""}`}
                      size={22}
                    />
                  </button>
                </td>
              </tr>

              {expandedId === p.id && (
                <tr className="detail-row">
                  <td colSpan="7">
                    <form
                      onSubmit={(e) => handleAddDetail(p.id, e)}
                      className="detail-form"
                    >
                      <div className="form-group">
                        <label>Ảnh chi tiết:</label>
                        <input
                          type="text"
                          placeholder="URL hình ảnh..."
                          value={details[p.id]?.image || ""}
                          onChange={(e) =>
                            handleDetailChange(p.id, "image", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Màu:</label>
                        <input
                          type="text"
                          placeholder="VD: Đỏ, Xanh..."
                          value={details[p.id]?.color || ""}
                          onChange={(e) =>
                            handleDetailChange(p.id, "color", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Size:</label>
                        <select
                          value={details[p.id]?.size || ""}
                          onChange={(e) =>
                            handleDetailChange(p.id, "size", e.target.value)
                          }
                          required
                        >
                          <option value="">-- Chọn size --</option>
                          {renderSizeOptions(p.category).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Số lượng:</label>
                        <input
                          type="number"
                          min="1"
                          value={details[p.id]?.quantity || 1}
                          onChange={(e) =>
                            handleDetailChange(p.id, "quantity", e.target.value)
                          }
                          required
                        />
                      </div>

                      <button type="submit" className="save-btn">
                        Lưu chi tiết
                      </button>
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
