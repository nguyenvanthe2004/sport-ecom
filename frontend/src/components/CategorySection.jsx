import React, { useEffect, useState } from "react";
import { CategoryAPI } from "../services/api";
import "../styles/CategorySection.css";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await CategoryAPI.getAll();
        setCategories(res);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="category-section">
      
      {loading ? (
        <div className="loading-container">
          <p className="loading">Đang tải...</p>
        </div>
      ) : (
        <div className="category-list">
          <h6 className="section-title-category">Danh mục nổi bật: </h6>
          {categories.length > 0 ? (
            categories.map((c) => (
              <button key={c._id} className="category-item">
                {c.name}
              </button>
            ))
          ) : (
            <p className="no-category">Không có danh mục</p>
          )}
        </div>
      )}
    </section>
  );
};

export default CategorySection;